import { IAppOption } from "../../appoption"
import { CarService } from "../../service/car"
import { ProfileService } from "../../service/profile"
import { rental } from "../../service/proto_gen/rental/rental_pb"
import { TripService } from "../../service/trip"
import { routing } from "../../utils/routing"

interface Marker {
    // iconPath: "/resources/car.png",
    // id: 0,
    // latitude: 23.09,
    // longitude: 113.32,
    // width: 30,
    // height: 30,
    iconPath: string,
    id: number,
    latitude: number,
    longitude: number,
    width: number,
    height: number,
}

const defaultAvatar = "/resources/car.png"
const initailLat = 30
const initialLng = 120

Page({
  isPageShowing: false,
  socket: undefined as WechatMiniprogram.SocketTask | undefined,
  data: {
    avatarURL: '',
    setting: {
      skew: 0,
      rotate: 0,
      showLocation: true,
      showScale: true,
      subKey: '',
      layerStyle: 1,
      enableZoom: true,
      enableScroll: true,
      enableRotate: false,
      showCompass: false,
      enable3D: false,
      enableOverlooking: false,
      enableSatellite: false,
      enableTraffic: false,
    },
    location: {
      latitude: initailLat,
      longitude: initialLng,
    },
    scale: 10,
    markers: [] as Marker[]
  },

  async onLoad() {
   
    const userInfo = await getApp<IAppOption>().globalData.userInfo
    this.setData({
      avatarURL: userInfo.avatarUrl,
    })
  },

  async onScanTap() {
    // 扫码之前给予保护 避免在行程中创建新的行程
    const trips = await TripService.getTrips(rental.v1.TripStatus.IN_PROGRESS)
    let doScanCode = false  // 限制在弹出Modal是弹出扫码界面
    if ((trips.trips?.length || 0) > 0) {
      wx.showModal({
        title: '有未结束的行程',
        content: '将跳转至行程页面',
        confirmText: "跳转",
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            // 如果已经有行程
            wx.navigateTo({
              url: routing.driving({
                trip_id: trips.trips![0].id!,
              })
            })
            return
          } else if (res.cancel) {
          }
        }
      })
      // // 如果已经有行程
      // wx.navigateTo({
      //   url: routing.driving({
      //     trip_id: trips.trips![0].id!,
      //   })
      // })
      // return
    } else {
      doScanCode = true
    }

    if (doScanCode) {
      wx.scanCode({
        success: async () => {
          // 首先查看是否已经通过身份认真 然后决定是否弹出模态框
          const prof = await ProfileService.getProfile()
          const carID = '60af01e5a21ead3dccbcd1d8'
          
          // const redirectURL: string = `/pages/lock/lock?car_id=${carID}`
          const lockURL: string = routing.lock({
            car_id: carID,
          })
          if (prof.identityStatus === rental.v1.IdentityStatus.VERIFIED) {
            wx.navigateTo({
              url: lockURL,
            })
          } else {
            wx.showModal({
              title: '身份认证',
              content: '认证后方可租车',
              success: (res) => {
                if (res.confirm) {
                  // TODO: get car id from scan result

                  wx.navigateTo({
                    // url: `/pages/register/register?redirect=${encodeURIComponent(redirectURL)}`,
                    url: routing.register({
                      redirectURL: lockURL,
                    })
                  })
                }
              },

            })
          }
        },
        fail: console.error,
      })
    }

  },

  onShow() {
    this.isPageShowing = true
    console.log("In onshow")
    if (!this.socket) {
      this.setData({
        markers: [],
      }, () => {
        this.setupCarPosUpdater()
      })
    }
  },
  onHide() {
    this.isPageShowing = false
    if (this.socket) {
      this.socket.close({
        success: () => {
          this.socket = undefined
        }
      })
    }
  },

  onMyTrips() {
    wx.navigateTo({
      // url: '/pages/mytrips/mytrips',
      url: routing.mytrips(),
    })
  },

  onMyLocationTap() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          location: {
            latitude: res.latitude,
            longitude: res.longitude,
          },
        })
      },
      fail: () => {
        wx.showToast({
          icon: 'none',
          title: '如有需要，请前往设置页授权允许访问您的位置',
        })
      }
    })
  },

  setupCarPosUpdater() {
    const map = wx.createMapContext("map")
    // 将Maker和CarID联系起来
    const markersByCarID = new Map<string, Marker>()
    let translationInProgress = false
    const endTranslation = () => {
      translationInProgress = false
    }
    this.socket = CarService.subscribe(car => {
      if(!car.id || translationInProgress || !this.isPageShowing) {
        console.log("Dropped!")
        return
      }
      const marker = markersByCarID.get(car.id)
      // console.log("get car id", marker)
      if (!marker) {
        // 新建一个汽车图标
        console.log("create new marker")
        const newMarker: Marker = {
          id: this.data.markers.length,
          iconPath: car.car?.driver?.avatarUrl || defaultAvatar,
          latitude: car.car?.position?.latitude || initailLat,
          longitude: car.car?.position?.longitude || initialLng,
          height: 20,
          width: 20,
        }
        markersByCarID.set(car.id, newMarker)
        this.data.markers.push(newMarker)
        translationInProgress = true 
        this.setData({
          markers: this.data.markers,
        }, endTranslation)
        return
      }
      
      const newAvatar = car.car?.driver?.avatarUrl || defaultAvatar
      const newLat = car.car?.position?.latitude || initailLat
      const newLng = car.car?.position?.longitude || initialLng

      if (marker.iconPath !== newAvatar) {
        // 如果头像换了
        console.log("change marker icon")
        marker.iconPath = newAvatar
        marker.latitude = newLat
        marker.longitude = newLng
        translationInProgress = true
        this.setData({
          markers: this.data.markers
        }, endTranslation)
        return
      }

      if (marker.latitude !== newLat || marker.longitude !== newLng) {
        // 进行移动
        // console.log("move marker")
        translationInProgress = true
        map.translateMarker({
          markerId: marker.id,
          destination: {
            latitude: newLat,
            longitude: newLng,
          },
          autoRotate: false,
          rotate: 0,
          duration: 90,
          animationEnd: endTranslation,   // 用来控制动画结束
        })
      }
    })
  },

  // moveCars() {
  //   const map = wx.createMapContext("map")
  //   const dest = {
  //     latitude: this.data.markers[0].latitude,
  //     longitude: this.data.markers[0].longitude,
  //   }

  //   const moveCar = () => {
  //     dest.latitude += 0.1
  //     dest.longitude += 0.1
  //     let nowLa = dest.latitude
  //     let nowLo = dest.longitude

  //     map.translateMarker({
  //       destination: {
  //         latitude: nowLa,
  //         longitude: nowLo,
  //       },
  //       markerId: 0,
  //       autoRotate: false,
  //       rotate: 0,
  //       duration: 5000,
  //       animationEnd: () => {
  //         if (this.isPageShowing) {
  //           moveCar()
  //         } else {
  //           this.setData({
  //             'markers[0].latitude': nowLa,
  //             'markers[0].longitude': nowLo,
  //           })
  //         }
  //       },
  //     })
  //   }

  //   moveCar()
  // }
})
