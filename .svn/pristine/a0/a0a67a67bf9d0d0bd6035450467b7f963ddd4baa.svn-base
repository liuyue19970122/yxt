// pages/mall/handle-order/order-add/add.js
import Dialog from '../../../../miniprogram_npm/vant-weapp/dialog/dialog';
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList: [],
    orderInfo: {
      orderId: '',
      producerName:'',
      openTime: '',
      goodsInfo: '[]'
    },
    confirmInfo:{
      orderId:'',
      detailInfo: ''//JSON数组，修正每条并入库=>keyId:每一条KeyId,fixCount:具体数量
    },
    verifyShow:false,
    oriValue:0,
    verifyIndex:0,
    verifyValue:0,
    ///stock/order/confirm
  },
  //hanleVerify
  hanleVerify(e){
    let index=parseInt(e.currentTarget.dataset.index)
    let proList=this.data.proList
    let oriValue = proList[index].count
    let verifyValue = proList[index].fixCount
    this.setData({ 
      verifyIndex: index, 
      verifyShow:true,
      oriValue,
      verifyValue
    })
  },
  //
  bindVerifyInput(e){
    let verifyValue=e.detail.value
    this.setData({ verifyValue})
  },
  //确认修正
  verifyConfirm(e) {
    let oriValue =this.data.oriValue
    let verifyValue = this.data.verifyValue
    console.log(Number(oriValue) > Number(verifyValue))
    if (Number(oriValue) < Number(verifyValue)){
      wx.showModal({
        title: '修改数量不能大于原数量',
        showCancel:false
      })
    }else{
      let proList = this.data.proList
      let index=this.data.verifyIndex
      proList[index].fixCount = verifyValue
      this.setData({
        verifyShow: false,
        proList
      })
    }
  },
  //取消修正
  verifyCancel(e) {
    this.setData({
      verifyShow: false
    })
  },
  //验收操作
  hanleConfirm(){
    let orderInfo = this.data.orderInfo
    let proList = this.data.proList
    let otArr=[]
    proList.forEach(item=>{
      let obj={
        keyId:item.keyId,
        fixCount: item.fixCount
      }
      otArr.push(obj)
    })
    
    let data= {
      orderId: orderInfo.orderId,
      detailInfo: JSON.stringify(otArr)//JSON数组，修正每条并入库=>keyId:每一条KeyId,fixCount:具体数量
    }
    this.confirmInStock(data)
  },
  //获取订单详情//stock/order/detail
  getOrderDetail(orderId) {
    let url = app.globalData.baseUrl + 'apiStock/stock/order/detail'
    util.getRequestListData(url, { orderId }, false, this.orderDetailRes)
  },
  orderDetailRes(res, type) {
    if (res.data.code === '200') {
      console.log(res)
      let orderInfo = res.data.content
      let ms = parseInt(orderInfo.openTime)
      orderInfo.openTime = util.formatDate(ms)
      orderInfo.orderId=orderInfo.keyId
      let proList = JSON.parse(orderInfo.detailList)
      proList.forEach(item => {
        item.perMoney = util.getMoney(item.perMoney).toString()
        item.fixCount=item.count
      })
      this.setData({ proList, orderInfo})
    }
  },

  //确认验收入库///stock/order/confirm
  // orderId: '', detailInfo: ''//JSON数组，修正每条并入库=>keyId:每一条KeyId,fixCount:具体数量
  confirmInStock(data){
    let url = app.globalData.baseUrl + 'apiStock/stock/order/confirm'
    util.postRequestList(url, data, false, this.confirmInRes)
  },
  confirmInRes(res,type){
    if(res.data.code==='200'){
      wx.navigateBack({
        delta:1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderId=options.orderId
    // let orderId=10
    this.getOrderDetail(orderId)
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