// pages/stock/add-category/add-category.js

var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'1',
    description:'',
    name:'',
    typeList:[
      {
        id:1,
        name:'原材料仓库'
      },{
        id:2,
        name:'商品仓库'
      }
    ]
  },
  changeType(e){
    this.setData({
      type:e.detail.value
    })
  },
  changeName: function (e) {
    var obj = util.inputTest(e)
    this.setData({
      name: obj.value
    })
  },
  changeDes:function(e){
    this.setData({
      description: e.detail
    })
  },
  addRoom: function () {
    var url = app.globalData.baseUrl + 'apiStock/stock/location/add'
    var data = {
      locationName: this.data.selectNo,
      description: this.data.selectDes
    }
    util.postRequestList(url, data, false, this.addRes)
  },
  addRes: function (res) {
    if (res.data.code = 200) {
      wx.showToast({
        icon: 'success',
        title: '添加成功',
        duration: 2000,
        success: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: res.data.message,
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