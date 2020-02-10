// pages/mall/order-detail/order-detail.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
// Notify({ type: 'danger', message: proInfoRules[key].msg });
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList:[],
    address:{},
    hasAddress:true,
    favMoney:0,
    totalMoney:0,
    orderMoney:0,
    isChoiceAdress:false,
    scorllTop:0,
    orderType:'online'
  },
  //生成时间表
  //start/开始时间, end/结束时间, iterval/间隔分钟, fee/运费
  timeBuilder(start,end,interval,fee){
    console.log(start)
    let st=0,stm=0
    let et=0,etm=0
    if(start.indexOf(':')!=-1){
      let sta = start.split(':')
      st = parseInt(sta[0])
      if (sta[1][0]==='0'){
        stm=parseInt(sta[1][1])
      }else{
        stm = parseInt(sta[1])
        console.log(stm)
      }
    }else{
      st = parseInt(start)
    }
    if (end.indexOf(':') != -1) {
      let eta = end.split(':')
      et = parseInt(eta[0])
      if (eta[1][0] === '0') {
        etm = parseInt(eta[1][1])
      } else {
        etm = parseInt(eta[1])
      }
    }else{
      et=parseInt(end)
    }
    let totalM = (et - st) * 60 - stm + etm
    let len = Math.floor(totalM/interval)
    console.log(totalM, len)
    let startTime = start.indexOf(':') === -1 ? start + ':00' : start
    let objS = { time: startTime, fee: fee, checked: false}
    let timeArr=[]
    timeArr.push(objS)
    let count=stm
    console.log(stm)
    for(let i=0;i<len;i++){
      //console.log()
      count=count+interval
      let ys=count/60
      let ss=st
      let mm=count%60
      if(mm<10){
        mm='0'+mm
      }
      if (ys>=1){
        let ysf = Math.floor(ys)
        //console.log(ysf)
        ss = st + ysf
      }
      let time=ss+":"+mm
      let obj = { time: time, fee: fee, checked: false }
      timeArr.push(obj)
      //console.log(obj)
    }
    return timeArr
  },
  //去地址界面选择地址
  toAddressPage(){
    wx.navigateTo({
      url: '/pages/purchase/address-manager/address-manager?pageInStyle=fromOrder',
    })
  },
  //选择时间
  choosePop(){
    this.setData({
      chooseTimePop:true
    })
  },
  onClose(){
    this.setData({
      chooseTimePop: false
    })
  },
  //商品产品隐藏显示
  bindStoreOpen(e){
    let index = parseInt(e.currentTarget.dataset.index)
    let proBuyList = this.data.proBuyList
    proBuyList[index].isShow = !proBuyList[index].isShow
    this.setData({
      proBuyList
    })
  },
  //当天当时生成时间选择器数据
  todayBuilderData(){
    let date = new Date();
    let st = date.getHours()
    let mt = date.getMinutes()
    if(st<6){
      mt>30?st='7:30':'7'
    }
    let stStr = mt > 30 ? (st + 1) + ':30' : st + ':30'
    let chooseTimeArr = this.timeBuilder(stStr,'21',30,0)
    chooseTimeArr[0].checked=true
    this.setData({ chooseTimeArr})
  },
  otherDayBuilderData(){
    let chooseTimeArr = this.timeBuilder('7', '21', 30, 0)
    chooseTimeArr[0].checked = true
    this.setData({ chooseTimeArr })
  },
  formatDateDay(n,time){
    const formatNumber = function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    let date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    let deliverTime = this.data.dayList[0] + this.data.chooseTimeArr[0]
    let deliverTimeStr = [year, month, day].map(formatNumber).join('/')+' '+time
    return deliverTimeStr
  },
  //bindSelDay
  bindSelDay(e){
    let dayType=e.currentTarget.dataset.type
    let scrollTop=0
    this.setData({ dayType, scrollTop})
    let deliverTime = ''
    let deliverTimeStr=''
    if(dayType==='jt'){
      this.todayBuilderData()
    }else{
      this.otherDayBuilderData()
    }
    if (dayType === 'jt'){
      deliverTime = this.formatDateDay(0, this.data.chooseTimeArr[0].time)
      deliverTimeStr = this.data.dayList[0].name + this.data.chooseTimeArr[0].time
    }
    if (dayType === 'mt') { 
      deliverTime = this.formatDateDay(1, this.data.chooseTimeArr[0].time)
      deliverTimeStr = this.data.dayList[1].name + this.data.chooseTimeArr[0].time
    }
    if (dayType==='ht'){
      deliverTime = this.formatDateDay(2, this.data.chooseTimeArr[0].time)
      deliverTimeStr = this.data.dayList[2].name + this.data.chooseTimeArr[0].time
    }
    this.setData({ deliverTime, deliverTimeStr })
  },
  //bindSelTime
  bindSelTime(e){
    let deliverTime = ''
    let deliverTimeStr = ''
    let top = e.currentTarget.offsetTop-80
    let scrollTop=top>0?top:0
    let index = parseInt(e.currentTarget.dataset.index)
    let chooseTimeArr=this.data.chooseTimeArr
    let dayType = this.data.dayType
    chooseTimeArr.forEach(item=>{
      item.checked=false
    })
    chooseTimeArr[index].checked=true
    if (dayType === 'jt') {
      deliverTime = this.formatDateDay(0, this.data.chooseTimeArr[index].time)
      deliverTimeStr = this.data.dayList[0].name + this.data.chooseTimeArr[index].time
    }
    if (dayType === 'mt') {
      deliverTime = this.formatDateDay(1, this.data.chooseTimeArr[index].time)
      deliverTimeStr = this.data.dayList[1].name + this.data.chooseTimeArr[index].time
    }
    if (dayType === 'ht') {
      deliverTime = this.formatDateDay(2, this.data.chooseTimeArr[index].time)
      deliverTimeStr = this.data.dayList[2].name + this.data.chooseTimeArr[index].time
    }
    this.setData({ chooseTimeArr, scrollTop, deliverTime, deliverTimeStr })
    this.onClose()
  },
  //提交订单///order/inst/add
  //addressId,deliverTime,
  //buyDetail:[{goodsId,attrId,buyCount,orgId}]
  onSubmitOrder(){
    console.log(this.data.address.keyId)
    let addressId= this.data.address.keyId
    console.log(!addressId)
    if (!addressId || addressId === 'undefined'){
      Notify({ type: 'danger', message:'请选择地址'});
      return;
    }
    let time = this.data.deliverTime
    let deliverTime = Date.parse(new Date(time))
    let data={
      addressId:this.data.address.keyId, 
      deliverTime: deliverTime,
      buyDetail:[]
    }
    let list = this.data.proBuyList
    let arr=[]
    for(let i=0;i<list.length;i++){
      for (let j = 0; j < list[i].proList.length; j++){
        let obj = { goodsId:'', attrId:'', buyCount:'', orgId:''}
        obj.goodsId = list[i].proList[j].goodsId
        obj.attrId = list[i].proList[j].attrId
        obj.buyCount = list[i].proList[j].cusBuyCount
        obj.orgId = list[i].proList[j].orgId
        arr.push(obj)
      }
    }
    data.buyDetail=JSON.stringify(arr)
    let url = app.globalData.baseUrl + 'apiMall/order/inst/add'
    util.postRequestList(url, data, false, this.addOrderRes)
    // postRequestList = function (url, data, actType, callBack)
  },
  addOrderRes(res,actType){
    if(res.data.code==='200'){
      let list=res.data.content
      let arr = []
      let payMoney=0
      list.forEach(item=>{
        let pay = parseInt(item.orderMoney)
        arr.push(item.keyId)
        payMoney += pay
      })
      let orderIds = JSON.stringify(arr)
      let payMoneyStr = util.getMoney(payMoney).toString()
      wx.navigateTo({
        url: '/pages/mall/mall-pay/pay?orderIds=' + orderIds + '&payMoney=' + payMoneyStr
      })
    }
    console.log(res)
  },
  //获取地址列表
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    var url = app.globalData.baseUrl + 'apiMall/address/list'
    util.getRequestList(url, false, this.listRes)
  },
  listRes(res,actType) {
    wx.hideLoading()

    if(res.data.code==='200'){
      let list = res.data.content
      console.log(list.length)
      if(list.length){
        let defAdd = {}
        let hasAddress=false
        for (let i = 0; i < list.length; i++) {
          if (list[i].isDefault) {
            defAdd = list[i]
            this.setData({
              address: defAdd,
            })
            hasAddress=true
            break
          }
        }
        this.setData({
          hasAddress: hasAddress
        })
        console.log(hasAddress)
      }else{
        this.setData({hasAddress:false})
      }
    }
  },
  //获取购物车数据///shopcar/list
  getCartProList() {
    let url = app.globalData.baseUrl + 'apiMall/shopcar/list'
    util.getRequestList(url, false, this.getCartProListRes)
  },
  getCartProListRes(res, type) {
    if (res.data.code === '200') {
      let cpl = res.data.content
      let orgArr = []
      let npArr = []
      let totalMoney = 0
      let orderMoney = 0
      for (let i = 0; i < cpl.length; i++) {
        cpl[i].cusChecked = cpl[i].chooseFlag == "1" ? true : false
        cpl[i].cusBuyCount = cpl[i].buyCount
        cpl[i].cusSalePrice = util.getMoney(cpl[i].attrPrice).toString()
        cpl[i].cusOriPrice = util.getMoney(cpl[i].attrNormalPrice).toString()
        if (cpl[i].chooseFlag==='1') {
          totalMoney += cpl[i].attrNormalPrice * cpl[i].buyCount
          orderMoney += cpl[i].attrPrice * cpl[i].buyCount
          orgArr.push(cpl[i].orgId)
          npArr.push(cpl[i])
        }
      }
      let favMoney = totalMoney - orderMoney
      favMoney = util.getMoney(favMoney)
      totalMoney = util.getMoney(totalMoney)
      function unique(arr) {
        return Array.from(new Set(arr))
      }
      let ua = unique(orgArr)
      //订单商品数据组装
      let npcl = []
      for (let i = 0; i < ua.length; i++) {
        let obj = {
          isShow: false,
          orgName: '',
          orgId: ua[i],
          proList: []
        }
        for (let j = 0; j < npArr.length; j++) {
          if (ua[i] === npArr[j].orgId) {
            obj.orgName = npArr[j].orgName
            obj.proList.push(npArr[j])
          }
        }
        npcl.push(obj)
      }
      console.log(npcl)
      this.setData({
        proBuyList: npcl,
        favMoney: favMoney,
        totalMoney: totalMoney,
        orderMoney: orderMoney
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orderInfo=JSON.parse(options.orderInfo) 
    this.setData({
      proList:orderInfo
    })
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
    if(!this.data.isChoiceAdress){
      this.getAddressList()
    }
    this.getCartProList()
    // console.log(this.data.address)
    //获取购物车数据详情
    //商品数据
    // let cartList = wx.getStorageSync('cartProList')
    // let cpl = JSON.parse(cartList)
    
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