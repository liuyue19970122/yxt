// pages/stock/stock-warn-set/set.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList:[],
    cateIndex:0,
    goodList: [],
    showWarnDialog:false,
    goodsName:'',
    warnCount:'',
    warnId:'',
    pageSize:20,
    pageNum:1,
    pages:0,
    selectIndex:0,
    ifStorehouse: false,
    ifType: false,
    stockList: [],
    stockIndex: 0,
    cateIndex: 0,
  },
  getStockList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/location/list'
    var data = {
      pageSize: 9999,
      pageNum: 1
    }
    util.getRequestListData(url, data, false, this.stockListRes)
  },
  stockListRes: function (res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    var list = res.data.content.list
    var item = {
      keyId: -1,
      locationName: '全部'
    }
    list.unshift(item)
    this.setData({
      stockList: list
    })
    this.getGoodList()
    // this.getTotalMoney()
  },
  goSelect: function (e) {
    var _this = this
    var type = e.currentTarget.dataset.type
    if (type == 'storage') {
      this.setData({
        ifStorage: !_this.data.ifStorage,
        ifStorehouse: false,
        ifType: false
      })
    } else if (type == 'storehouse') {
      this.setData({
        ifStorage: false,
        ifStorehouse: !_this.data.ifStorehouse,
        ifType: false
      })
    } else if (type == 'type') {
      this.setData({
        ifStorage: false,
        ifStorehouse: false,
        ifType: !_this.data.ifType
      })
    }
  },
  bindStockId(e) {
    this.setData({
      stockIndex: e.currentTarget.dataset.index,
      ifStorehouse: false,
    })
    this.getGoodList()
  },
  bindCateChange(e) {
    this.setData({
      cateIndex: e.currentTarget.dataset.index,
      ifType: false,
      pageNum: 1
    })
    this.getGoodList()
  },
  onChange(e){
    var index=e.currentTarget.dataset.index
    this.setData({
      selectIndex:index
    })
    var url = app.globalData.baseUrl +'apiStock/stock/inst/opWarn'
    var data={
      isOpen: this.data.goodList[index].warnFlag=="1"?0:1,
      stockId: this.data.goodList[index].keyId,
    }
    util.postRequestList(url,data,false,this.changeRes)
  },
  changeRes(res){
    var that=this
    if(res.data.code==200){
      var list=this.data.goodList
      list[this.data.selectIndex].warnFlag = list[this.data.selectIndex].warnFlag==1?0:1
      this.setData({
        goodList:list
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  bindChangeCate(e){
    this.setData({
      cateIndex:parseInt(e.detail.value),
      pageNum:1
    })
    this.getGoodList()
  },
  changeGoodsName(e){
    var obj = util.inputTest(e)
    this.setData({
      goodsName: obj.value
    })
  },
  getCateList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res) {
    var list = res.data.content
    for (var item of list) {
      item.nextList = JSON.parse(item.nextList)
    }
    list.unshift({
      keyId: -1,
      cateName: '全部',
      nextList: []
    })
    this.setData({
      cateList: list
    })
    this.getStockList()
  },
  goSearch(){
    this.setData({
      pageNum:1
    })
    this.getGoodList()
  },
  getGoodList: function () {
    wx.showLoading({
      title: '获取中',
    })
    var url = app.globalData.baseUrl + 'apiStock/stock/inst/list'
    var data = {
      cateId: this.data.cateList[this.data.cateIndex].keyId,
      goodsName: this.data.goodsName,
      stockId:this.data.stockList[this.data.stockIndex].keyId,
      pageSize:10,
      pageNum:this.data.pageNum
    }
    util.getRequestListData(url, data, false, this.goodListRes)
  },
  goodListRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    if (res.data.code == 200) {
      var list = res.data.content.list
      for (var item of list) {
        var time = util.formatTime(item.lastTime)
        item.lastTime = time
      }
      list = this.data.pageNum == 1 ? list : this.data.goodList.concat(list)
      this.setData({
        goodList: list,
        pages:res.data.content.pages
      })
    }
  },
  getNextPage(){
    util.getNextPage(this, this.data.pages, this.getGoodList)
  },
  goSet(e) {
    var goodObj = this.data.goodList[e.currentTarget.dataset.index]
    this.setData({
      setIndex:e.currentTarget.dataset.index
    })
    this.setData({
      warnCount: goodObj.hasOwnProperty('warnCount') ? goodObj.warnCount : 0,
      warnId: goodObj.keyId,
      showWarnDialog: true,
    })
  },
  getWarnCount(e) {
    this.setData({
      warnCount: e.detail.value
    })
  },
  onClose(){
    this.setData({
      showWarnDialog:false
    })
  },
  setWarnCount() {
    var url = app.globalData.baseUrl + 'apiStock/stock/inst/setWarn'
    var data = {
      stockId: this.data.warnId,
      warnCount: this.data.warnCount
    }
    this.setData({
      showWarnDialog:false,
    })
    util.postRequestList(url, data, false, this.setRes)
  },
  setRes(res) {
    if(res.data.code==200){
      var goodList=this.data.goodList
      goodList[this.data.setIndex].warnCount=this.data.warnCount
      this.setData({
        goodList
      })
    }else{
      wx.showToast({
        icon:'none',
        title: res.data.message
      })
    }
    // this.getGoodList()
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
    this.getCateList()
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