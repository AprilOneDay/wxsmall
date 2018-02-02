const app = getApp()
Page({
  data: {
    imgUrls:'',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  }, onLoad: function () {
    let _this = this
    wx.request({
      url: app.baseHost +'/index/banner/lists', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (result) {
        let data = result.data.data
        let ulrs = new Array
        for(let key in data.list){
          ulrs[key] = data.list[key].path
        }
        _this.setData({
          imgUrls: ulrs
        })
      }
    })
    
  },
})
