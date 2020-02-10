// pages/mall/order-manager/order-manager.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type:'-1',
    orderList:[],
    tabList:[
      {
        id: -1,
        title: '全部'
      },
      {
        id:1,
        title:'新订单'
      }, {
        id: 6,
        title: '派送中'
      }, 
      {
        id: 2,
        title: '已送达'
      },
      {
        id: 9,
        title: '已结清'
      }, 
      {
        id: 3,
        title: '退款/售后'
      },
    ],
    filterData:{
      status:-1,
      pageNum:1,
      pageSize:10,
    },
    hasNextPage:true,
    hasContent:true
  },
  //tab菜单功能
  changeTab(e){
    let type = e.detail.type
    let filterData=this.data.filterData
    filterData.status=type
    filterData.pageNum=1
    this.setData({ type,filterData})
    this.getOrderList(filterData,'refresh')
  },
  //查看详情
  goDetail(e){
    var status = e.currentTarget.dataset.status
    var deliver = e.currentTarget.dataset.deliver
    var orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../ghs-detail/detail?status='+status+"&deliver="+deliver+"&orderId="+orderId,
    })
  },
  //获取供货商订单列表
  getOrderList(data,type){
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.globalData.baseUrl +'apiMall/order/admin/list'
    util.getRequestListData(url,data,type,this.listRes)
  },
  listRes(res,type){
    //待处理#fe2200//派送中#f5a62a//已完成#77c481//已退款#666666
    //状态(1未处理，2已完成，3售后，6送货中,全部不传或-1)
    wx.hideLoading()
    if(res.data.code==='200'){
      var list = res.data.content.list
      let hasNextPage = res.data.content.hasNextPage
      let hasContent = list.length ? true : false
      this.setData({ hasNextPage, hasContent})
      for (var item of list) {
        item.crtTime = util.formatTime(item.crtTime)
        item.goodsInfo = JSON.parse(item.goodsInfo)
        item.orderMoney = util.getMoney(item.orderMoney)
        if(!item.orgLogo||item.orgLogo==='null'){
          item.orgLogo='/utils/img/default_logo.png'
        }
        if (item.status === 1 && item.deliveryStatus===-1) {
          //status1未处理//deliveryStatus -1未配送
          item.bgColor = '#fe2200'
          item.statusText = '待处理'
        }
        if (item.deliveryStatus === 0){
          item.bgColor = '#fe2200'
          item.statusText = '待处理'
          //status 1未处理 2已完成//deliveryStatus 0配送中
         
        }
        if ( item.deliveryStatus === 1) {
          //status 1未处理 2已完成//deliveryStatus 1已配送
          item.bgColor = item.status === 1 ? '#fe2200' : '#77c481'
          if(item.isBySelf==='0'){
            item.statusText = item.status === 1 ? '未收货' : '已收货'
          }
          if(item.isBySelf==='1'){
            item.statusText = item.status === 1 ? '待自提' : '已自提'
          }
        }
        if (item.status === 3) {//3售后
          item.bgColor = '#77c481'
          item.statusText = '已完成'
        }
        if (item.status === 9) {//9已结清
          item.bgColor = '#f5a62a'
          item.statusText = '已结清'
        }
      }
      if (type === 'refresh') {
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
  onLoad: function (options) {
    let filterData = this.data.filterData
    let status=options.status
    if(status){
      filterData.status=status
      this.setData({type:status})
    }
    this.setData({filterData})
    this.getOrderList(filterData, 'refresh')
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
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.setData({filterData})
      this.getOrderList(filterData,'reachBottom')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})