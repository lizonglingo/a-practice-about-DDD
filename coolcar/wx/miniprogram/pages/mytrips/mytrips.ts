import { IAppOption } from "../../appoption"
import { rental } from "../../service/proto_gen/rental/rental_pb"
import { TripService } from "../../service/trip"
import { formatDuration, formatFee } from "../../utils/format"
import { routing } from "../../utils/routing"
import { getUserInfo } from "../../utils/wxapi"

interface Trip {
    id: string
    shortId: string
    start: string
    end: string
    duration: string
    fee: string
    distance: string
    status: string
}

interface MainItem {
    id: string
    navId: string
    navScrollId: string
    data: Trip
}

interface NavItem {
    id: string
    mainId: string
    label: string
}

interface MainItemQueryRequest {
    id: string
    top: number
    dataset: {
        navId: string
        navScrollId: string
    }
}


const tripStatusMap = new Map([
    [rental.v1.TripStatus.IN_PROGRESS, '进行中'],
    [rental.v1.TripStatus.FINISHED, '已完成'],
    //[rental.v1.TripStatus.TS_NOT_SPECIFIED, '未知'],
])

Page({
    scrollStates: {
        mainItems: [] as MainItemQueryRequest[],
    },

    layoutReslover: undefined as ((value: unknown) => void) | undefined,

    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 500,
        circular: true,
        current: '0',
        promotionItems: [
            {
                img: 'https://img3.mukewang.com/620c5c810001d1f417920764.jpg',
                promotionID: '1',
            },
            {
                img: 'https://img2.mukewang.com/6216fef5000134df17920764.jpg',
                promotionID: '2',
            },
            {
                img: 'https://img4.mukewang.com/62184a9e00011dbd17920764.jpg',
                promotionID: '3',
            },
            {
                img: 'https://img3.mukewang.com/62187adc0001030417920764.jpg',
                promotionID: '4',
            },
            {
                img: 'https://img.mukewang.com/6218389d0001e43e17920764.jpg',
                promotionID: '5',
            },
        ],
        avatarURL: '',
        tripsHeight: 0,
        mainItems: [] as MainItem[],
        navItems: [] as NavItem[],
        navCount: 0,
        mainScroll: '',
        navSel: '',
        navScroll: '',
    },
    onLoad() {
        const layoutReady = new Promise((resolve) => {
            this.layoutReslover = resolve
        })

        Promise.all([TripService.getTrips(), layoutReady]).then(([trips]) => {
            this.populateTrips(trips.trips!)
        })

        getApp<IAppOption>().globalData.userInfo.then(userInfo => {
            this.setData({
                avatarURL: userInfo.avatarUrl,
            })
        })

    },
    onReady() {

        wx.createSelectorQuery().select('#heading')
            .boundingClientRect(rect => {
                const height = wx.getSystemInfoSync().windowHeight - rect.height
                this.setData({
                    tripsHeight: height,
                    navCount: Math.round(height / 50),
                }, () => {
                    if (this.layoutReslover) {
                        this.layoutReslover(1)
                    }
                })
            }).exec()
    },
    populateTrips(trips: rental.v1.ITripEntity[]) {
        const mainItems: MainItem[] = []
        const navItems: NavItem[] = []
        let navSel = ''
        let prevNav = ''
        for (let i = 0; i < trips.length; i++) {
            const trip = trips[i]
            const mainId = 'main-' + i
            const navId = 'nav-' + i
            const shortId = trip.id?.substring(trip.id.length - 6)
            if (!prevNav) {
                prevNav = navId
            }
            // end: '宿舍',
            // distance: '2.4公里',
            // duration: '0时12分钟',
            // fee: '5.2元',
            const tripData: Trip = {
                id: trip.id!,
                shortId: '****' + shortId,
                start: trip.trip?.start?.poiName || '未知',
                end: '',
                distance: '',
                duration: '',
                fee: '',
                status: tripStatusMap.get(trip.trip?.status!) || '未知',
            }
            const end = trip.trip?.end
            if (end) {
                tripData.end = end.poiName || '未知'
                tripData.distance = end.kmDriven?.toFixed(1) + '公里'
                tripData.fee = formatFee(end.feeCent || 0)
                const dur = formatDuration((end.timestampSec || 0) - (trip.trip?.start?.timestampSec || 0))
                tripData.duration = `${dur.hh}时${dur.mm}分`
            }
            // console.log(trips)
            mainItems.push({
                id: mainId,
                navId: navId,
                navScrollId: prevNav,
                data: tripData,
            })
            navItems.push({
                id: navId,
                mainId: mainId,
                label: shortId || '',
            })
            if (i === 0) {
                navSel = navId
            }
            prevNav = navId
        }

        console.log('nav count:', this.data.navCount)
        for (let i = 0; i < this.data.navCount - 1; i++) {
            navItems.push({
                id: '',
                mainId: '',
                label: '',
            })
        }

        this.setData({
            mainItems: mainItems,
            navItems: navItems,
            navSel: navSel,
        }, () => {
            this.prepareScrollStates()
        })
    },

    prepareScrollStates() {
        wx.createSelectorQuery().selectAll('.main-item')
            .fields({
                id: true,
                dataset: true,
                rect: true
            }).exec(res => {
                this.scrollStates.mainItems = res[0]
            })
    },

    onSwiperChange(e: any) {
        //console.log(e)
    },

    onPromotionItemTap(e: any) {
        //console.log(e)
    },

    onRegisterTap() {
        wx.navigateTo({
            // url: '/pages/register/register',
            url: routing.register(),
        })
    },
    onGetUserInfo(e: any) {
        const userInfo: WechatMiniprogram.UserInfo = e.detail.userInfo
        if (userInfo) {
            getApp<IAppOption>().resolveUserInfo(userInfo)
            this.setData({
                avatarURL: userInfo.avatarUrl,
            })
        }

    },
    onNavItemTap(e: any) {
        const mainId: string = e.currentTarget?.dataset?.mainId
        const navId: string = e.currentTarget?.id
        if (mainId) {
            this.setData({
                mainScroll: mainId,
                navSel: navId,
            })
        }
    },
    onMainScroll(e: any) {
        const top: number = e.currentTarget?.offsetTop + e.detail?.scrollTop
        if (top === undefined) {
            return
        }
        const selItem = this.scrollStates.mainItems.find(v => v.top >= top)
        if (!selItem) {
            return
        }
        this.setData({
            navSel: selItem.dataset.navId,
            navScroll: selItem.dataset.navScrollId,
        })
    }
})