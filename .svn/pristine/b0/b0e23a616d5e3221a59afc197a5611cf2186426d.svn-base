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
    buyerInfo:{},
    hasInfo:false,
    orderMoney:0,
    hasPayMoney:'',
    willPayMoney:''
  },
  //去地址界面选择地址
  toAddressPage(){
    wx.navigateTo({
      url: '/pages/mall/handle-order/buyer-list/list?pageInStyle=fromOrder',
    })
  },
  //已付金额
  bindHasPay(e){
    let value=e.detail.value
    let val=util.clearNoNum(value)
    let nval=Number(val)
    let nom=Number(util.getMoney(this.data.orderMoney))
    if(nval>nom){
      wx.showToast({
        title: '输入金额过大',
        icon:'none'
      })
      this.setData({hasPayMoney:'',willPayMoney:nom})
    }else{
      let wp=util.accSub(nom,val)
      console.log(wp)
      this.setData({hasPayMoney:val,willPayMoney:wp})
    }
    console.log(this.data.hasPayMoney)
  },
  //提交订单///order/admin/openOrder
  //consumerId
  //buyDetail:[{goodsId,attrId,buyCount}]
  onSubmitOrder(){
    let consumerId= this.data.buyerInfo.keyId
    console.log(!consumerId)
    if (!consumerId || consumerId === 'undefined'){
      Notify({ type: 'warning', message:'请选择商家'});
      return;
    }
    if (!this.data.hasPayMoney){
      Notify({ type: 'warning', message:'请输入应付金额'});
      return;
    }
    let data={
      consumerId:consumerId,
      hasPayMoney:this.data.hasPayMoney, 
      buyDetail:[]
    }
    let list = this.data.proList
    let arr=[]
    for(let i=0;i<list.length;i++){
      let obj = { goodsId:'', attrId:'', buyCount:''}
      obj.goodsId = list[i].goodsId
      obj.attrId = list[i].attrId
      obj.buyCount = list[i].cusBuyCount
      arr.push(obj)
    }
    data.buyDetail=JSON.stringify(arr)
    let url = app.globalData.baseUrl + 'apiMall/order/admin/openOrder'
    util.postRequestList(url, data, false, this.addOrderRes)
  },
  addOrderRes(res,actType){
    if(res.data.code==='200'){
      wx.showModal({
        title: '提示',
        content: '开单成功',
        showCancel: true,
        cancelText: '查看订单',
        cancelColor: '',
        confirmText: '继续开单',
        confirmColor: '',
        success: function(res) {
          if(res.confirm){
            let prevPage=util.getPrevPage()
            prevPage.resetCartData()
            wx.navigateBack({
              delta: 1,
            })
          }else if(res.cancel){
            wx.reLaunch({
              url: '/pages/mall/mall-order/ghs-manager/manager',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    console.log(res)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let proList=JSON.parse(options.orderInfo) 
    console.log(proList)
    let orderMoney=0
    proList.forEach(item=>{
      orderMoney=orderMoney+item.attrPrice*item.cusBuyCount
    })
    let willPayMoney=util.getMoney(orderMoney).toString()
    this.setData({
      proList,
      orderMoney,
      willPayMoney
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
    console.log(this.data.buyerInfo)
    // if(!this.data.isChoiceAdress){
    //   this.getAddressList()
    // }
    // this.getCartProList()
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