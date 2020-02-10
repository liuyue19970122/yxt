// pages/receipt/vege/default-list/list.js
var util = require('../../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList: [],
    selectList: [],
    searchName: '',
    changeList: [],
    multiCateName: '请选择货品分类',
    multiProArray: [],//类别数组
    multiProIndex: [0, 0],
    oldMultiProIndex: '[0,0]',
    isNewPage: true,
    isSubmit: false,
    tplId:0,
  },
  getFoodList() {
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl + 'apiMall/food/default/tempFoodsList?t=' + times
    var data = {
      tmpId:this.data.tplId
    }
    util.getRequestListData(url, data, false, this.foodListRes)
  },
  foodListRes(res) {
    wx.hideLoading()
    var list = res.data.content
    list.map((item) => {
      item.status = false
      item.sellPrice = util.getMoney(item.sellPrice)
    })
    this.setData({
      foodList: list,
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
    var list = this.data.foodList
    list.map((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        item.status = !item.status
      }
    })
    this.setData({
      foodList: list
    })
  },
  onSubmit() {
    if (this.data.isSubmit) {
      return false
    }
    this.setData({
      isSubmit: true
    })
    var url = app.globalData.baseUrl + 'apiMall/food/admin/initDefault?t=' + times
    var list = []
    this.data.foodList.map((item) => {
      if (item.status) {
        list.push(item.keyId)
      }
    })
    var data = {
      cateId: this.data.cateId,
      foodIds: list
    }
    util.postRequestList(url, data, false, this.submitRes)
  },
  submitRes(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: res.data.message,
        duration: 2
      })
    }
    this.setData({
      isSubmit: false
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '../vege-detail/detail?id=' + e.currentTarget.dataset.id + '&type=0',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tplId:options.id
    })
    this.getFoodList()
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