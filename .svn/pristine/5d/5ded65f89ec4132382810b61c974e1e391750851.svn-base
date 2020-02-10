// pages/oa/staff-info/info.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusIndex:0,
    statusList:[
      {
        id:0,
        status:'在职'
      },{
        id:1,
        status:'离职'
      }
    ],
    roleList:[],
    roleIndex:0
  },
  getRoleList() {
    var url = app.globalData.baseUrl + 'apiUser/role/list'
    util.getRequestList(url, false, this.roleRes)
  },
  roleRes(res) {
    if (res.data.code == 200) {
      this.setData({
        roleList: res.data.content
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRoleList()
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