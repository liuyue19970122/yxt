// pages/receipt/pay-order/pay.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalMoney:0,
    totalCount:0,
    realMoney:0,
    orderId:0,
    showType:false
  },
  goPay(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var prevPage=util.getPrevPage()
     this.setData({
       totalMoney: prevPage.data.totalMoney,
       totalCount: prevPage.data.totalCount,
       orderId:prevPage.data.orderId
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