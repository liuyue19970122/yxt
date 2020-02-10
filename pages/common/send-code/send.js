// pages/common/reset-pwd/reset-pwd.js
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../../miniprogram_npm/vant-weapp/toast/toast';
var util = require('../../../utils/util.js');
const app = getApp()
var timestamp = Date.parse(new Date())
var MCAP = require('../../../utils/code.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    seconds: 0,
    code: '',
    smsCode: '',
    codeStr: '',
    timer: null
  },
  sendSmsCode() {
    if (!(/^1[3456789]\d{9}$/.test(this.data.mobile))) {
      Notify({
        type: 'warning',
        message: '手机号格式不正确'
      });
      return false
    }
    if (this.data.codeStr.toUpperCase() != this.data.code.toUpperCase()) {
      Notify({
        type: 'warning',
        message: '图形验证码不正确'
      });
      return false
    }
    var url = app.globalData.baseUrl + 'apiUser/user/smscode'
    var data = {
      mobile: this.data.mobile
    }
    this.postRequest(url, data, this.sendSmsRes)
  },
  sendSmsRes(res) {
    if (res.data.code == 200) {
      Toast('验证码已发送')
      this.setData({
        isSendSms: true,
        seconds: 300
      })
      this.timeCountDown()
    } else {
      Toast(res.data.message)
      this.setData({
        isSendSms: false
      })
    }
  },
  timeCountDown() {
    var that = this
    this.data.timer = setInterval(() => {
      if (that.data.seconds == 0) {
        clearInterval(this.data.timer)
        that.setData({
          timer: null
        })
      } else {
        that.setData({
          seconds: --that.data.seconds
        })
      }
    }, 1000)
  },
  bindData(e) {
    var type = e.currentTarget.dataset.type
    var that = this
    switch (type) {
      case 'mobile':
        that.setData({
          mobile: e.detail
        })
        break;
      case 'code':
        that.setData({
          smsCode: e.detail.value
        })
        break;
    }
  },
  goSubmit() {
    if (this.data.smsCode.length != 6) {
      Notify({
        type: 'warning',
        message: '验证码为六位数'
      });
      return false
    }
    var url = app.globalData.baseUrl + 'apiUser/org/supply/checkSmsCode'
    var data = {
      mobile: this.data.mobile,
      code: this.data.smsCode
    }
    this.postRequest(url, data, this.submitRes)
  },
  submitRes(res) {
    if (res.data.code == 200) {
      wx.navigateTo({
        url: '../reset-pwd/reset-pwd?mobile=' + this.data.mobile,
      })
    }else{
      Toast(res.data.message)
    }
  },
  postRequest(url, data, callback) {
    wx.request({
      url: url,
      data: data,
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function(res) {
        if (res.statusCode == 200) {
          callback(res)
        }
      }
    })
  },
  /**
   * 制作验证码
   */
  initDraw() {
    var that = this;
    var codes = that.getRanNum();
    that.setData({
      codeStr: codes //生成的验证码
    })
    new MCAP({
      el: 'canvas',
      width: 120,
      height: 40,
      code: codes
    });
  },
  /**
   * 更换验证码
   */
  changeImg: function() {
    this.initDraw();
  },
  /**
   * 图片验证码绑定变量 
   */
  bindCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 获取随机数
   */
  getRanNum: function() {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var pwd = '';
    for (var i = 0; i < 4; i++) {
      if (Math.random() < 48) {
        pwd += chars.charAt(Math.random() * 48 - 1);
      }
    }
    return pwd;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.initDraw(); //生成验证码
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timer)
    this.setData({
      timer: null
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})