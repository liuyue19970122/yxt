// pages/receipt/vege/vege-detail/detail.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    foodId: '',
    indicatorDots: true,
    vertical: false,
    type: 0
  },
  getDetail() {
    if (this.data.type == 0) {
      var url = app.globalData.baseUrl + 'apiMall/food/default/detail'
    } else {
      var url = app.globalData.baseUrl + 'apiMall/food/inst/detail'
    }
    var data = {
      foodId: this.data.foodId
    }
    util.getRequestListData(url, data, false, this.getRes)
  },
  getRes(res) {
    res.data.content.attrList.map((item)=>{
      item.sellPrice=util.getMoney(item.sellPrice)
    })
    this.setData({
      detail: res.data.content
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        foodId: options.id,
        type: options.type
      })
    } else {
      this.setData({
        foodId: 5,
        type: 0
      })
    }
    this.getDetail()
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
    this.getDetail()
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