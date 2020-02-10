// pages/receipt/pay-result/result.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney:'',
    orderId:'',
    isTable:''
  },
  bindGoMeal(){
    // wx.redirectTo({
    //   url: '../order-food/cart',
    // })
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  bindRelease() {
    var url = app.globalData.baseUrl + 'apiMall/food/desktop/release'
    var data = {
      orderId: this.data.orderId
    }
    util.postRequestList(url, data, false, this.releaseRes)
  },
  releaseRes(res) {
    if (res.data.code == 200) {
      // wx.redirectTo({
      //   url: '../table-list/list?type=choose',
      // })  
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      totalMoney:options.realMoney,
      isTable:JSON.parse(options.tableId).length>0?true:false
    })
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
    this.setData({
      isSubmit: false
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