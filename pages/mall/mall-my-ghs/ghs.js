// pages/mall/mall-my-ghs/ghs.js
let util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    storeList:[],
    editShow:false,
  },
  //获取我的供货商
  ///org/mySupply
  getMyGhs(){
    let url = app.globalData.baseUrl + 'apiUser/org/mySupply'
    util.getRequestList(url, false, this.getMyGhsRes)
  },
  getMyGhsRes(res,type){
    if(res.data.code==='200'){
      let storeList=res.data.content
      storeList.forEach(item=>{
        if(item.orgLogo!=='null'&&!item.orgLogo){
          item.orgLogo='/utils/img/default_logo.png'
        }
      })
      this.setData({ storeList})
    }
    console.log(res)
  },
  
  
  //点击标签
  catchTag(e) {
    this.setData({
      editShow:true
    })
  },
  //关闭弹窗
  bindClose(e) {
    this.setData({
      editShow: false
    })
  },
  //查看供货商店铺
  seeOrgDetail(e){
    let index =parseInt(e.currentTarget.dataset.index)
    let info=this.data.storeList[index]
    //console.log(info)
    let storeInfo={
      orgId: info.orgId,
      orgName: info.orgName,
      collectId: info.collectId,
      isCollect: info.isCollect
    }
    let si=JSON.stringify(storeInfo)
    wx.navigateTo({
      url: '/pages/mall/mall-buy/buy?storeInfo=' + si
    })
  },
  //收藏添加标签
  bindAddTag(e) {
    let index = this.data.collectIndex
    let list = this.data.storeList
    let info = JSON.stringify(list[index])
    this.setData({remarkFocus:true})
    this.bindClose()
  },
  //删除收藏
  bindDelCollect(e) {
      let index = this.data.addressIndex
      let list = this.data.addressList
      let addressId = list[index].keyId
      let url = app.globalData.baseUrl + 'apiMall/address/setDefault'
      util.getRequestListData(url, { addressId }, false, this.defaultAddressRes)
      //getRequestListData = function (url, data,actType, callBack)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyGhs()
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