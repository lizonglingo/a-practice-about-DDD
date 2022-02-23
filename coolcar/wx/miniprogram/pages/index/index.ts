// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    motto: 'testing',
    userInfo: {},
    hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  async onLoad() {

    // 通知版本 3
    // 使用 async await重写通知
    // 这里的 userInfo 就是一个 promise 对象
    const userInfo = await app.globalData.userInfo
    this.setData({
      userInfo,
      hasUserInfo: true
    })

    // 通知版本 2
    // 使用Promise重写通知
    // app.globalData.userInfo.then(userInfo => {
    //   this.setData({
    //     userInfo: userInfo,
    //     hasUserInfo: true,
    //   })
    // })

    // 通知版本 1
    // 原方法分别判断在页面load之前是否完成用户信息读取并进行判断
    // 1. 完成读取的情况下直接赋值
    // 2. 在没有完成读取的情况下使用回调函数再异步完成时进行通知
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true,
    //   })
    // } else {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true,
    //     })
    //   }
    // }

  },
  getUserInfo(e: any) {
    console.log(e)
    const userInfo: WechatMiniprogram.UserInfo = e.detail.userInfo
    app.resolveUserInfo(userInfo)
  },
})
