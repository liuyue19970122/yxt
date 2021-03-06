// pages/oa/person-list/list.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personList:[]
  },
  getPersonList(){
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl + 'apiUser/user/list'
    var data = {}
    util.getRequestListData(url, data, false, this.listRes)
  },
  listRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    if (res.data.code == 200) {
      this.setData({
        personList: res.data.content
      })
    }
  },
  selectThis(e){
    var pages = getCurrentPages(); // 获取页面栈
    var currPage = pages[pages.length - 1]; // 当前页面
    var prevPage = pages[pages.length - 2]; // 上一个页面
    var item={
      id: e.detail.id,
      name: e.currentTarget.dataset.name
    }
    var name=prevPage.data.name
    name.push(item)
    // var ids = prevPage.data.ids.push(e.detail.id)
    prevPage.setData({
      name: name,
    })
    wx.navigateBack({
      delta:1
    })
    // wx.redirectTo({
    //   url: '../add-leave/add?id='+,
    // })
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
    this.getPersonList()
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