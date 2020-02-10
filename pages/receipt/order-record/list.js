// pages/receipt/order-record/list.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList: [],
    statusList: [{
      id:'',
      name:'全部'
    }, {
        id: 0,
        name: '用餐中'
      }, {
        id: 1,
        name: '已完成'
      },],
    pageNum: 1,
    payList:[
      {
        id: '',
        name: '全部'
      },
      {
        id: 1,
        name: '已支付'
      },
      {
        id:0,
        name: '未支付'
      },
    ],
    payIndex:0,
    statusIndex:0,
    ifPay:false,
    ifStatus:false
  },
  goDetail(e){
    wx.navigateTo({
      url: '../submit-order/submit?orderId='+e.currentTarget.dataset.id+"&status="+e.currentTarget.dataset.status+'&payFlag='+e.currentTarget.dataset.pay,
    })
  },
  goSelect: function (e) {
    var _this = this
    var type = e.currentTarget.dataset.type
    if (type == 'status') {
      this.setData({
        ifStatus: !_this.data.ifStatus,
        ifPay: false
      })
    } else if (type == 'pay') {
      this.setData({
        ifStatus: false,
        ifPay: !_this.data.ifPay,
      })
    }
  },
  cancelSelect(){
    this.setData({
      ifStatus:false,
      ifPay:false
    })
  },
  bindStatus(e) {
    this.setData({
      ifStatus: false,
      statusIndex: e.currentTarget.dataset.index,
      pageNum: 1
    })
    this.getRecordList()
  },
  bindPay(e) {
    this.setData({
      ifPay: false,
      payIndex: e.currentTarget.dataset.index,
      pageNum: 1
    })
    this.getRecordList()
  },
  getRecordList() {
    wx.showLoading({
      title: '获取中',
    })
    var url = app.globalData.baseUrl + 'apiMall/food/order/list'
    var data = {
      payFlag:this.data.payList[this.data.payIndex].id,
      status:this.data.statusList[this.data.statusIndex].id,
      pageNum:this.data.pageNum,
      pageSize:10
    }
    util.getRequestListData(url, data, false, this.getRes)
  },
  getRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 500)
    if(res.data.code==200){
      res.data.content.list.map((item)=>{
        item.endTime = util.formatTime(item.endTime)
        item.beginTime = util.formatTime(item.beginTime)
        item.crtTime = util.formatTime(item.crtTime)
        item.totalMoney = util.getMoney(item.totalMoney)
        item.realMoney = util.getMoney(item.realMoney)
        item.deskList=JSON.parse(item.deskList)
      })
      var list = this.data.pageNum == 1 ? res.data.content.list : this.data.recordList.concat(res.data.content.list)
      this.setData({
        recordList: list,
        pages:res.data.content.pages
      })
    }
  },
  getNextPage(){
    util.getNextPage(this,this.data.pages,this.getRecordList)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.status){
      this.setData({
        statusIndex:1
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
    this.getRecordList()
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