// pages/purchase/address-detail/address-detail.js
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
let util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ad_pca: '选择地址',
    adInfo:{
      provice:'',
      city:'',
      area:'',
      address:'',
      linkName:'',
      mobile:'',
      latitude:'',
      longitude:'',
      isDefault: true//设置为默认(1是)
    },
    adInfoRules: {
      address: { required: true, msg: '请输入详细地址' },
      linkName: { 
        required: true, 
        msg: '请输入联系人', 
      },
      mobile: { 
        required: true, 
        msg: '请输入联系电话',
        pattern: '/^1[3456789]\d{9}$/',
        regMsg:'输入电话格式有误' 
      },
    },
    addressId:0,
    actType:'add'
  },
  toMapAddress(e){
    let actType=this.data.actType
    if(actType==='add'){
      wx.navigateTo({
        url: '/pages/purchase/address-detail/address-map/map?actType=add',
      })
    }
    if (actType === 'update') {
      let ad_info=JSON.stringify(this.data.adInfo)
      wx.navigateTo({
        url: '/pages/purchase/address-detail/address-map/map?actType=edit&ad_info='+ad_info,
      })
    }
  },
  //默认修改
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ ['adInfo.isDefault']: detail });
  },
  //门牌号详细地址
  getDetailAddress(e) {
    this.setData({
      ['adInfo.address']: e.detail.value
    })
  },
  getTel(e){
    let mobile = util.validateNumber(e.detail)
    this.setData({
      ['adInfo.mobile']: mobile
    })
  },
  getName(e) {
    console.log(e)
    this.setData({
      ['adInfo.linkName']:e.detail
    })
  },
  //提交地址信息
  //apiMall/address/add 添加地址
  //provice,city,area,address,linkName,mobile,isDefault
  //apiMall/address/update 更新地址
  saveAddress() {
    let adInfoRules = this.data.adInfoRules
    let adInfo = this.data.adInfo
    for (let key in adInfoRules) {
      if (!adInfo[key] && adInfoRules[key].required) {
        Notify({ type: 'danger', message: adInfoRules[key].msg });
        return;
        
      }else{
        if (key==='mobile'){
          if (!(/^1[3456789]\d{9}$/.test(adInfo[key]))){
            Notify({ type: 'danger', message: adInfoRules[key].regMsg });
            return;
          }
        }
      }
    }
    let url = app.globalData.baseUrl + 'apiMall/address/add'
    let data={
      provice: adInfo.provice,
      city: adInfo.city,
      area: adInfo.area,
      address: adInfo.address,
      linkName: adInfo.linkName,
      mobile: adInfo.mobile,
      latitude: adInfo.latitude,
      longitude: adInfo.longitude,
      isDefault: adInfo.isDefault==true?1:0,
    }
    if(this.data.actType==='update'){
      data.addressId=this.data.addressId
      url = app.globalData.baseUrl + 'apiMall/address/update'
    }
    util.postRequestList(url,data,false,this.addRes)
  },
  addRes(res){
    if(res.data.code==200){
      wx.showModal({
        title: '提示',
        content: '添加成功',
        showCancel:false,
        success:function(res){
          wx.navigateBack({
            delta:1
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: res.data.message,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let actType=options.actType
    if (actType === 'update') { 
      let info=JSON.parse(options.info)
      console.log(info)
      let adInfo=this.data.adInfo
      adInfo.provice = info.provice
      adInfo.city = info.city
      adInfo.area = info.area
      adInfo.address = info.address
      adInfo.linkName = info.contactName
      adInfo.mobile = info.phone
      adInfo.latitude= info.latitude
      adInfo.longitude= info.longitude
      adInfo.isDefault = info.isDefault//设置为默认(1是)
      console.log(adInfo)
      let addressId=info.keyId
      let ad_pca = info.provice + '/' + info.city + '/' + info.area
      this.setData({ adInfo, addressId, ad_pca, actType})
      wx.setNavigationBarTitle({
        title: '修改地址',
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