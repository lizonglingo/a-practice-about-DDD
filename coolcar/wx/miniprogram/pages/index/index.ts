import { routing } from "../../utils/routing"

Page({
  isPageShowing: false,
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
      latitude: 23.09,
      longitude: 113.32,
    },
    scale: 10,
    markers: [
      {
        iconPath: "/resources/car.png",
        id: 0,
        latitude: 23.09,
        longitude: 113.32,
        width: 30,
        height: 30,
      },
      {
        iconPath: "/resources/car.png",
        id: 1,
        latitude: 23.09,
        longitude: 114.32,
        width: 30,
        height: 30,
      }
    ]
  },

  async onLoad(){
    const userInfo = await getApp<IAppOption>().globalData.userInfo
    this.setData({
      avatarURL: userInfo.avatarUrl,
    })
  },

  onScanTap() {
    wx.scanCode({
      success: () =>{
        // TODO: get car id from scan result
        const carID = 'car123'
        // const redirectURL: string = `/pages/lock/lock?car_id=${carID}`
        const redirectURL: string = routing.lock({
          car_id: carID,
        })
        wx.navigateTo({
          // url: `/pages/register/register?redirect=${encodeURIComponent(redirectURL)}`,
          url: routing.register({
            redirectURL: redirectURL,
          })
        })
      },
      fail: console.error,
    })

  },

  onShow() {
    this.isPageShowing = true
  },
  onHide() {
    this.isPageShowing = false
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
  moveCars() {
    const map = wx.createMapContext("map")
    const dest = {
      latitude: this.data.markers[0].latitude,
      longitude: this.data.markers[0].longitude,
    }

    const moveCar = () => {
      dest.latitude += 0.1
      dest.longitude += 0.1
      let nowLa = dest.latitude
      let nowLo = dest.longitude
      
      map.translateMarker({
        destination: {
          latitude: nowLa,
          longitude: nowLo,
        },
        markerId: 0,
        autoRotate: false,
        rotate: 0,
        duration: 5000,
        animationEnd: () => {
          if (this.isPageShowing) {
            moveCar()
          } else { 
            this.setData({
              'markers[0].latitude': nowLa,
              'markers[0].longitude': nowLo,
            })
          }
        },
      })
    }

    moveCar()
  }
})
