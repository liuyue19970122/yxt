// pages/system/msg-detail/detail.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    id:''
  },
  getDetail(){
    var url = app.globalData.baseUrl + 'apiMall/msg/detail'
    var data={
      keyId:this.data.id
    }
    util.getRequestListData(url,data,false,this.getRes)
  },
  getRes(res){
    if(res.data.code==200){
      res.data.content.crtTime = util.formatDate(res.data.content.crtTime)
      this.setData({
        detail:res.data.content
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    })
    this.getDetail()
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