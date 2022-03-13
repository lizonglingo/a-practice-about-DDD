import { IAppOption } from "../../appoption"
import { TripService } from "../../service/trip"
import { routing } from "../../utils/routing"

const shareLocationKey = "share_location"
Page({
    carID: '',
    data: {
        shareLocation: false,
        avatarURL: '',
    },

    async onLoad(opt: Record<'car_id', string>) {
        const o: routing.LockOpts = opt
        console.log('unlocking car', o.car_id)
        this.carID = o.car_id
        const userInfo = await getApp<IAppOption>().globalData.userInfo
        this.setData({
            avatarURL: userInfo.avatarUrl,
            shareLocation: wx.getStorageSync(shareLocationKey) || false
        })
    },
    onGetUserInfo(e: any) {
        const userInfo: WechatMiniprogram.UserInfo = e.detail.userInfo
        if (userInfo) {
            getApp<IAppOption>().resolveUserInfo(userInfo)
            this.setData({
                shareLocation: true,
            })
            wx.setStorageSync(shareLocationKey, this.data.shareLocation)
        }

    },
    onShareLocation(e: any) {
        const shareLocation: boolean = e.detail.value
        wx.setStorageSync(shareLocationKey, shareLocation)
    },
    onUnlockTap() {
        wx.getLocation({
            type: 'gcj02',
            success: async loc => {
                console.log('starting a trip', {
                    location: {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    },
                    // TODO: 需要双向绑定
                    avatarURL: this.data.shareLocation ? this.data.avatarURL : '',
                })

                if (!this.carID) {
                    console.error('no carID specified')
                    return
                } else {
                    console.log('lock.ts 55')
                }

                // 异步的开锁  等待创建返回
                const trip = await TripService.CreateTrip({
                    start: {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    },
                    carId: this.carID,
                })
                // return      // 暂时return避免页面跳转带来问题
                // const tripID = 'trip123'

                if (!trip.id) {
                    console.error('no tripID in response', trip)
                    return
                } else {
                    console.log(trip.id)
                }
                wx.showLoading({
                    title: '开锁中',
                    mask: true,
                })

                setTimeout(() => {
                    wx.redirectTo({
                        // url: `/pages/driving/driving?trip_id=${tripID}`,
                        url: routing.driving({
                            trip_id: trip.id!
                        }),
                        complete: () => {
                            wx.hideLoading()
                        }
                    })
                }, 3000)

            },

            fail: () => {
                wx.showToast({
                    icon: 'none',
                    title: '请前往设置页面授权您的位置信息',
                })
            }
        })


    }
})