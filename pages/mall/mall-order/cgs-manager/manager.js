// pages/mall/order-manager/order-manager.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '-1',
    orderList: [],
    orderId:1,
    tabList: [
      {
        id: -1,
        title: '全部'
      },{
        id: 0,
        title: '待预付'
      },
      {
        id: 1,
        title: '待收货'
      }, 
      {
        id: 2,
        title: '已收货'
      },
      {
        id: 9,
        title: '已结清'
      }, {
        id: 3,
        title: '退款/售后'
      }
    ],
    filterData:{
      goodsName:'',
      status:-1,
      pageNum:1,
      pageSize:10
    },
    hasNextPage:true,
    hasContent:true,
    isNewPage:true,
    pageFromType:'new'//new新进界面 change数据是否变更
  },
  //tab更改
  changeTab(e) {
    console.log(e)
    let type = e.detail.type
    let filterData=this.data.filterData
    filterData.pageNum=1
    filterData.status=type
    this.setData({ type,filterData})
    this.getOrderList(filterData,'refresh')
  },
  //查看订单详情
  goDetail(e) {
    // var item = e.currentTarget.dataset.item
    // var deliver = e.currentTarget.dataset.deliver
    var orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../cgs-detail/detail?id=' + orderId,
    })
  },
  
  //联系商家
  contactStore(e){
    let index=e.currentTarget.dataset.index
    let orderList = this.data.orderList
    let linkMobile=orderList[index].linkMobile
    let that = this
    wx.makePhoneCall({
      phoneNumber: linkMobile,
      success: function (res) {
      },
      fail(resp) {
        console.log(resp)
        wx.showModal({
          title: '提示',
          content: resp.message,
          showCancel: false
        })
      }
    })
  },
  //取消订单
  cancelOrder(e){
    let _this=this
    let index = parseInt(e.target.dataset.index)
    let orderList = this.data.orderList
    let orderId = orderList[index].orderId
    this.setData({ orderId})
    wx.showModal({
      title: '提示',
      content: '确定取消该订单？',
      success: function (res) {
        if (res.confirm) {
          _this.cancelOrderRequest(orderId)
        }
      }
    })
  },
  //未发货前取消订单/order/inst/cancelOrder
  //orderId
  cancelOrderRequest(id){
    let url = app.globalData.baseUrl + 'apiMall/order/inst/cancelOrder'
    util.postRequestList(url, { orderId: id }, false, this.cancelOrderRequestRes)
  },
  cancelOrderRequestRes(res,type){
    if(res.data.code==='200'){
      let orderList=this.data.orderList
      let orderId=this.data.orderId
      orderList.forEach((item,index)=>{
        if (item.orderId===orderId){
          orderList.splice(index, 1)
        }
      })
      this.setData({ orderList})
      wx.showToast({
        title: '取消成功',
        duration:2000
      })
    }
  },
  
  //订单支付
  orderPay(e){
    let index=parseInt(e.target.dataset.index)
    let orderList = this.data.orderList
    let obj = orderList[index]
    let arr=[]
    arr[0] =obj.orderId
    let payMoneyStr = obj.totalMoney
    let orderIds = JSON.stringify(arr)
    wx.navigateTo({
      url: '/pages/mall/mall-pay/pay?orderIds=' + orderIds + '&payMoney=' + payMoneyStr+'&enterType=cgsOrder'
    })
  },
  //scanFlow查看物流
  scanFlow(e){
    let index = parseInt(e.target.dataset.index)
    let orderList = this.data.orderList
    let orderId=orderList[index].orderId
    wx.navigateTo({
      url: '/pages/common/address-review/address-review?orderId='+orderId+'&pageInType=cgsOrder',
    })
  },
  //scanOrderDetail查看详情
  scanOrderDetail(e){
    let index = parseInt(e.target.dataset.index)
    let orderList = this.data.orderList
    let orderId=orderList[index].orderId
    wx.navigateTo({
      url: '../cgs-detail/detail?id=' + orderId,
    })
  },
  //confirmReceipt确认收货///order/inst/sureOrderList确认收货列表（进行入库校验）
  confirmReceipt(e){
    let index = parseInt(e.target.dataset.index)
    let orderList = this.data.orderList
    let orderId = orderList[index].orderId
    this.setData({ orderId})
    wx.navigateTo({
      url: '/pages/stock/stock-correct/stock-correct?orderId='+orderId+'&pageInStyle=fromOrder',
    })
  },
  //
  //确认收货请求/order/inst/sureOrder
  //orderId,fixDetail修正数量JSON数组，参数:keyId商品每个记录detailKeyId，fixCount入库数量，cateId返回结果的myCateId(不允许更改)
  receiptRequest(){
    let data={
      orderId,
      fixDetail
    }
    let url = app.globalData.baseUrl + 'apiMall/order/inst/sureOrder'
    util.postRequestList(url, data, false, that.receiptRequestRes)
  },
  receiptRequestRes(res,type){
    if(res.data.code==='200'){

    }
  },
  //applySale申请售后
  applySale(e){

  },
  //delOrder删除订单
  delOrder(e){

  },
  goDel(e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      orderId:id
    })
    var that=this
    
  },
  delOrderRequest(id){
    let url = app.globalData.baseUrl + 'apiMall/order/inst/delete'
    util.postRequestList(url, { orderId: id }, false, that.delOrderRes)
  },
  delOrderRes(res,type){
    if(res.data.code==='200'){
      let list = this.data.orderList
      for (let i in list) {
        if (this.data.orderId == list[i].orderId) {
          list.splice(i, 1)
        }
      }
      this.setData({
        orderList: list
      })
    }
  },
  //获取订单列表
  getOrderList(data,type) {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    let url = app.globalData.baseUrl + 'apiMall/order/inst/list'
    util.getRequestListData(url, data, type, this.getOrderListRes)
  },
  getOrderListRes(res,type) {
    wx.hideLoading()
    // console.log(res)
    if(res.data.code==='200'){
      let list = res.data.content.list
      let hasNextPage = res.data.content.hasNextPage
      let hasContent=list.length?true:false
      this.setData({ hasNextPage, hasContent})
      
      for (let item of list) {
        item.crtTime = util.formatTime(item.crtTime)
        item.goodsInfo = JSON.parse(item.goodsInfo)
        item.totalMoney = util.getMoney(item.totalMoney)
        item.contactShow = false//联系功能
        item.cancelShow = false//取消订单
        item.payShow = false//支付预付款
        item.flowShow = false//查看物流
        item.applyShow = false//申请售后
        item.queryShow=false//确认收货
        item.allPayShow = false//支付尾款
        item.delShow = false//删除订单
        item.detailShow=false//订单详情
        if (item.status === 0) {
          //0待预付
          item.contactShow = true
          item.payShow = true
          item.cancelShow = true
        }
        if (item.status === 1) {
          //1待收货
          item.contactShow = true
          item.cancelShow = item.deliveryStatus === -1 ? true : false
          item.flowShow = item.deliveryStatus === 0 || item.deliveryStatus === 1? true : false
          item.queryShow = item.deliveryStatus === 1?true:false//确认收货
        }
        if (item.status === 2) {
          //2已收货
          item.contactShow = true
          item.detailShow=true
          item.allPayShow = true//支付尾款
        }
        if (item.status === 3){
          //3售后
          item.contactShow = true
          item.detailShow=true
          //item.flowShow = true//查看物流
          //item.delShow = false//删除订单
        }
        if(item.status===9){
          //9已结清
          item.contactShow = true
          item.detailShow=true
          // item.flowShow = true//查看物流
          // item.delShow = false//删除订单
        }
      }
      if(type==='refresh'){
        this.setData({
          orderList: list
        })
      }
      if(type==='reachBottom'){
        let orderList=this.data.orderList
        list.forEach(item=>{
          orderList.push(item)
        })
        this.setData({orderList})
      }
      console.log(list)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // if(options.status){
    //   this.setData({
    //     type:options.status
    //   })
    // }
    let data = this.data.filterData
    this.getOrderList(data, 'refresh')
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
    console.log(111)
    console.log(this.data.hasNextPage)
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.getOrderList(filterData,'reachBottom')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})