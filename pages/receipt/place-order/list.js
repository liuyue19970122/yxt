// pages/receipt/place-order/list.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList: [],
    totalMoney: '',
    totalCount: '',
    tableId: [],
    tableName:'',
    orderId: -1,
    peopleCount: '',
    remark: '',
    isSubmit:false
  },
  goChoose: function() {
    wx.navigateTo({
      url: '/pages/receipt/table-list/list?type=reChoose',
    })
  },
  getPeopleCount(e) {
    this.setData({
      peopleCount: e.detail
    })
  },
  getRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  goPay() {
    if(this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    if (this.data.orderId == -1) {
      var url = app.globalData.baseUrl + 'apiMall/food/order/add'
      var list = this.data.foodList.map((item) => {
        var jtem = {}
        jtem.foodId = item.foodId
        jtem.attrId = item.attrId
        jtem.count = item.count
        return jtem
      })
      var data = {
        orderDetail: JSON.stringify(list),
        desktopIds: this.data.tableId.length == 0 ? [] : this.data.tableId,
        peopleCount: this.data.peopleCount,
        remark: this.data.remark
      }
      util.postRequestList(url, data, false, this.payRes)
    } else {
      var url = app.globalData.baseUrl + 'apiMall/food/order/reAdd'
      var list = this.data.foodList.map((item) => {
        var jtem = {}
        jtem.foodId = item.foodId
        jtem.attrId = item.attrId
        jtem.count = item.count
        return jtem
      })
      var data = {
        orderId: this.data.orderId,
        orderDetail: JSON.stringify(list),
        // desktopIds: this.data.tableId.length == 0 ? [] : this.data.tableId,
        // peopleCount: this.data.peopleCount,
        remark: this.data.remark
      }
      util.postRequestList(url, data, false, this.reAddRes)
    }
  },
  reAddRes(res){
    if (res.data.code == 200) {
      wx.redirectTo({
        url: '/pages/receipt/submit-order/submit?orderId='+ this.data.orderId,
      })
    } else {
      wx.showToast({
        title: res.data.messge,
      })
    }
    this.setData({
      isSubmit:false
    })
  },
  payRes(res) {
    if (res.data.code == 200) {
      wx.redirectTo({
        url: '/pages/receipt/submit-order/submit?orderId=' + res.data.content.orderInfo.keyId,
      })
    } else {
      wx.showToast({
        title: res.data.messge,
      })
    // }
    }
    this.setData({
      isSubmit:false
    })
  },
  //购物车内商品操作
  bindCartAdd(e) {
    let index = parseInt(e.target.dataset.index)
    let cpl = this.data.foodList
    let count = cpl[index].count
    cpl[index].count = count + 1
    this.changeCartData(cpl)
    this.setData({
      foodList: cpl
    })
  },
  bindCartReduce(e) {
    let index = parseInt(e.target.dataset.index)
    let cpl = this.data.foodList
    let count = cpl[index].count
    if (count === 1) {
      cpl.splice(index, 1)
    } else {
      cpl[index].count = count - 1
    }
    this.changeCartData(cpl)
    this.setData({
      foodList: cpl
    })
  },
  //购物车数据更改
  changeCartData(cartProList) {
    let cpl = cartProList.length
    if (cpl) {
      let totalCount = 0
      let totalMoney = 0
      let buyFavMoney = 0
      let oriPrice = 0
      cartProList.forEach((item, index) => {
        totalCount += item.count
        totalMoney += item.sellPrice * item.count
      })
      buyFavMoney = oriPrice - totalMoney
      totalMoney = util.getMoney(totalMoney).toString()
      buyFavMoney = util.getMoney(buyFavMoney).toString()
      let hideCartImg = this.data.showCart ? false : true
      this.setData({
        totalCount,
        buyFavMoney,
        totalMoney,
        hideCartImg,
        cartEmpty: false
      })
    } else {
      this.setData({
        cartEmpty: true,
        hideCartImg: true,
        showCart: false
      })
    }
    let cplStr = JSON.stringify(cartProList)
    wx.setStorage({
      key: 'cartProList',
      data: cplStr,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var prevPage = util.getPrevPage()
    this.setData({
      foodList: prevPage.data.cartProList,
      totalMoney: prevPage.data.buyTotalMoney,
      totalCount: prevPage.data.buyTotalCount,
    })
    var tableId = this.data.tableId
    if (options.tableId&&options.tableId.length>0) {
      var list=JSON.parse(options.tableId)
      this.setData({
        tableId: list,
        tableName:options.tableName
      })
    }
    if (options.orderId&&options.orderId>1) {
      this.setData({
        orderId: options.orderId
      })
    }
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
    this.setData({
      isSubmit: false
    })
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