// pages/mall/handle-order/pro-search/search.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proList:[
      { name: 'xxx水果', price: '20.00', count: '40斤' },
      { name: 'xxx水果', price: '20.00', count: '40斤' },
      { name: 'xxx水果', price: '20.00', count: '40斤' }
    ]
  },
  //获取仓库某类产品列表///stock/inst/list
  getStorageProList() {
    let data={
      cateId:'-1',
      locationId:'',//
      //仓库ID
      goodsName:'',
      //产品名称
      warnFlag:'0',
      //1是0否只显示告警
      pageNum:1,
      pageSize:9999
    }
    wx.showLoading({
      title: '加载中...',
    })
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/list'
    util.getRequestListData(url, data, false, this.storageProListRes)
    
  },
  storageProListRes(res, actType) {
    wx.hideLoading()
    if (res.data.code === '200') {
      let list = res.data.content.list
      list.forEach(item=>{
        
      })
    //   proInfo: {
    //     isNew: '1',
    //       cateId: '',
    //         stockId: '',
    //           locationId: '',
    //             stockName: '',
    //               perMoney: '',
    //                 stockUnit: '',
    //                   count: '',
    // },
      console.log(list)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStorageProList()
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