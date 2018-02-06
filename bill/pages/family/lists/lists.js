//index.js
//获取应用实例
const app = getApp();
let token = wx.getStorageSync('token');

Page({
  data: {
    list: {},
    share:{}
  }, onLoad: function () {
    let _this = this;
    //定时请求直达获取信息
    if (token == '') {
      let Interval = setInterval(function () {
        wx.showLoading({ title: '加载中' })
        wx.getStorage({
          key: 'token',
          success: function (res) {
            token = res.data;
            if (token != '') {
              wx.hideLoading()
              _this.getList();
              clearInterval(Interval);
            }
          }
        });
      }, 500);
    } else {
      _this.getList();
    }
  },
  //分享
  onShareAppMessage: function (res) {
    let shareData = this.data.share;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: shareData.title,
      path: shareData.path,
      imageUrl: shareData.imageUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取列表信息
  getList: function (event) {
    let _this = this;
    wx.showLoading({ title: '加载中' })
    //获取栏目列表
    wx.request({
      url: app.baseHost + app.baseVersion + '/user/BillFamily/lists',
      data: { token: token },
      success: function (result) {
        wx.hideLoading()
        let data = result.data.data
        _this.setData({
          list: data.list,
          share:data.share
        })
      }
    });
  },
})
