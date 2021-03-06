// pages/receipt/table-update/update.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusIndex:0,
    statusList:[
      {
        status:0,
        name:'空闲'
      }, {
        status: 1,
        name: '使用中'
      }, {
        status: 2,
        name: '已预订'
      },
    ],
    time:'',
    // deskCode: '',
    // des: '',
    // peopleNum: '',
    // deskId:'',
    deskDetail:{},
    isSubmit:false,
  },
  bindChangeTime(e){
    this.setData({
      time:e.detail.value
    })
  },
  getDeskCode: function (e) {
    var detail=this.data.deskDetail
    detail.deskCode=e.detail
    this.setData({
      deskDetail: detail
    })
  },
  getPeopleNum: function (e) {
    var detail = this.data.deskDetail
    detail.peopleNum = e.detail
    this.setData({
      deskDetail: detail
    })
  },
  getDes: function (e) {
    var detail = this.data.deskDetail
    detail.description = e.detail
    this.setData({
      deskDetail: detail
    })
  },
  getStatus:function(e){
    this.setData({
      statusIndex:e.detail.value
    })
  },
  onUpdate: function () {
    if(this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    var url = app.globalData.baseUrl + 'apiMall/food/desktop/update'
    var data = {
      deskId:this.data.deskDetail.keyId,
      deskCode: this.data.deskDetail.deskCode,
      description: this.data.deskDetail.description,
      peopleNum: this.data.deskDetail.peopleNum,
      status:this.data.statusList[this.data.statusIndex].status,
    }
    if(this.data.statusIndex==2){
      if(this.data.time==''){
        wx.showToast({
          title: '请选择预定时间',
        })
        return false
      }
      data.reserveTime=this.data.time
    }
    util.postRequestList(url, data, false, this.updateRes)
  },
  updateRes(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
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
    var pages=getCurrentPages()
    var prevPage=pages[pages.length-2]
    var detail = prevPage.data.desktopList[options.index]
    var list=this.data.statusList
    var index=0
    if(options.index){
      for(var i in list){
        if(list[i].status==detail.status){
          index=i
          break
        }
      }
      this.setData({
        statusIndex:index,
        deskDetail:detail
      })
    }
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