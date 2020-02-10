// pages/stock/stock-correct/stock-correct.js
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stockProList: [],//分类库存商品
    stockProIndex: 0,
    stockDisabled: false,
    goodsList:[],
    orderId: null,
    pageReady:false,
    pageInStyle:'fromIndex'
  },
 
  //去设置货品
  toSetCatePro(){
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-in',
    })
  },
  
  //去选择库存产品
  bindStockChange(e) {
    console.log(e)
    let si = parseInt(e.detail.value)
    let pi=parseInt(e.currentTarget.dataset.index)
    let stockProList = this.data.stockProList
    let goodsList = this.data.goodsList
    goodsList[pi].stockId = stockProList[si].keyId
    goodsList[pi].stockProIndex = si
    goodsList[pi].cusName = stockProList[si].cusName
    this.setData({
      goodsList
    })
  },
  bindStockCancel(e) {

  },
  //修正数量变更
  getFixCount(e) {
    let _this=this
    let list = this.data.goodsList
    let fixCount = Number(e.detail.value)
    let curIndex = parseInt(e.currentTarget.dataset.index)
    list.map((item, index) => {
      if (index == curIndex) {
        item.fixCount = fixCount
        let stockCount = Number(item.stockCount)
        console.log(item.fixCount)
        if (fixCount > stockCount) {
          wx.showModal({
            title: '提示',
            content: '需小于购买总量',
            showCancel: false,
            success: function (res) {
              item.fixCount = item.stockCount
              _this.setData({
                goodsList: list
              })
            }
          })
        }
      }
    })
  },
  //获取仓库某类产品列表///stock/inst/list
  getStorageProList() {
    wx.showLoading({
      title: '加载中...',
    })
    let data = {
      cateId: '-1',
      locationId: '',//仓库ID
      goodsName: '',//产品名称
      warnFlag: '0',//1是0否只显示告警
      pageNum: 1,
      pageSize: 99999
    }
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/list'
    util.getRequestListData(url, data, false, this.storageProListRes)
  },
  storageProListRes(res, type) {
    wx.hideLoading()
    if (res.data.code === '200') {
      let list = res.data.content.list
      if (list.length) {
        list.forEach(item => {
          item.date = util.formatTime(item.lastTime)
          item.cusName = item.goodsName + '/' + item.goodsUnit
        })
        this.setData({
          stockProList: list
        })
      } 
      this.getGoodsDetail(this.data.orderId)
    }
  },
  //获取订单详情
  getGoodsDetail(orderId) {
    let url = app.globalData.baseUrl + 'apiMall/order/inst/sureOrderList'
    util.getRequestListData(url, { orderId }, false, this.detailRes)
  },
  detailRes(res){
    if(res.data.code==='200'){
      let pageReady=true
      let list = res.data.content
      let stockProList=this.data.stockProList
      list.map((item) => {
        item.fixCount = item.stockCount
        item.cusDisabled=false
        if (item.stockId && item.stockId!=='null'){
          item.cusDisabled=true
          stockProList.map((val,si)=>{
            if(val.keyId===item.stockId){
              item.stockProIndex=si
              item.cusName = val.cusName
            }
          })
        }else{
          item.stockProIndex=''
          item.cusName='请选择商品库存归属'
        }
      })
      this.setData({
        goodsList: list,
        pageReady
      })
    }
  },
  //信息提示功能
  warnInfo(msg) {
    Notify({ type: 'danger', message: msg });
  },
  //提交数据
  submitOrder(){
    let goodsList=this.data.goodsList
    let detail=[]
    for(let i=0;i<goodsList.length;i++){
      if (!goodsList[i].stockId || goodsList[i].stockId === 'null') {
        this.warnInfo(goodsList[i].stockName + '商品未选择库存归属')
        return;
      }
      let obj = {
        keyId: goodsList[i].detailKeyId,
        stockId: goodsList[i].stockId,
        fixCount: goodsList[i].fixCount
      }
      detail.push(obj)
    }
    console.log(detail)
    let url = app.globalData.baseUrl + 'apiMall/order/inst/sureOrder'
    let data = {
      orderId: this.data.orderId,
      fixDetail: JSON.stringify(detail)//keyId: 每个记录detailKeyId，stockId: 选择库存ID，fixCount: 实际入库数量
    }
    console.log(data)
    util.postRequestList(url, data, false, this.submitRes)
  },
  submitRes(res) {
    let _this=this
    if (res.data.code == 200) {
      wx.showToast({
        title: '入库成功',
        mask:true,
        duration:2000,
        success: function(res) {
          let prevPage=util.getPrevPage()
          if(_this.data.pageInStyle==='fromOrder'){
            let filterData = prevPage.data.filterData
            filterData.pageNum=filterData.pageNum*filterData.pageSize
            prevPage.getOrderList(filterData, 'refresh')
          }else if(_this.data.pageInStyle==='fromOrderDetail'){
            prevPage.getOrderDetail()
          }
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.showToast({
        title: res.data.message,
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let pageInStyle=options.pageInStyle
    let orderId=options.orderId
    this.setData({pageInStyle,orderId})
    this.getStorageProList()
    
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
    if(this.data.orderId){
      this.getStorageProList()
    }
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