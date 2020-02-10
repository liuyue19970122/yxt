// pages/mall/handle-order/buyer-add/add.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
// Notify({ type: 'danger', message: proInfoRules[key].msg });
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierInfo:{
      name:'', 
      linkName:'', 
      mobile:'', 
      address:''
    },
    supplierRules:{
      name:{required:true,msg:'请输入供货商名称'}, 
      linkName:{required:true,msg:'请输入联系人'}, 
      mobile:{required:true,msg:'请输入手机号码'}, 
      address:{required:false,msg:'请输入地址'}
    }
  },
  //供应商名称赋值
  bindNameInput(e){
    this.setData({
      ['supplierInfo.name']:e.detail.value
    })
  },
  //联系人赋值
  bindLinkNameInput(e) {
    this.setData({
      ['supplierInfo.linkName']: e.detail.value
    })
  },
  //联系电话赋值
  bindMobileInput(e) {
    this.setData({
      ['supplierInfo.mobile']: e.detail.value
    })
  },
  //地址赋值
  bindAddressInput(e) {
    this.setData({
      ['supplierInfo.address']: e.detail.value
    })
  },
  //信息提示功能
  warnInfo(msg){
    Notify({ type: 'warning', message: msg });
  },
  //电话号码验证
  verifyMobile(val){
    let mobileReg = /^1[3456789]\d{9}$/
    return mobileReg.test(val)
  },
  //添加供货商
  addSubmit(){
    let info=this.data.supplierInfo
    let rules=this.data.supplierRules
    for(let key in info){
      if(key==='mobile'){
        if (rules[key].required &&!info[key]) {
          this.warnInfo(rules[key].msg)
          return;
        }
        console.log(!this.verifyMobile(info[key]))
        if (rules[key].required && info[key]&&!this.verifyMobile(info[key])){
          this.warnInfo('输入手机号码格式有误')
          return
        }
      }else{
        if (rules[key].required && !info[key]) {
          this.warnInfo(rules[key].msg)
          return;
        }
      }
    }
    this.addSupplierRequest(info)
  },
  //添加供货商/store/inst/addConsumer
  //name,linkName,mobile,address
  addSupplierRequest(data){
    let url = app.globalData.baseUrl +'apiMall/store/inst/addConsumer'
    util.postRequestList(url,data,false,this.addSupplierRes)
  },
  addSupplierRes(res,type){
    if(res.data.code==='200'){
      let resObj=res.data.content
      let prevPage = util.getPrevPage()
      let supplierList = prevPage.data.supplierList
      supplierList.unshift(resObj)
      prevPage.setData({supplierList})
      wx.navigateBack({
        delta:1
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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