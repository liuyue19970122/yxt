// pages/finance/rem-account/detail/detail.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],
    billInfo:{}
  },
  //图片预览
  handlePreview(e){
    let index=e.currentTarget.dataset.index
    let imgList=this.data.imgList
    let curUrl=imgList[index]
    wx.previewImage({
      current: curUrl, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //记账详情/bookbill/detail
  getBillDtl(id){
    let url = app.globalData.baseUrl +'apiMall/bookbill/detail'
    util.getRequestListData(url,{keyId:id},false,this.billDtlRes)
  },
  billDtlRes(res,type){
    if(res.data.code==='200'){
      console.log(res)
      let info=res.data.content
      info.cusBillTime=util.formatDate(info.billTime)
      info.cusMoney=util.getMoney(info.money).toString()
      let imgList=JSON.parse(info.linkImg)
      console.log(imgList)
      this.setData({billInfo:info,imgList})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id
    this.getBillDtl(id)
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