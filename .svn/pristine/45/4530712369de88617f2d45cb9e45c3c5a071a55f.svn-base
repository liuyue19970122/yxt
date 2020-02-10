// pages/purchase/address-manager/address-manager.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[],
    addressIndex:0,
    isDefault:false,
    editShow:false,
    pageInStyle:'fromIndex'
  },
  //选取地址
  choiceAddress(e){
    //fromOrder表示冲提交订单界面进入
    console.log(this.data.pageInStyle)
    if(this.data.pageInStyle==='fromOrder'){
      let index = parseInt(e.currentTarget.dataset.index)
      let list = this.data.addressList
      let address = list[index]
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];   //当前页面
      let prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        address: address,
        hasAddress:true,
        isChoiceAdress: true,//控制是否刷新地址
      });
      wx.navigateBack({
        delta: 1
      })
      console.log(address)
    }
  },
  //编辑打开功能区
  editAddress(e){
    console.log(e)
    let addressIndex=parseInt(e.currentTarget.dataset.index)
    let isDefault = this.data.addressList[addressIndex].isDefault
    this.setData({
      addressIndex,
      isDefault,
      editShow:true,
    })
  },
  //修改地址
  updateAddress(e){
    let index=this.data.addressIndex
    let list=this.data.addressList
    let info=JSON.stringify(list[index])
    console.log(list[index])
    wx.navigateTo({
      url: '/pages/purchase/address-detail/address-detail?info='+info+'&actType=update'
    })
    this.bindClose()
  },
  //设置为默认地址
  /// address / setDefault
  //addressId
  setDefaultAddress(e){
    if(!this.data.isDefault){
      let index = this.data.addressIndex
      let list = this.data.addressList
      let addressId = list[index].keyId
      let url = app.globalData.baseUrl + 'apiMall/address/setDefault'
      util.getRequestListData(url, { addressId }, false, this.defaultAddressRes)
    //getRequestListData = function (url, data,actType, callBack)
    }
  },
  defaultAddressRes(res,actType){
    if (res.statusCode&&res.data.code==='200'){
      this.bindClose()
      wx.showToast({
        title: '设置成功',
      })
      this.getAddressList()
    }
  },
  //删除地址/address/delete
  setDelAddress(e){
    let _this=this
    this.bindClose()
    wx.showModal({
      title: '提示',
      content: '是否删除该地址',
      success(res) {
        if (res.confirm) {
          let index = _this.data.addressIndex
          let list = _this.data.addressList
          let addressId = list[index].keyId
          let url = app.globalData.baseUrl + 'apiMall/address/delete'
          util.getRequestListData(url, { addressId }, false, _this.delAddressRes)
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delAddressRes(res,type){
    if(res.data.code==='200'){
      let index = this.data.addressIndex
      let list = this.data.addressList
      list.splice(index,1)
      this.setData({ addressList:list})
      if (list.length===0){
        let prevPage = util.getPrevPage()
        prevPage.setData({
          isChoiceAdress: false,//控制是否刷新地址
        });
      }
    }
  },
  //关闭弹窗
  bindClose(e){
    this.setData({
      editShow:false
    })
  },
  //获取地址列表
  getAddressList(){
    var url = app.globalData.baseUrl +'apiMall/address/list'
    util.getRequestList(url,false,this.listRes)
  },
  goDetail(e){
    wx.navigateTo({
      url: '../address-detail/address-detail?theAddress=' + e.currentTarget.dataset.theaddress,
    })
  },
  listRes(res){
    this.setData({
      addressList:res.data.content
    })
  },
  //新建地址
  goAdd(){
    wx.navigateTo({
      url: '../address-detail/address-detail?actType=add',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageInStyle = options.pageInStyle
    if (pageInStyle!==undefined){
      this.setData({pageInStyle})
    }
    if(this.data.pageInStyle==='fromIndex'){
      wx.setNavigationBarTitle({
        title: '地址管理',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '选择地址',
      })
    }
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
    this.getAddressList()
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