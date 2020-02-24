// pages/oa/performance/detail-list-man/list.js
var util = require('../../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pages: 0,
    detailList: [],
    month: '',
    total:0,
  },
  goNext() {
    util.getNextPage(this, this.data.pages, this.getDetailList)
  },
  bindChange(e) {
    console.log(e)
    this.setData({
      month: e.detail.value
    })
    console.log(this.data.month)
    this.getDetailList()
  },
  getDetailList() {
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl + 'apiUser/achieve/detail?t=' + times
    console.log(this.data.month)
    var month = this.data.month.split('-').join("")
    var data = {
      month: month,
      pageNum: this.data.pageNum,
      pageSize: 20
    }
    util.getRequestListData(url, data, false, this.detailRes)
  },
  detailRes(res) {
    wx.hideLoading()
    if (res.data.code == 200) {
      var list = res.data.content.list
      var detailList = this.data.pageNum > 1 ? this.data.detailList.concat(list) : list
      var total=0
      detailList.map((item)=>{
        // if(item.opType=='+'){
          total += item.score
        // }else{
        //   total -= item.score
        // }
      })
      this.setData({
        detailList: detailList,
        pages: res.data.content.pages,
        total:total
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    var year = date.getFullYear()
    var month = (date.getMonth() + 1) > 9 ? "" + (date.getMonth() + 1) : "0" + (date.getMonth() + 1)
    console.log(year)
    console.log(month)
    this.setData({
      month: year + "-" + month
    })
    
    this.getDetailList()
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