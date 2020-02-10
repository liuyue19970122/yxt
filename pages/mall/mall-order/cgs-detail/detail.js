// pages/mall/order-detail/order-detail.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readonShow: false,
    orderShow: false,
    status: '',
    orderId: '',
    chooseTimePop:false,
    orderDetail:{},
    total:0,
    totalB:0
  },
  getOrderDetail() {
    var url = app.globalData.baseUrl + 'apiMall/order/inst/detail'
    var data = {
      orderId: this.data.orderId
    }
    util.getRequestListData(url, data, false, this.detailRes)
  },
  detailRes(res) {
    if (res.data.code == 200) {
      var list = res.data.content
      var totalB=0
      for (var item of list.goodsList) {
        totalB += item.orderMoney
        // total += item.orderMoney
        item.orderMoney = util.getMoney(item.orderMoney)
        // console.log(typeof(item.orderMoney))
      }
      let rt=list.requireTime
      let rm=list.remark
      if(rt&&rt!='null'){
        list.requireTime=util.formatTime(Number(rt))
      }else{
        list.requireTime='无配送时间'
      }
      if(!rm&&rm=='null'){
        list.remark='无'
      }
      this.setData({
        orderDetail: list,
        total: util.getMoney(totalB),
        status: list.status,
        totalB:totalB,
        deliver: list.deliveryStatus
      })
      var status = list.status
      var deliver = list.deliveryStatus
      if (status == 0) {
        wx.setNavigationBarTitle({
          title: '待支付'
        })
      } else if (status == 1&&deliver==-1) {
        wx.setNavigationBarTitle({
          title: '待发货'
        })
      } else if (status == 1 && deliver != -1) {
        wx.setNavigationBarTitle({
          title: '待收货'
        })
      } else if (status == 2) {
        wx.setNavigationBarTitle({
          title: '已完成'
        })
      } else if (status == 3) {
        wx.setNavigationBarTitle({
          title: '售后中'
        })
      } else {
        wx.setNavigationBarTitle({
          title: '售后完成'
        })
      }
    }
  },
  goCall(e) {
    let _this = this
    let mobile=e.currentTarget.dataset.mobile
    wx.makePhoneCall({
      phoneNumber: mobile,
      success: function (res) {
      },
      fail(resp) {
        wx.showModal({
          title: '提示',
          content: resp.message,
          showCancel: false
        })
        console.log(resp)
      }
    })
  },
  //handleCancelOrder取消订单
  handleCancelOrder(e){
    let _this=this
    let orderId = this.data.orderId
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
      wx.showToast({
        title:'取消成功',
        duration:2000
      })
      wx.navigateBack({delta:1})
    }
  },
  goAddress() {
    wx.navigateTo({
      url: '/pages/common/address-review/address-review?orderId=' + this.data.orderId+'&pageInType=fromCgs',
    })
  },
  //againBuy 再来一单
  againBuy(){
    let infoStr=JSON.stringify(this.data.orderDetail)
    let infoStr1=infoStr.replace(/\?/g,'*')
    let infoStr2=infoStr1.replace(/\=/g,'#')
    let infoStr3=infoStr2.replace(/\&/g,'$')
    let totalMoney=this.data.total
    console.log(infoStr)
    wx.navigateTo({
      url: '/pages/mall/mall-suborder/order?infoStr='+infoStr3+'&pageInType=buyAgain'+'&totalMoney='+totalMoney,
    })
  },
  goRefund(){
    wx.navigateTo({
      url: '/pages/mall/mall-order/refund-order/order?orderId='+this.data.orderId,
    })
  },
  goCorrent(){
    wx.navigateTo({
      url: '/pages/stock/stock-correct/stock-correct?orderId='+this.data.orderId+'&pageInStyle=fromOrderDetail',
    })
  },
  onSubmit(){
    let list=[]
    list.push(this.data.orderId)
    // var str = JSON.stringify(list)
    // console.log(JSON.stringify(list))
    wx.navigateTo({
      url: '/pages/mall/mall-pay/pay?orderIds=' + JSON.stringify(list) +"&payMoney="+this.data.total+'&enterType=fromOrderDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        orderId:options.id
      })
      // var options=options.item
    }
    this.getOrderDetail()
  },
  choosePop(){
    this.setData({
      chooseTimePop:true
    })
  },
  showPopup() {
    this.setData({
      readonShow: true
    });
  },
  showOrder() {
    this.setData({
      orderShow: true
    });
  },
  onClose() {
    this.setData({
      readonShow: false,
      orderShow: false
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})