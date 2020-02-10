// pages/mall/handle-order/order-add/add.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierList:[],
    supplierIndex:0,
    pageInStyle:'formIndex'
  },

  //添加商家
  handleAddBuyer(){
    wx.navigateTo({
      url: '/pages/mall/handle-order/buyer-add/add?actType=add',
    })
  },
  //选择商家信息
  handleChoice(e){
    let index = parseInt(e.currentTarget.dataset.index)
    let supplierList=this.data.supplierList
    let proObj = supplierList[index]
    if(this.data.pageInStyle==='fromOrder'){
      let prevPage=util.getPrevPage()
      prevPage.setData({
        buyerInfo:proObj,
        hasInfo:true
      })
      wx.navigateBack({delta:1})
    }
    // wx.navigateTo({
    //   url: '/pages/mall/handle-order/buyer-add/add?actType=edit&proInfo=' + proInfoStr + '&index=' + index,
    // })
  },
  //获取我的采购商//store/inst/myConsumer
  getMySupplier(type){
    let url = app.globalData.baseUrl +'apiMall/store/inst/myConsumer'
    util.getRequestList(url, type, this.getMySupplierRes)
  },
  getMySupplierRes(res,type){
    if(res.data.code==='200'){
      let supplierList = res.data.content
      this.setData({ supplierList })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let actType='add'
    let pageInStyle=options.pageInStyle
    if(pageInStyle&&pageInStyle!=='undefined'){
      this.setData({pageInStyle})
    }
    this.getMySupplier(actType)
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