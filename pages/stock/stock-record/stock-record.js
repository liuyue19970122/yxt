// pages/stock/stock-record/stock-record.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stockId: '',
    recordList:[],
    pageSize:20,
    pageNum:1,
    pages:0,
    stockName:'',
    opType:''
  },
  bindStockName:function(e){
    this.setData({
      stockName:e.detail.value
    })
  },
  onChange(e){
    if(e.detail.index==1){
      this.setData({
        opType:'+'
      })
    } else if (e.detail.index == 2) {
      this.setData({
        opType: '-'
      })
    } else if (e.detail.index == 3) {
      this.setData({
        opType: '*'
      })
    }else{
      this.setData({
        opType: ''
      })
    }
    this.setData({
      pageNum:1
    })
    this.getRecordList()
  },
  getRecordList:function(){
    var url = app.globalData.baseUrl +'apiStock/stock/inst/his'
    var data={
      stockName: this.data.stockName,
      pageSize:this.data.pageSize,
      pageNum:this.data.pageNum,
      opType:this.data.opType
    }
    wx.showLoading({
      title: '获取中',
    })
    util.postRequestList(url,data,false,this.recordRes)
  },
  recordRes(res){
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    var content=res.data.content
    var list = content.list
    for (var item of list) {
      var time = util.formatTime(item.crtTime)
      item.crtTime = time
    }
    list=this.data.pageNum==1?list:this.data.recordList.concat(list)
    this.setData({
      recordList:list,
      pages:content.pages
    })
  },
  getNextPage(){
    util.getNextPage(this,this.data.pages,this.getRecordList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      stockId: options.id
    })
    this.getRecordList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  onReachBottom:function(){
    util.getNextPage(this,this.data.pages,this.getRecordList)
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