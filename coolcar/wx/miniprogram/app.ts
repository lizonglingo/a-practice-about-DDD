import camelcaseKeys = require("camelcase-keys")
import { IAppOption } from "./appoption"
import { auth } from "./service/proto_gen/auth/auth_pb"
import { rental } from "./service/proto_gen/rental/rental_pb"
import { getSetting, getUserInfo } from "./utils/wxapi"

let resolveUserInfo: (value: WechatMiniprogram.UserInfo | PromiseLike<WechatMiniprogram.UserInfo>) => void
let rejectUserInfo: (reason?: any) => void

// app.ts
App<IAppOption>({
  globalData: {
    userInfo: new Promise((resolve, reject) => {
      resolveUserInfo = resolve
      rejectUserInfo = reject
    })
  },
  async onLaunch() {
    // wx.request({
    //   url: 'http://localhost:8123/trip/trip112233',
    //   method: 'GET',
    //   success: res => {
    //     const getTripRes = coolcar.GetTripResponse.fromObject(
    //       camelcaseKeys(res.data as object, {
    //         deep: true,
    //       })
    //     )
    //     console.log(getTripRes)
    //     console.log(coolcar.TripStatus[getTripRes.trip?.status!])
    //   },
    //   fail: console.error,
    // })
    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'http://localhost:8123/v1/auth/login',
          method: 'POST',
          data: {
            code: res.code
          } as auth.v1.ILoginRequest,
          success: res => {
            const loginResp: auth.v1.ILoginResponse = 
            auth.v1.LoginResponse.fromObject(
              camelcaseKeys(res.data as object),
            )
            console.log(loginResp)
            wx.request({
              url: 'http://localhost:8123/v1/trip',
              method: 'POST',
              data: {
                start: 'new trip',
              } as rental.v1.ICreateTripRequest,
              header :{
                authorization: 'Bearer ' + loginResp.accessToken,
              }
            })
          },
          fail: console.error,
        })
      },
    })

    // 获取用户信息 版本3
    // 使用 async await 语法糖获取用户信息
    try {
      const setting = await getSetting()
      if (setting.authSetting['scope.userInfo']) {
        const userInfoRes = await getUserInfo()
        resolveUserInfo(userInfoRes.userInfo)
      }
    } catch (error) {
      rejectUserInfo(error)
    }


    // 获取用户信息 版本2
    // 使用Promise改写用户信息
    // getSetting().then(res => {
    //   if (res.authSetting['scope.userInfo']) {
    //     return getUserInfo()
    //   }
    //   // 如果没有权限
    //   return Promise.resolve(undefined)
    // }).then(res => {
    //   // 如果没有权限自然拿不到用户信息，直接返回
    //   if (!res) {
    //     return
    //   }
    //   // 如果拿到信息就给出通知 已经拿到信息
    //   resolveUserInfo(res.userInfo)
    // }).catch(err => rejectUserInfo(err))


    // 获取用户信息 原版 版本1
    // 使用 callback 嵌套 callback 的方式获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         },
    //       })
    //     }
    //   },
    // })
  },

  resolveUserInfo(userInfo: WechatMiniprogram.UserInfo) {
    resolveUserInfo(userInfo)
  }
})