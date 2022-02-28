import { routing } from "../../utils/routing"

interface Trip {
    id: string
    start: string
    end: string
    duration: string
    fee: string
    distance: string
}

Page({
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
        trips: [] as Trip [],
    },
    async onLoad() {
        this.populateTrips()
        const userInfo = await getApp<IAppOption>().globalData.userInfo
        this.setData({
            avatarURL: userInfo.avatarUrl,
        })
    },

    populateTrips(){
        const trips: Trip[] = []
        for (let i=0; i<100; i++) {
            trips.push({
                id: (10001+i).toString(),
                start: '长桥',
                end: '宿舍',
                distance: '2.4公里',
                duration: '0时12分钟',
                fee: '5.2元'
            })
        }
        this.setData({
            trips: trips,
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
})