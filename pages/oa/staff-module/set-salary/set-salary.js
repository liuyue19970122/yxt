// pages/oa/staff-module/set-salary/set-salary.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:'',
    userId:'',
    type:'',
    keyId:''
  },
  bindMoney(e){
    var value=util.clearNoNum(e.detail.value)
    this.setData({
      money:value
    })
  },
  goSave(){
    var url = app.globalData.baseUrl + 'apiUser/user/updateSalary'
    var data={
      userId: this.data.userId,
      salaryKeyId: this.data.keyId,
      salary: this.data.money,
    }
    util.postRequestList(url,data,false,this.saveRes)
  },
  saveRes(res){
    if(res.data.code==200){
      wx.navigateBack({
        delta:1
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
   
    var index=options.index
    var prevPage=util.getPrevPage()
    var salaryList=prevPage.data.salaryList
    this.setData({
      money:salaryList[index].money,
      userId:prevPage.data.userId,
      keyId: salaryList[index].keyId,
      type:salaryList[index].type
    })
    wx.setNavigationBarTitle({
      title: salaryList[index].type
    })
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