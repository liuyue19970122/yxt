// pages/stock/set-check/set.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
    index: 0,
    type: '',
    isSubmit:false
  },
  bindFixCount: function(e) {
    var goods = this.data.goods
    goods.fixCount = e.detail
    this.setData({
      goods
    })
  },
  goUpdate() {
    if(this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    if (this.data.goods.fixCount === "" || this.data.goods.fixCount ===null){
      wx.showToast({
        icon:'none',
        title: '需填写盘点数量',
      })
      this.setData({
        isSubmit: false
      })
      return false
    }
    var url = app.globalData.baseUrl + 'apiStock/stock/fix/updateFix'
    var data = {
      fixKeyId: this.data.goods.fixKeyId,
      count: this.data.goods.fixCount
    }
    util.postRequestList(url, data, false, this.updateRes)
  },
  updateRes(res) {
    var that = this
    this.setData({
      isSubmit: false
    })
    if (res.data.code == 200) {
      if (that.data.type == 'new') {
        that.goSubmit()
      } else {
        var prevPage = util.getPrevPage()
        var goodsList = prevPage.data.goodsList
        goodsList.splice(that.data.index, 1, that.data.goods)
        prevPage.setData({
          goodsList
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }else{
      wx.showToast({
        title: res.data.message,
      })/u
    }
    
  },
  goSubmit() {
    if(this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    var url = app.globalData.baseUrl + 'apiStock/stock/fix/submit'
    var list=[]
    list.push(this.data.goods.fixKeyId)
    var data = {
      fixIds: list
    }
    util.postRequestList(url, data, false, this.submitRes)
  },
  submitRes(res) {
    var that = this
    this.setData({
      isSubmit: false
    })
    if (res.data.code == 200) {
      var prevPage = util.getPrevPage()
      var goodsList = prevPage.data.goodsList
      goodsList.splice(that.data.index, 1, that.data.goods)
      prevPage.setData({
        goodsList
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
    
  },
  goCancel() {
    var url = app.globalData.baseUrl + "apiStock/stock/fix/cancel"
    var list = []
    list.push(this.data.goods.fixKeyId)
    var data = {
      fixIds: list
    }
    util.postRequestList(url, data, false, this.cancelRes)
  },
  cancelRes(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
      // wx.showModal({
      //   title: '提示',
      //   content: '取消成功',
      //   showCancel: false,
      //   success: function (res) {
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }
      // })
    } else {
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var prevPage = util.getPrevPage()
    if (options.type == 'new') {
      this.setData({
        type: 'new'
      })
    }
    this.setData({
      goods: prevPage.data.goodsList[options.index],
      index: options.index
    })
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
    this.setData({
      isSubmit: false
    })
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