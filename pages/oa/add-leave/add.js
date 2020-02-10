// pages/oa/add-leave/add.js
var util = require('../../../utils/util.js');
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:[],
    name:[],
    type:0,
    start:'',
    end:'',
    reason:'',
    isSubmit:false,
    showStartTime:false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2030, 10, 1).getTime(),
    startTime: new Date().getTime(),
    endTime: new Date().getTime(),
    startTimeFor:'',
    endTimeFor: ''
  },
  bindStartTime(e){
    this.setData({
      showStartTime:false,
      startTime: e.detail,
      startTimeFor: util.getNowTime(e.detail),
    })
  },
  bindEndTime(e) {
    this.setData({
      showEndTime: false,
      endTime: e.detail,
      endTimeFor: util.getNowTime(e.detail)
    })
  },
  closePop(){
    this.setData({
      showStartTime: false,
      showEndTime: false
    })
  },
  getType() {
    var url = app.globalData.baseUrl + 'apiUser/user/leave/types'
    util.getRequestList(url, false, this.typeRes)
  },
  openStart(){
    this.setData({
      showStartTime:true
    })
  },
  openEnd() {
    this.setData({
      showEndTime: true
    })
  },
  typeRes(res) {
    this.setData({
      typeList: res.data.content
    })
  },
  selectType(e){
    this.setData({
      type: e.detail.value
    })
  },
  getStart(e){
    this.setData({
      start:e.detail.value
    })
  },
  getEnd(e) {
    this.setData({
      end: e.detail.value
    })
  },
  getReason(e){
    this.setData({
      reason:e.detail.value
    })
  },
  delPerson:function(e){
    var index=e.currentTarget.dataset.index
    var name = this.data.name
    name.splice(index,1)
    this.setData({
      name:name,
      // start:
    })
  },
  goAdd(){
    wx.navigateTo({
      url: '../person-list/list',
    })
  },
  goSubmit(){
    if(this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    var name=this.data.name
    var ids=[]
    for(var item of name){
      ids.push(item.id)
    }
    if(this.data.start>this.data.end){
      Notify({
        type:'warning',
        message:'开始时间需小于结束时间'
      })
      return false
    }
    if(ids.length==0){
      Notify({
        type: 'warning',
        message: '请选择审批人'
      })
      return false
    }
    var url = app.globalData.baseUrl + 'apiUser/user/leave/new'
    var data={
      leaveType:this.data.typeList[this.data.type],
      startTime: this.data.startTime,
      endTime:this.data.endTime,
      appUsers:ids,
      reason:this.data.reason,
      copyUsers:[]
    }
    util.postRequestList(url, data, false, this.submitRes)
  },
  submitRes(res){
    if(res.data.code==200){
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
    var time=new Date()
    var year = time.getFullYear()
    var month = time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1)
    var day = time.getDate() > 9 ? time.getDate() + 1 : "0" + (time.getDate() + 1)
    var date=[year, month, day].join('-')
    this.setData({
      start: date,
      end:date,
    })
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
    this.getType()
    this.setData({
      isSubmit:false,
      startTimeFor: util.getNowTime(),
      endTimeFor:util.getNowTime(),
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