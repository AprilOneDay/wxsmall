var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
  },
  onLoad: function () {
    var that = this;
    /**
     * html解析示例
     */
    var article = `	`;


    WxParse.wxParse('article', 'html', article, that, 5);

    wx.request({
      url: 'https://api.rengxian.cn/v1/index/service/detail?id=103',
      success: function (result) {
        let data = result.data.data
        WxParse.wxParse('article', 'html', data.finally_content, that, 5);
      }
    });
    
    

  }


})
