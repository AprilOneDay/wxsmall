//index.js
//获取应用实例
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
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
    //获取栏目列表
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
      url: app.baseHost + app.baseVersion + '/index/service/lists?cid='+options.cid,
      data: {},
      header: {},
      success: function (result) {
        let data = result.data.data;
        _this.setData({
          list: data.list
        })
      }
    });
  }
})
