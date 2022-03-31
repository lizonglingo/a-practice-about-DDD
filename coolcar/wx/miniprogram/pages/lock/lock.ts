import { IAppOption } from "../../appoption"
import { CarService } from "../../service/car"
import { car } from "../../service/proto_gen/car/car_pb"
import { rental } from "../../service/proto_gen/rental/rental_pb"
import { TripService } from "../../service/trip"
import { routing } from "../../utils/routing"

const shareLocationKey = "share_location"
Page({
    carID: '',
    carRefresher: 0,
    data: {
        shareLocation: false,
        avatarURL: '',
    },

    async onLoad(opt: Record<'car_id', string>) {
        const o: routing.LockOpts = opt
        // console.log('unlocking car', o.car_id)
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
        this.data.shareLocation = e.detail.value
        wx.setStorageSync(shareLocationKey, this.data.shareLocation)
    },
    onUnlockTap() {
        wx.getLocation({
            type: 'gcj02',
            success: async loc => {
                if (!this.carID) {
                    console.error('no carID specified')
                    return
                } else {
                    console.log('lock.ts 55')
                }

                let trip: rental.v1.ITripEntity
                try {   // 可能会失败 所以套在 try-catch里
                    // 异步的开锁  等待创建返回
                    trip = await TripService.createTrip({
                        start: {
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                        },
                        carId: this.carID,
                        avatarUrl: this.data.shareLocation ? this.data.avatarURL : '',
                    })
                    // return      // 暂时return避免页面跳转带来问题
                    // const tripID = 'trip123'

                    if (!trip.id) {
                        console.error('no tripID in response', trip)
                        return
                    } else {
                        console.log(trip.id)
                    }
                } catch (error) {
                    wx.showToast({
                        title: '创建行程失败',
                        icon: 'none',
                    })
                    return
                }


                wx.showLoading({
                    title: '开锁中',
                    mask: true,
                })


                // 先判断车的状态
                this.carRefresher = setInterval(async () => {
                    const c = await CarService.getCar(this.carID)
                    if(c.status===car.v1.CarStatus.UNLOCKED) {
                        this.clearCarRefresher()
                        // 轮询成功再redirect
                        wx.redirectTo({
                            // url: `/pages/driving/driving?trip_id=${tripID}`,
                            url: routing.driving({
                                trip_id: trip.id!
                            }),
                            complete: () => {
                                wx.hideLoading()
                            }
                        })
                    }
                }, 2000)

            },

            fail: () => {
                wx.showToast({
                    icon: 'none',
                    title: '请前往设置页面授权您的位置信息',
                })
            }
        })
    },

    onUnload() {
        this.clearCarRefresher()
        wx.hideLoading()
    },

    clearCarRefresher() {
        if (this.carRefresher) {
            clearInterval(this.carRefresher)
            this.carRefresher = 0
        }
    }
})