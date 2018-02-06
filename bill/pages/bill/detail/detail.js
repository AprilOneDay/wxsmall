//index.js
//获取应用实例
const app = getApp();
let token = wx.getStorageSync('token');

Page({
  data: {
    data: {}
  }, onLoad: function (options) {
    let id = options.id;
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
              _this.getData(id);
              clearInterval(Interval);
            }
          }
        });
      }, 500);
    } else {
      _this.getData(id);
    }
  },
  //获取详情数据
  getData: function (id) {
    let _this = this;
    wx.showLoading({ title: '加载中' })
    wx.request({
      url: app.baseHost + app.baseVersion + '/user/Bill/detail',
      data: {token: token,id:id},
      success: function (result) {
        wx.hideLoading()
        let data = result.data.data
        _this.setData({
          data: data
        })
      }
    });
  },
  //删除
  btnDel(event){
    let _this = this;
    let id    = event.currentTarget.id;

    wx.showModal({
      title: '提示',
      content: '确定删除该信息？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: '加载中' })
          wx.request({
            url: app.baseHost + app.baseVersion + '/user/Bill/del',
            data: { token: token, id: id },
            success: function (result) {
              wx.hideLoading()
              wx.showToast({ title: result.data.msg, icon: 'none', duration: 2000 });
              if (result.data.status) {
                setTimeout(function () {
                  _this.btnBack();
                }, 1000);
              }
            }
          });
        }
      }
    })
  },
  //返回
  btnBack:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})
