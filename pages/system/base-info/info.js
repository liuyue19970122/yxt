// pages/system/base-info/info.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
var util = require('../../../utils/util.js');
const app = getApp()
var qqmapsdk = new QQMapWX({
  key: 'APYBZ-TKQ6X-GAJ4A-7CDCW-JHK4K-LFB2Q' // 必填
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    start:'',
    end:'',
    address:'',
    poi:{}
  },
  bindInputAddress(e){
    this.setData({
      address:e.detail.value
    })
    this.getPoi()
  },
  getInfo(){
    var url = app.globalData.baseUrl +'apiUser/org/myInfo'
    util.getRequestList(url,false,this.infoRes)
  },
  infoRes(res){
    this.setData({
      info:res.data.content,
      start: res.data.content.businessStartTime,
      end: res.data.content.businessEndTime,
      mobile: res.data.content.mobile,
      address:res.data.content.address
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
  getMobile(e) {
    this.setData({
      mobile: e.detail
    })
  },
  getAddress(){
    var that=this
    wx.getLocation({
      success: function(res) {
        var poi={
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.setData({
          poi
        })
      },
    })
  },
  getPoi() {
    var _this = this;
    //调用地址解析接口
    var detail = _this.data.address
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: detail, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) { //成功后的回调
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          }
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  chooseLocation() {
    var that = this
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.chooseLocation({
                latitude: that.data.poi.latitude,
                longitude: that.data.poi.longitude,
                success: function (res) {
                  var poi = {
                    latitude: res.latitude,
                    longitude: res.longitude
                  }
                  that.setData({
                    poi:poi,
                    address:res.name
                  })
                },
              })
            }
          })
        }
      }
    })
  },

  updateInfo(){
    if (!(/^1[3456789]\d{9}$/.test(this.data.mobile))) {
      Notify({
        type: 'warning',
        message: '客服电话格式不正确'
      });
      return false
    }
    wx.showLoading({
      title: '更新中',
    })
    var url = app.globalData.baseUrl + 'apiUser//org/setBusTime'
    var data={
      startTime:this.data.start,
      stopTime:this.data.end,
      mobile:this.data.mobile,
      address:this.data.address,
      latitude: this.data.poi.latitude,
      longitude: this.data.poi.longitude
    }
    util.postRequestList(url,data,false,this.updateRes)
  },
  updateRes(res){
    wx.hideLoading()
    if(res.data.code==200){
      wx.showToast({
        title: '修改成功',
      })
      this.getInfo()
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.isGo=false
    this.getInfo()
    this.getAddress()
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