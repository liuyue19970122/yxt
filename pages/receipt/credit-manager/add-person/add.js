// pages/receipt/credit-manager/add-person/add.js
var util = require('../../../../utils/util.js');
const app = getApp()
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    mobile:'',
    id:''
  },
  bindUserName(e){
    this.setData({
      userName:e.detail
    })
  },
  bindMobile(e) {
    this.setData({
      mobile: e.detail
    })
  },
  bindSubmit(){
    if (this.data.userName=='') {
      Notify({
        type: 'warning',
        message: '请输入姓名'
      });
      return false
    }
    if (!(/^1[3456789]\d{9}$/.test(this.data.mobile))) {
      Notify({
        type: 'warning',
        message: '手机号格式不正确'
      });
      return false
    }
    var data = {
      name: this.data.userName,
      mobile: this.data.mobile
    }
    if(this.data.id!=''){
      data.keyId=this.data.id
      var url = app.globalData.baseUrl + 'apiMall/food/hangbill/updateUser'
      util.postRequestList(url, data, false, this.uploadRes)
    }else{
      var url = app.globalData.baseUrl + 'apiMall/food/hangbill/add'
      util.postRequestList(url, data, false, this.addRes)
    }
  },
  uploadRes(res){
    if (res.data.code == 200) {
      wx.showModal({
        title: '提示',
        content: '更新成功',
        showCancel:false,
        success(res) {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  addRes(res){
    var that=this
    if(res.data.code==200){
      wx.showModal({
        title: '提示',
        content: '添加成功',
        cancelText:'继续',
        confirmText:'返回',
        success(res){
          if(res.confirm){
            wx.navigateBack({
              delta:1
            })
          }
          if(res.cancel){
            that.setData({
              userName:'',
              mobile:''
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      wx.setNavigationBarTitle({
        title: '修改信息',
      })
      var prevPage=util.getPrevPage()
      var detail=prevPage.data.detail
      this.setData({
        userName:detail.name,
        mobile:detail.mobile,
        id:detail.keyId
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
    this.setData({
      isSubmit: false
    })

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