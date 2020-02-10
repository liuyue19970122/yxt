// pages/common/login/login.js
var app = getApp();
var util = require('../../../../utils/util.js');
import Dialog from '../../../../miniprogram_npm/vant-weapp/dialog/dialog';
import Toast from '../../../../miniprogram_npm/vant-weapp/toast/toast';
var timestamp = Date.parse(new Date())
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: '',
    password: ''
  },
  inputUser: function (e) {
    this.setData({
      user: e.detail.value
    })
  },
  inputPass: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  search: function () {
    wx.request({
      url: app.globalData.baseUrl + 'apiUser/org/supply/querySupply?t=' + timestamp,
      method: 'get',
      header: {
        "content-type": 'application/x-www-form-urlencoded'
      },
      data: {
        mobile: this.data.user,
        password: this.data.password
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../first-step/first?supplyObj='+JSON.stringify(res.data.content),
          })
        } else {
          Toast.fail(res.data.message);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({
      success: function (res) {

      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})