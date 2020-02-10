// pages/receipt/vege/default-list/list.js
var util = require('../../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterData:{
      tmpId:'',
      pageNum:1,
      pageSize:10
    },
    hasNextPage:true,
    foodList: [],
  },
  //previewDtl预览详情
  previewDtl(e){
    let index=parseInt(e.currentTarget.dataset.index) 
    let fl=this.data.foodList
    let id=fl[index].keyId
    wx.navigateTo({
      url: '/pages/mall/pro-add/pro-tpls-dtl/dtl?id=' + id
    })
  },
  //加载更多
  bindReachBottom(){
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.setData({filterData})
      this.getFoodList(filterData,'reachBottom')
    }
  },
  //获取系统默认货品/store/default/goods
  getFoodList(data,type) {
    wx.showLoading({
      title: '获取中...',
    })
    let url = app.globalData.baseUrl + 'apiMall/store/default/goods?t=' + times
    util.getRequestListData(url, data, type, this.foodListRes)
  },
  foodListRes(res,type) {
    wx.hideLoading()
    if(res.data.code==='200'){
      let list = res.data.content.list
      let hasNextPage=res.data.content.hasNextPage
      if(type==='refresh'){
        this.setData({foodList:list})
      }
      if(type==='reachBottom'){
        let fl=this.data.foodList
        list.forEach(item=>{
          fl.push(item)
        })
        this.setData({foodList:fl})
      }
      this.setData({hasNextPage})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let tplId=options.id
    let filterData=this.data.filterData
    filterData.tmpId=tplId
    this.getFoodList(filterData,'refresh')
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