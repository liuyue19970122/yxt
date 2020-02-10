// pages/stock/stock-out/stock-out.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    goodsCount: '',
    perMoney: '',
    totalMoney: '',
    goodsId: 0
  },
  getGoodsInfo() {
    var url = app.globalData.baseUrl + 'apiStock/stock/inst/info'
    var data = {
      keyId: this.data.goodsId
    }
    util.getRequestListData(url, data, false, this.infoRes)
  },
  infoRes(res) {
    if (res.data.code == 200) {
      var goods = res.data.content
      this.setData({
        goods: goods
      })
    }
  },
  getTotalMoney: function(e) {
    let value = util.clearNoNum(e.detail)
    this.setData({
      totalMoney: value
    })
  },
  getPerMoney: function(e) {
    console.log(e)
    let value = util.clearNoNum(e.detail)
    this.setData({
      perMoney: value
    })
  },
  getGoodsCount: function(e) {
    let value = util.clearNoNum(e.detail)
    this.setData({
      goodsCount: value
    })
  },
  getDes(e) {
    console.log(e)
    this.setData({
      description: e.detail.value
    })
  },
  outStock() {
    var url = app.globalData.baseUrl + 'apiStock/stock/inst/outCome'
    var that=this
    if (this.data.goodsCount > this.data.goods.goodsCount) {
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '最大出库量：' + that.data.goods.goodsCount,
      })
      return false
    }
    var data = {
      stockId: this.data.goods.keyId,
      outCount: this.data.goodsCount,
      perMoney: this.data.perMoney,
      totalMoney: this.data.totalMoney
    }
    util.postRequestList(url, data, false, this.outRes)
  },
  outRes(res) {
    if (res.data.code == 200) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '出库成功',
        success: function() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'warning',
        title: res.data.message,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        goodsId: options.id
      })
    }
    this.getGoodsInfo()
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