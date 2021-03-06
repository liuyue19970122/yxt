// pages/stock/add-category/add-category.js

var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectCate: 0,
    cateList: [],
    cateName: '',
    sortNum: '',
    cateId:-1,
    title:'',
    isNew:true
  },
  changeSort: function(e) {
    this.setData({
      sortNum: e.detail.value
    })
  },
  getCateList() {
    var url = app.globalData.baseUrl + 'apiMall/food/cate/list'
    util.getRequestList(url, false, this.cateListRes)
  },
  goSystem() {
    wx.navigateTo({
      url: '../vage-category/list',
    })
  },
  cateListRes(res) {
    var list = res.data.content
    var item = {
      keyId: -1,
      cateName: '无上级'
    }
    list.unshift(item)
    this.setData({
      cateList: list
    })
  },
  cateChange: function(e) {
    this.setData({
      selectCate: e.detail.value
    })
  },
  changeName: function(e) {
    var obj = util.inputTest(e)
    this.setData({
      cateName: obj.value
    })
  },
  addCate: function() {
    var url = app.globalData.baseUrl + 'apiMall/food/cate/add'
    var data = {
      parentId: this.data.cateList[this.data.selectCate].keyId,
      cateName: this.data.cateName,
      sortNum: this.data.sortNum
    }
    util.postRequestList(url, data, false, this.addRes)
  },
  addRes: function(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: res.data.message,
      })
    }
  },
  updateCate:function(){
    var url = app.globalData.baseUrl + 'apiMall/food/cate/update'
    var data = {
      cateId: this.data.cateId,
      cateName: this.data.cateName,
      sortNum: this.data.sortNum
    }
    util.postRequestList(url, data, false, this.addRes)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCateList()
    if(options.id){
      this.setData({
        cateId:options.id,
        cateName:options.name,
        sortNum:options.sortNum,
        isNew:false
      })
    }
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