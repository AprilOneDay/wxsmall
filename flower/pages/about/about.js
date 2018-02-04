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
    console.log(options.cid);
    let cid = options.cid ? options.cid : 90;
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
      url: app.baseHost + app.baseVersion + '/index/service/detail?cid='+cid,
      data: {},
      header: {},
      success: function (result) {
        let data = result.data.data
        _this.setData({
          data: data
        })
        WxParse.wxParse('article', 'html', data.finally_content, _this, 0);
      }
    });
  }, callTel:function(event){
    let tel = event.currentTarget.dataset.number;
    console.log(event);
    console.log(tel);
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})
