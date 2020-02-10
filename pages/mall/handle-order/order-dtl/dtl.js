// pages/mall/handle-order/order-add/add.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selSupName:'点击选择',
    orderDate:'',
    userName:'',
    proList:[],
    orderInfo:{
      orderId:'',
      producerId:'',
      openTime:'',
      goodsInfo:'[]'
    }
  },
  
  //获取订单详情//order/admin/detail
  getOrderDetail(orderId) {
    let url = app.globalData.baseUrl + 'apiStock/stock/order/detail'
    util.getRequestListData(url, { orderId }, false, this.orderDetailRes)
  },
  orderDetailRes(res, type) {
    if (res.data.code === '200') {
      console.log(res)
      let orderInfo=res.data.content
      let proList = JSON.parse(orderInfo.detailList)
      proList.forEach(item=>{
        item.perMoney = util.getMoney(item.perMoney).toString()
      })
      orderInfo.orderId = orderInfo.keyId
      let userName = orderInfo.userName
      let selSupName = orderInfo.producerName
      let ms = parseInt(orderInfo.openTime)
      console.log(ms)
      let orderDate = util.formatDate(ms)
      this.setData({ proList, orderInfo, userName, selSupName, orderDate})
      console.log(this.data.proList)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.orderId
    this.getOrderDetail(id)
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