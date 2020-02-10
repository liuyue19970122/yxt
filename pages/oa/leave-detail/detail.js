// pages/oa/leave-detail/detail.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agreeReasonShow: false,
    refuseReasonShow: false,
    reason: "",
    leaveDetail: {},
    index: '',
    status: 0,
    type:'',
    appUsers:[],
    replyUserName:''
  },
  showRefuse() {
    this.setData({
      refuseReasonShow: true
    })
  },
  showAgree() {
    this.setData({
      agreeReasonShow: true
    })
  },
  inputRefuse(e) {
    this.setData({
      refuseReason: e.detail.value
    })
  },
  inputAgree(e) {
    this.setData({
      agreeReason: e.detail.value
    })
  },
  getDetail() {
    var page = getCurrentPages()
    var prevPage = page[page.length - 2]
    var list = prevPage.data.leaveList
    if (prevPage.data.type=='self'){
      var appUsers = JSON.parse(list[this.data.index].appUsers)
      this.setData({
        appUsers: appUsers,
      })
    }else{
      this.setData({
        replyUserName: list[this.data.index].replyUserName,
      })
    }
    this.setData({
      leaveDetail: list[this.data.index],
      type:prevPage.data.type
    })
  },
  changeState(e) {
    var status = e.currentTarget.dataset.status
    this.setData({
      status: status
    })
    if (status == 0) {
      this.showRefuse()
    } else {
      this.showAgree()
    }
  },
  onClose(){
    this.setData({
      refuseReasonShow: false,
      agreeReasonShow:false,
    })
  },
  submitChange() {
    var url = app.globalData.baseUrl + 'apiUser/user/leave/opLeave'
    var reason=''
    if (this.data.status == 0) {
      reason = this.data.refuseReason
    } else {
      reason = this.data.agreeReason
    }
    var data = {
      leaveId: this.data.leaveDetail.keyId,
      status: this.data.status,
      reason: reason
    }
    util.postRequestList(url, data, false, this.changeRes)
  },
  changeRes(res) {
    if (res.data.code == 200) {
      wx.showModal({
        title: '提示',
        content: '操作成功',
        showCancel:false,
        success:function(res){
          wx.navigateBack({
            delta:1
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: res.data.message,
        showCancel: false,
        success: function (res) {
          // wx.navigateBack({
          //   delta: 1
          // })
        }
      })
    }
  },
  cancelLeave(){
    var that=this
    wx.showModal({
      title: '提示',
      content: '确定要撤销申请么？',
      success:function(res){
        if(res.confirm){
          var url = app.globalData.baseUrl + 'apiUser/user/leave/cancel'
          var data = {
            leaveId: that.data.leaveDetail.keyId
          }
          util.postRequestList(url, data, false, that.cancelRes)
        }
      }
    })
  },
  cancelRes(res){
    if(res.data.code==200){
      wx.navigateBack({
        delta:1
      })
    }else{
      wx.showToast({
        title: res.data.message,
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      index: options.index
    })
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