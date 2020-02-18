// pages/receipt/sell-report/sell.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year:2019,
    dataList:[],
    totalMoney:0,
    subMoney:0,
    money:0,
  },
  changeYear(e){
    // console.log(e)
    this.setData({
      year:e.detail.value
    })
    this.getData()
  },
  getData(){
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.globalData.baseUrl +'apiMall/report/seller?t='+times
    var data={
      year:this.data.year
    }
    util.getRequestListData(url,data,false,this.dataRes)
  },
  dataRes(res){
    // console.log(res)
    wx.hideLoading()
    if(res.data.code==200){
      var list=res.data.content
      var totalMoney=0
      list.map((item,index)=>{
        totalMoney += item.totalMoney
        item.totalMoney=util.getMoney(item.totalMoney)
      })
      var total = util.getMoney(totalMoney)
      list.map((item,index)=>{
        // console.log()
        console.log(item.totalMoney / total)
        item.percent = this.toPercent(item.totalMoney / total)
        console.log(item.percent)
      })
      totalMoney = util.getMoney(totalMoney)
      var money = totalMoney.split('.')[0]
      var subMoney=totalMoney.split('.')[1]
      this.setData({
        dataList:res.data.content,
        subMoney: subMoney,
        money: money,
        totalMoney: totalMoney
      })
    }
  },
  toPercent:function(point){
    var str = Number(point * 100).toFixed(1);
    str+= "%";
    return str;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date=new Date()
    this.setData({
      year:date.getFullYear()
    })
    this.getData()
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