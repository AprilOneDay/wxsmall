//index.js
//获取应用实例
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    autoplay: true,
    interval: 5000,
    duration: 1000,
  }, onLoad: function () {
   
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
      url: app.baseHost + app.baseVersion + '/index/Service/menus',
      data: {},
      header: {},
      success: function (result) {
        let data = result.data.data
        _this.setData({
          menus: data.list
        })
      }
    });
    //获取栏目信息
    wx.request({
      url: app.baseHost + app.baseVersion + '/index/service/detail?id=103',
      data: {},
      header: {},
      success: function (result) {
        let data = result.data.data
        WxParse.wxParse('article', 'html', data.finally_content, _this, 0);
      }
    });

  }
})
