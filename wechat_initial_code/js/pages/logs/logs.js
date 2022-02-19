//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function (opts) {
    console.log("lifecycle: logs on Load")
    console.log(opts);
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      }),
      logColor: opts.color
    })
  },
  onShow: function() {
    console.log("lifecycle: logs onShow")
  },
  onHide: function() {
    console.log("lifecycle: logs onHide")
  },
  onReady: function() {
    console.log("lifecycle: logs onReady")
  },
  onUnload: function() {
    console.log("lifecycle: logs onUnload")
  },
  onLogTap: function() {
    wx.navigateTo({
      url: '/pages/test2/test2',
    })
  }
})
