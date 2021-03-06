// pages/receipt/vege/default-list/list.js
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
    pageSize: 10,
    goodsList: [],
    selectList: [],
    goodsName: '',
    stockId: '',
    isAllCheck: false,
    isSubmit:false,
  },
  bindGoodsName: function(e) {
    this.setData({
      goodsName: e.detail.value
    })
  },
  getGoodsList() {
    wx.showLoading({
      title: '获取中',
    })
    var url = app.globalData.baseUrl + 'apiStock/stock/inst/list?t=' + times
    var data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      goodsName: this.data.goodsName,
      locationId: this.data.stockId
    }
    util.getRequestListData(url, data, false, this.goodsListRes)
  },
  goodsListRes(res) {
    setTimeout(()=>{
      wx.hideLoading()
    },100)
    var list = res.data.content.list
    var prevPage = util.getPrevPage()
    var goodsList = prevPage.data.goodsList
    list.map((item)=>{
      item.status = false
      item.fixCount = null
      item.isAdd = false
    })
    for (var jtem of goodsList) {
      for (var item of list) {
        if (jtem.stockKeyId == item.keyId) {
          item.status = true
          item.fixCount = jtem.fixCount
          item.isAdd = true
          break
        }
      }
    }
    var list2 = this.data.pageNum>1?this.data.goodsList.concat(list):list
    this.setData({
      goodsList: list2,
      pages: res.data.content.pages
    })
  },
  getNextPage() {
    var that = this
    if (that.data.pages > that.data.pageNum) {
      this.setData({
        pageNum: ++that.data.pageNum
      })
      that.getFoodList()
    } else {
      wx.showToast({
        title: '已经是最后一页',
        duration: 2,
      })
    }
  },
  changeStatus(e) {
    if (e.currentTarget.dataset.isadd) {
      return false
    }
    var list = this.data.goodsList
    list.map((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        item.status = !item.status
      }
    })
    this.setData({
      goodsList: list
    })
  },
  selectDefault(e) {
    this.setData({
      selectList: e.detail
    })
    if (this.data.goodsList.length == e.detail.length) {
      this.setData({
        isAllCheck: true
      })
    } else {
      this.setData({
        isAllCheck: false
      })
    }
  },
  bindAllChoose() {
    var flag = this.data.isAllCheck
    var list = this.data.goodsList
    list.map((item, index) => {
      if(!item.isAdd){
        item.status = !flag
      }
    })
    this.setData({
      goodsList: list,
      isAllCheck: !flag
    })
  },
  onSubmit() {
    if (this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    var url = app.globalData.baseUrl + 'apiStock/stock/fix/add?t=' + times
    var list = []
    this.data.goodsList.map((item) => {
      if (item.status) {
        list.push(item.keyId)
      }
    })
    var data = {
      stockId: this.data.stockId,
      stockIds: list
    }
    util.postRequestList(url, data, false, this.submitRes)
  },
  submitRes(res) {
    if (res.data.code == 200) {
      var list = res.data.content
      var prevPage = util.getPrevPage()
      var goodsList = prevPage.data.goodsList
      goodsList = goodsList.concat(list)
      prevPage.setData({
        goodsList: goodsList
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        icon:'none',
        title: res.data.message,
        duration: 2000
      })
    }
    this.setData({
      isSubmit:false
    })
  },
  goNext() {
    util.getNextPage(this, this.data.pages, this.getGoodsList)
  },
  goDetail(e) {
    wx.navigateTo({
      url: '../vege-detail/detail?id=' + e.currentTarget.dataset.id + '&type=0',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.stockId){
      this.setData({
        stockId: options.stockId
      })
    }
    this.getGoodsList()
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
    // this.getNextPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})