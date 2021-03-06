//index.js
//获取应用实例
const app = getApp();
let token = wx.getStorageSync('token');

Page({
  data: {
    data:{},
  }, onShow: function () {
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
  //获取列表信息
  getList: function (event) {
    let _this = this;
    wx.showLoading({ title: '加载中' })
    //获取栏目列表
    wx.request({
      url: app.baseHost + app.baseVersion + '/user/Bill/lists',
      data: { token: token },
      success: function (result) {
        wx.hideLoading();
        let data = result.data.data;
        _this.setData({
          data:data
        })
      }
    });
  },
})
