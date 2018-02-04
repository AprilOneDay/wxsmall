//app.js
App({
  baseHost: "https://api.rengxian.cn/",
  baseVersion: 'v1',
  onLaunch: function () {
    let _this = this;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.checkSession({
      success: function (e) {
        //如果不存在uid则重新登陆
        if (wx.getStorageSync('token')) {
          let token = _this.onLogin();
        };
      },
      //登陆过期
      fail: function () {
        _this.onLogin();
      }
    });
  },
  // 登录
  onLogin: function () {
    let _this = this;
    wx.login({
      success: res => {
        wx.request({
          url: 'https://api.rengxian.cn/v1/common/user/userInfo',
          data: { code: res.code },
          success: function (result) {
            let data = result.data.data;
            wx.setStorage({ key: "token", data: data.token });
            if (data.is_update == 0) {
              _this.updateUserInfo();
            }
          }
        })
      }
    });
  }, updateUserInfo: function () {
    let _this = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        wx.getUserInfo({
          success: res => {
            wx.request({
              url: 'https://api.rengxian.cn/v1/common/user/update',
              data: { token: _this.token, nickname: res.userInfo.nickName, avatar: res.userInfo.avatarUrl },
              success: function (result) {
                let data = result.data.data;

                console.log(data)
              }
            })
          }
        })
      }
    })
  }
})