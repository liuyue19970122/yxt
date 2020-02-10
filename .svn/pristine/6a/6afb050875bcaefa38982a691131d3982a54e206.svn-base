// pages/oa/staff-manage/staff-manage.js
var util = require('../../../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    staffList: [],
    actions: [{
        name: '员工信息',
        color: '07c160',
        index: 0
      },
      {
        name: '重置密码',
        color: 'fe2200',
        index: 1
      },
      {
        name: '薪资信息',
        color: 'fe2200',
        index: 2
      },
    ],
    userName: '',
    selectId:0,
    showSetDialog: false
  },
  bindUserName(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  getStaffList() {
    wx.showLoading({
      title: '获取中',
    })
    var url = app.globalData.baseUrl + 'apiUser/user/list'
    var data = {
      name: this.data.userName
    }
    util.getRequestListData(url, data, false, this.listRes)
  },
  listRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    if (res.data.code == 200) {
      this.setData({
        staffList: res.data.content
      })
    }
  },
  goAdd() {
    wx.navigateTo({
      url: '../add-staff/add-staff',
    })
  },
  goDetail(e) {
    if(e.detail.value.status==0){
      wx.navigateTo({
        url: '../add-staff/add-staff?id='+e.detail.value.id+"&type=leave",
      })
    }else{
      this.setData({
        showSetDialog: true,
        selectId: e.detail.value.id
      })
    }
  },
  onSelect(e) {
    var index = e.detail.index
    if (index == 0) {
      wx.navigateTo({
        url: '../add-staff/add-staff?id=' + this.data.selectId+'&type=info',
      })
    } else if (index == 1) {
      wx.navigateTo({
        url: '../add-staff/add-staff?id=' + this.data.selectId + '&type=pwd',
      })
    } else{
      wx.navigateTo({
        url: '../salary-info-list/list?id=' + this.data.selectId,
      })
    }
  },
  bindCloseSet(){
    this.setData({
      showSetDialog:false
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
  onShow: function() {
    this.getStaffList()
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