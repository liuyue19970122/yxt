// pages/mall/handle-order/order-add/add.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierList:[],
    supplierIndex:0,
    selSupName:'点击选择',
    orderDate:'请选择时间',
    userName:'',
    proList:[],
    orderInfo:{
      orderId:'',
      producerId:'',
      openTime:'',
      goodsInfo:'[]'
    },
    editShow:false,
    curIndex:0
  },
  //handleAddSupplier添加供应商
  handleAddSupplier(){
    wx.navigateTo({
      url: '../supplier-add/add',
    })
  },
  //选择供货商
  bindSupplierChange(e){
    let index=parseInt(e.detail.value)
    let supplierList=this.data.supplierList
    let orderInfo = this.data.orderInfo
    orderInfo.producerId = supplierList[index].keyId
    this.setData({
      supplierIndex:index,
      selSupName: supplierList[index].name,
      orderInfo: orderInfo
    })
  },
  bindSupplierCancel(e){
    
  },
  //选择时间
  bindDateChange(e){
    let orderDate = e.detail.value
    let od=orderDate.replace(/'-'/g,'/')
    let ms=Date.parse(new Date(od))
    let orderInfo = this.data.orderInfo
    orderInfo.openTime = ms
    this.setData({ orderDate, orderInfo})
  },
  bindDateCancel() { },
  //导入商品
  handleImportPro(){
    wx.navigateTo({
      url: '../pro-search/search',
    })
  },
  //添加商品
  handleAddPro(){
    wx.navigateTo({
      url: '../pro-add/add?actType=add',
    })
  },
  //编辑
  handleEdit(e){
    let curIndex=parseInt(e.currentTarget.dataset.index)
    this.setData({editShow:true,curIndex})
  },
  bindClose(){
    this.setData({editShow:false})
  },
  //修改货品品
  bindEditGoods(){
    let index = this.data.curIndex
    let proList=this.data.proList
    let proObj = proList[index]
    let proInfoStr = JSON.stringify(proObj)
    wx.navigateTo({
      url: '../pro-add/add?actType=edit&proInfo=' + proInfoStr + '&index=' + index,
    })
    this.bindClose()
  },
  //删除货品
  bindDelGoods(){
    let index=this.data.curIndex
    let proList=this.data.proList
    let _this=this
    this.bindClose()
    wx.showModal({
      title: '提示',
      content: '确认是否删除该货品？',
      success(res) {
        if (res.confirm) {
          proList.splice(index,1)
          _this.setData({proList})
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //handleSave保存
  handleSave(){
    let orderInfo = this.data.orderInfo
    let info = this.data.proList
    if (!orderInfo.producerId){
      this.warnInfo('请选择供货商')
      return
    }
    if (!orderInfo.openTime) {
      this.warnInfo('请选择时间')
      return
    }
    if (info.length===0){
      this.warnInfo('请添加货品')
      return
    }
    let infoStr = JSON.stringify(info)
    let data = {
      orderId: orderInfo.orderId,
      producerId: orderInfo.producerId,
      openTime: orderInfo.openTime,
      goodsInfo: infoStr
    }
    this.addSaveOrder(data)
  },
  //信息提示功能
  warnInfo(msg) {
    Notify({ type: 'warning', message: msg });
  },
  //handleSubmit提交
  handleSubmit(){
    let orderInfo=this.data.orderInfo
    let info = this.data.proList
    if (!orderInfo.producerId){
      this.warnInfo('请选择供货商')
      return
    }
    if (!orderInfo.openTime) {
      this.warnInfo('请选择时间')
      return
    }
    if (info.length===0){
      this.warnInfo('请添加货品')
      return
    }
    let infoStr = JSON.stringify(info)
    let data={
      orderId: orderInfo.orderId,
      producerId: orderInfo.producerId,
      openTime: orderInfo.openTime,
      goodsInfo: infoStr
    }
    this.addSubmitOrder(data)
  },
  //保存订单apiStock/stock/order/new
  addSaveOrder(data) {
    console.log(data)
    wx.showLoading({
      title: '保存中...',
    })
    let url = app.globalData.baseUrl + 'apiStock/stock/order/new'
    util.postRequestList(url, data, false, this.addSaveOrderRes)
  },
  addSaveOrderRes(res, type) {
    if (res.data.code === '200') {
      wx.showToast({
        title: '保存成功',
        duration: 2000,
        mask: true,
        success() {
          wx.redirectTo({
            url: '/pages/mall/handle-order/order-manager/manager',
          })
        },
      })
    }
  },
  //新增采购订单///stock/order/submit
  addSubmitOrder(data){
    console.log(data)
    wx.showLoading({
      title: '提交中...',
    })
    let url = app.globalData.baseUrl + 'apiStock/stock/order/submit'
    util.postRequestList(url, data, false, this.addSubminOrderRes)
  },
  addSubminOrderRes(res,type){
    wx.hideLoading()
    if(res.data.code==='200'){
      wx.showToast({
        title: '提交成功',
        duration:2000,
        mask:true,
        success(){
          wx.redirectTo({
            url: '/pages/mall/handle-order/order-manager/manager',
          })
        },
      })
    }
  },
  //
  //获取我的供应商
  getMySupplier(type){
    let url = app.globalData.baseUrl +'apiStock/stock/order/myProducer'
    util.getRequestList(url, type, this.getMySupplierRes)
  },
  getMySupplierRes(res,type){
    if(res.data.code==='200'){
      let supplierList = res.data.content
      this.setData({ supplierList })
      if(type==='edit'||type==='fromImport'){
        let producerId = this.data.orderInfo.producerId
        let supplierIndex=0
        supplierList.forEach((item,index)=>{
          if (item.keyId === producerId){
            supplierIndex=index
          }
        })
        this.setData({ supplierIndex})
      }
      console.log(res)
    }
  },
  //获取订单详情//stock/order/detail
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
      this.getMySupplier(type)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let actType = options.actType
    // let actType='edit'
    if(actType==='add'){
      let curDate = util.formatDate(new Date().getTime())
      let orderDate = curDate.replace(/\//g, '-')
      let userInfo = wx.getStorageSync('localToken').userInfo
      let userName = userInfo.name
      let orderInfo = this.data.orderInfo
      orderInfo.openTime = new Date().getTime()
      this.setData({ orderDate, userName, orderInfo})
      console.log(orderDate)
      this.getMySupplier(actType)
    }
    if(actType==='edit'){
      let orderId=options.orderId
      // let orderId=9
      this.getOrderDetail(orderId)
    }
    if(actType==='fromImport'){
      let userInfo = wx.getStorageSync('localToken').userInfo
      let userName = userInfo.name
      let slStr=options.slStr
      let slInfo=JSON.parse(slStr)
      let orderInfo=this.data.orderInfo
      orderInfo.producerId=slInfo[0].producerId
      let selSupName = slInfo[0].producerName
      let pl=[]
      slInfo.forEach(item=>{
        let dtl=JSON.parse(item.detailList)
        dtl.forEach(val=>{
          val.isNew='0'
          val.cusAgain='1'
          val.perMoney=util.getMoney(val.perMoney)
          pl.push(val)
        })
      })
      this.setData({
        proList:pl,
        selSupName,
        userName,
        orderInfo
      })
      this.getMySupplier(actType)
    }
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