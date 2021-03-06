// pages/receipt/table-add/add.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deskCode:'',
    des:'',
    peopleNum:'',
    isSubmit:false,
  },
  getDeskCode:function(e){
    this.setData({
      deskCode:e.detail
    })
  },
  getPeopleNum: function (e) {
    this.setData({
      peopleNum: e.detail
    })
  },
  getDes:function(e){
    this.setData({
      des:e.detail.value
    })
  },
  onSubmit:function(){
    if (this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    var url = app.globalData.baseUrl +'apiMall/food/desktop/add'
    var data={
      deskCode: this.data.deskCode,
      description: this.data.des,
      peopleNum: this.data.peopleNum,
    }
    util.postRequestList(url,data,false,this.submitRes)
  },
  submitRes(res){
    var that=this
    if(res.data.code==200){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: res.data.message,
      })
    }
    this.setData({
      isSubmit:false
    })
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