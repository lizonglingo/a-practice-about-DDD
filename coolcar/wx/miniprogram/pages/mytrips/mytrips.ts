import { IAppOption } from "../../appoption"
import { routing } from "../../utils/routing"

interface Trip {
    id: string
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

Page({
    scrollStates: {
        mainItems: [] as MainItemQueryRequest[],
    },
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
    async onLoad() {
        this.populateTrips()
        const userInfo = await getApp<IAppOption>().globalData.userInfo
        this.setData({
            avatarURL: userInfo.avatarUrl,
        })
    },
    onReady() {
        wx.createSelectorQuery().select('#heading')
        .boundingClientRect(rect => {
            const height = wx.getSystemInfoSync().windowHeight - rect.height
            this.setData({
                tripsHeight: height,
                navCount: Math.round(height/50),
            })
        }).exec()
    },
    populateTrips(){
        const mainItems: MainItem[] = []
        const navItems: NavItem[] = []
        let navSel = ''
        let prevNav = ''
        for (let i=0; i<100; i++) {
            if(!prevNav) {
                prevNav = 'nav-' + i
            }
            mainItems.push({
                id: 'main-' + i,
                navId: 'nav-' + i,
                navScrollId: prevNav,
                data: {
                id: (10001+i).toString(),
                start: '长桥',
                end: '宿舍',
                distance: '2.4公里',
                duration: '0时12分钟',
                fee: '5.2元',
                status: '已完成',
                }
            })
            navItems.push({
                id: 'nav-' + i,
                mainId: 'main-' + i,
                label: (10001+i).toString(),
            })
            if (i===0) {
                navSel = 'nav-' + i
            }
            prevNav = 'nav-' + i
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
        }).exec( res => {
            this.scrollStates.mainItems = res[0]
        })
    },

    onSwiperChange(e: any) {
        console.log(e)
    },

    onPromotionItemTap(e: any) {
        console.log(e)
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
        const selItem =  this.scrollStates.mainItems.find( v => v.top >= top)
        if (!selItem) {
            return
        }
        this.setData({
            navSel: selItem.dataset.navId,
            navScroll: selItem.dataset.navScrollId,
        })
    }
})