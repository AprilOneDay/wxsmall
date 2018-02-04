//index.js
//获取应用实例
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  }, onLoad: function (options) {
    let _this = this;
    let article = '';
    //获取banner图信息
    wx.request({
      url: app.baseHost + app.baseVersion + '/index/banner/lists',
      data: {},
      header: {},
      success: function (result) {
        let data = result.data.data
        let ulrs = new Array
        for (let key in data.list) {
          ulrs[key] = data.list[key].path
        }
        _this.setData({
          imgUrls: ulrs
        })
      }
    });
    //获取栏目信息
    wx.request({
      url: app.baseHost + app.baseVersion + '/index/service/lists_5?cid=89',
      data: {},
      header: {},
      success: function (result) {
        let data = result.data.data;
        _this.setData({
          list: data.list
        })
      }
    });
  }, address:function(event){
      let _this = this;
      let id = event.currentTarget.id;
      let data = _this.data.list[id];
      wx.openLocation({
        latitude: data.lat,
        longitude: data.lng,
        scale: 18,
        name: data.finally_title,
        address: data.finally_address,
      })  
  }
})
