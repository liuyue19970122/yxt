// pages/mall/mall-my-custom/custom.js
let util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customList:[]
  },
  //获取我的客户///org/myCust
  getMyCust(){
    let url = app.globalData.baseUrl + 'apiUser/org/myCust'
    util.getRequestList(url, false, this.getMyCustRes)
  },
  getMyCustRes(res,type){
    if(res.data.code==='200'){
      let list=res.data.content
      list.forEach(item=>{
        item.cusBuyTime=util.formatDate(item.lastBuyTime)
      })
      this.setData({
        customList:list
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyCust()
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