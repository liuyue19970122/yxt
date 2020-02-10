// pages/system/charge-money/recharge.js
// import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyList:[{
      money:298,
      name:'季度',
      score:300
    },{
        money: 558,
      name: '半年',
        score: 600
    },{
        money: 998,
        name: '一年',
        score: 1200
    }],
    vipMoney: [{
      money: 598,
      name: '季度',
      score: 600
    }, {
        money: 1098,
      name: '半年',
        score: 1200
    }, {
        money: 1998,
      name: '一年',
        score: 2400
    }],
    rechargeList:[],
    money:'298',
    time:'季度',
    score:'300',
    isCharge:false,
    detail:'',
    chargeIndex:0
  },
  selectItem(e){
    this.setData({
      chargeIndex: e.currentTarget.dataset.index,
      money:e.currentTarget.dataset.money,
      detail:e.currentTarget.dataset.detail
    })
  },
  getRechargeList(){
    var url=app.globalData.baseUrl+'apiMall/balance/rechargeList'
    util.getRequestList(url,false,this.getRes)
  },
  getRes(res){
    var list=res.data.content
    list.map((item)=>{
      item.chargeMoney = util.getMoney(item.chargeMoney)
    })
    this.setData({
      rechargeList: list
    })
  },
  //微信充值到账户///balance/recharge
  //money,openId
  wxChargeAcc() {
    if (this.data.isCharge) {
      return false
    }
    this.setData({
      isCharge: true
    })
    wx.showLoading({
      title: '充值中...',
      mask: true
    })
    util.getWxOpenId().then(res => {
      let content = JSON.parse(res.data.content)
      let url = app.globalData.baseUrl + 'apiMall/balance/recharge'
      let data = {
        openId: content.openid,
        money: this.data.money
      }
      util.getRequestListData(url, data, false, this.wxChargeAccRes)
    })
  },
  wxChargeAccRes(res, type) {
    wx.hideLoading()
    var that = this
    if (res.data.code === '200') {
      this.setData({
        chargeShow: false
      })
      let list = JSON.parse(res.data.content)
      let timeStamp = list.timeStamp
      let nonceStr = list.nonceStr
      let packageNum = list.package
      let paySign = list.paySign
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': packageNum,
        'signType': 'MD5',
        'paySign': paySign,
        'success': function (res) {
          that.setData({
            isCharge: false
          })
        },
        'fail': function (res) {
          that.setData({
            isCharge: false
          })
          console.log('fail:' + JSON.stringify(res));
        }
      })
    } else {
      wx.showToast({
        title: res.data.message,
        duration: 2000
      })
      this.setData({
        isCharge: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRechargeList()
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