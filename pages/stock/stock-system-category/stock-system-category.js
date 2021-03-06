// pages/stock/stock-category/stock-category.js
var util = require('../../../utils/util.js');
const app = getApp()
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],
    activeId: 0,
    isSubmit:false,
    pageInType:'',
    methodKey:''
  },
  clickItem: function (e) {
    var id = e.currentTarget.dataset.id
    var cateList=this.data.cateList
    for(var item of cateList){
      for(var jtem of item.nextList){
        if (id == jtem.keyId) {
          jtem.isSelect = !jtem.isSelect
        }
      }
    }
    this.setData({
      cateList: cateList
    })
  },
  closeActive: function () {
    this.setData({
      activeId: 0
    })
  },
  cateListRes(res) {
    var list = res.data.content
    var that = this
    for (var item of list) {
      item.nextList = JSON.parse(item.nextList)
      for(var jtem of item.nextList){
        jtem.isSelect = false
        // if(jtem.status==1){
        //   jtem.isSelect = true
        // }
        // if(id==jtem.keyId){
        // }
      }
    }
    this.setData({
      cateList: list
    })
  },
  submitCate(){
    if(this.data.isSubmit){
      return false
    }
    this.setData({
      isSubmit:true
    })
    var url = app.globalData.baseUrl +'apiStock/stock/cate/initStockCate'
    var list=this.data.cateList
    var cateList=[]
    var arr=[]
    for(var item of list){
      var i=1
      for(var jtem of item.nextList){
        if(jtem.isSelect&&jtem.status!=1){
          i++
          if(i==2&&item.status!=1){
            cateList.push(item.keyId)
          }
          cateList.push(jtem.keyId)
        }
      }
    }
    if(cateList.length==0){
      wx.showToast({
        title: '请先选择分类',
      })
      return false
    }
    var data={
      cateIds:cateList
    }
    util.postRequestList(url,data,false,this.submitRes)
  },
  submitRes(res){
    if(res.data.code==200){
      if(this.data.pageInType==='proAdd'){
        let methodKey=this.data.methodKey
        let prevPage=util.getPrevPage()
        prevPage[methodKey]()
      }
      wx.showToast({
        title: '设置成功',
        success:function(){
          wx.navigateBack({
            dalta: 1
          })
        }
      })
    }else{
      wx.showToast({
        title: res.data.message,
        icon:'none'
      })
    }
    this.setData({
      isSubmit:true
    })
  },
  getSystemCate: function () {
    var url = app.globalData.baseUrl + 'apiStock/default/cate/list'
    util.getRequestList(url, false, this.cateListRes)
  },
  addFn: function () {
    wx.navigateTo({
      url: '/pages/stock/add-category/add-category',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageInType=options.pageInType
    let methodKey=options.methodKey
    if(methodKey&&methodKey!='undefined'){
      this.setData({methodKey})
    }
    this.setData({pageInType})
    this.getSystemCate()
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