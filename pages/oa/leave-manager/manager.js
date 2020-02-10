// pages/oa/leave-manager/manager.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [{
        id: 1,
        title: '请假申请',
        icon: '/utils/img/page-icon/leave.png'
      },
      {
        id: 2,
        title: '我审批的',
        unRead: 3,
        icon: '/utils/img/page-icon/look-list.png'
      },
      {
        id: 3,
        title: '我提交的',
        icon: '/utils/img/page-icon/submit-list.png'
      },
    ],
    total: 0
  },
  goDetail(e) {
    var id = e.currentTarget.dataset.id
    if (id == 1) {
      wx.navigateTo({
        url: '../add-leave/add',
      })
    } else if (id == 2) {
      wx.navigateTo({
        url: '../leave-list/list?type=all',
      })
    } else {
      wx.navigateTo({
        url: '../leave-list/list?type=self',
      })
    }
  },
  getLeaveList() {
    var url = app.globalData.baseUrl + 'apiUser/user/leave/view'
    util.getRequestListData(url, data, false, this.listRes)
  },
  listRes(res) {
    var list = res.data.content
    var i = 0
    list.map((item) => {
      if (item.status == 0) {
        i++
      }
    })
    this.setData({
      leaveList: list,
      total: i
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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