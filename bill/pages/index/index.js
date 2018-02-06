//index.js
//获取应用实例
const app   = getApp();
const rpn   = require('../../utils/rpn.js');
let   token = wx.getStorageSync('token');

Page({
  data: {
    accountText: '0', //最终金额
    type: 1055, //1055开支 or 1056收入
    signList:{}, //图标列表
    onSign:0,
    date:'2018-10-1', 
  }, onLoad: function (option) {
    let _this = this;
    let inviteSn = option.inviteSn;
    let toToken  = option.toToken;
    //定时请求直达获取信息
    if(token == ''){
      let Interval = setInterval(function(){
        wx.showLoading({ title: '加载中' })
        wx.getStorage({
          key: 'token',
          success: function (res) {
            token = res.data;
            if(token != ''){
              //加入家庭
              if (inviteSn && toToken){
                _this.addFaimly(inviteSn, toToken);
              }
              wx.hideLoading()
              clearInterval(Interval);
            }
          }
        });
      }, 500);
    }
    //加入家庭
    if (inviteSn && toToken) {
      _this.addFaimly(inviteSn, toToken);
    }
    _this.getBtnTypeCopy();
  },
  //切换类型
  btnType:function(event){
    let _this = this;
    let type = event.currentTarget.id;
    _this.setData({
      type: type
    })
    _this.getBtnTypeCopy();
  },
  //选择收支分类
  btnIcon:function(event){
    let _this = this;
    let id = event.currentTarget.id;
    _this.setData({
      onSign: id
    })
  },
  //获取分类详情
  getBtnTypeCopy:function(){
    let _this = this;
    let id = _this.data.type;
    wx.showLoading({ title: '加载中'})
    //获取栏目列表
    wx.request({
      url: app.baseHost + app.baseVersion + '/common/Category/getAllList',
      data: {id:id},
      success: function (result) {
        wx.hideLoading()
        let data = result.data.data
        _this.setData({
          signList: data.list,
          onSign:0
        })
      }
    });
  },
  //提交保存
  btnComply:function(){
    let _this = this;
    let data = _this.data;
    
    wx.showLoading({ title: '加载中' })
    wx.request({
      url: app.baseHost + app.baseVersion + '/user/Bill/add',
      data: {token:token,type:data.type,sign:data.onSign,money:data.accountText},
      success: function (result) {
        wx.hideLoading();
        wx.showToast({title: result.data.msg,icon: 'none',duration: 2000})
      }
    });

    if (isNaN(data.accountText)){
      return wx.showToast({ title: '金额有误', icon: 'none',duration: 1000})
    }
  }, 
  //加入家庭
  addFaimly: function (inviteSn, toToken){
    wx.showModal({
      title: '提示',
      content: '确定加入'+toToken+'的小家庭？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.baseHost + app.baseVersion + '/user/BillFamily/add',
            data: { token: token, invite_sn: inviteSn},
            success: function (result) {
              wx.hideLoading();
              wx.showToast({ title: result.data.msg, icon: 'none', duration: 2000 })
              if (result.data.status) {
                wx.navigateTo({
                  url: '/pages/family/lists/lists'
                })
              }
            }
          });
        }
      }
    })
  }
  ,
  //扫码
  btnScanCode: function (event) {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //加入家庭
        let url  = res.result;
        if (url.indexOf('/user/BillFamily/add') !== '-1'){
          wx.request({
            url: url,
            data: { token: token},
            success: function (result) {
              wx.hideLoading();
              wx.showToast({ title: result.data.msg, icon: 'none', duration: 2000 })
              if(result.data.status){
                wx.navigateTo({
                  url: '/pages/family/lists/lists'
                })
              }
            }
          });
        }
      }
    })
  },
  //时间选择器
  bindDateChange:function(e){
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //计算器
  clickButton:function(event){
    let _this = this;
    let btnValue = event.currentTarget.id;
    let accountText = String(_this.data.accountText);
    let lastValue = accountText.substr(accountText.length - 1, 1);
    let account;

    console.log(btnValue);

    if (accountText == '0'){
      accountText = '';
    }

    //防止重复点击多次运算符
    if (isNaN(btnValue) && btnValue != 'back' && btnValue != 'c' && isNaN(lastValue)){
      return false;
    }

    //计算结果
    if(btnValue == '='){
        if(isNaN(lastValue)){
          return false;
        }
        accountText = accountText.replace('x','*');
        accountText = accountText.replace('÷','/');
        accountText = rpn.calCommonExp(accountText).toFixed(2);
    }
    //退格
    else if(btnValue == 'back'){
      accountText = accountText.substr(0, accountText.length - 1);
    }
    //清空
    else if(btnValue == 'c'){
      accountText = 0;
    }
    //显示屏
    else{
      accountText += btnValue;
    }

    //最少显示0
    if(accountText == ''){
      accountText = 0;
    }

    _this.setData({
      accountText: accountText
    })
  },
})
