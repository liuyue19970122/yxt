// pages/stock/stock-category/stock-category.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],
    activeId: 0,
    newName: '',
    id: 0,
    isFinish: true,
    isEdit: false,
    editIcon: '/utils/img/stock/del.png'
  },
  clickItem: function (e) {
    this.setData({
      activeId: e.currentTarget.dataset.id
    })
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    this.setData({
      newName: name,
      id: id,
      isFinish: false
    })
  },
  goDetail(e){
    wx.navigateTo({
      url: '../vege-add-category/add-cate?id=' + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name + "&sortNum=" + e.currentTarget.dataset.sort,
    })
  },
  editFn() {
    if (this.data.isEdit) {
      this.setData({
        isEdit: false,
        editIcon: '/utils/img/stock/del.png'
      })
    } else {
      this.setData({
        isEdit: true,
        editIcon: '/utils/img/stock/ok.png'
      })
    }
  },
  delCate: function (e) {
    var id = e.currentTarget.dataset.id
    var url = app.globalData.baseUrl + 'apiMall/food/cate/delete?t=' + times
    var data = {
      cateId: id
    }
    this.setData({
      id: id
    })
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该分类么？',
      success: function (res) {
        if (res.confirm) {
          util.postRequestList(url, data, false, that.delRes)
        } else {
          return false
        }
      }
    })
  },
  delRes(res) {
    if (res.data.code == 200) {
      var that = this
      var list = this.data.cateList
      for (var i in list) {
        if (list[i].keyId == that.data.id) {
          list.splice(i, 1)
        } else {
          for (var j in list[i].nextList) {
            if (list[i].nextList[j].keyId == that.data.id) {
              list[i].nextList.splice(j, 1)
            }
          }
        }
      }
      this.setData({
        cateList: list
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: res.data.message,
      })
    }
  },
  closeActive: function () {
    this.setData({
      activeId: 0
    })
    if (!this.data.isFinish) {
      var url = app.globalData.baseUrl + 'apiMall/food/cate/update?t=' + times
      var data = {
        cateId: this.data.id,
        cateName: this.data.newName
      }
      util.getRequestListData(url, data, false, this.finishRes)
    }
  },
  finishRes(res) {
    this.setData({
      isFinish: true
    })
    this.getCateList()
  },
  inputName: function (e) {
    this.setData({
      newName: e.detail.value
    })
  },
  tiggleChange: function (e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    this.setData({
      newName: name,
      id: id,
      isFinish: false
    })
  },
  getCateList() {
    wx.showLoading({
      title: '获取中',
    })
    var url = app.globalData.baseUrl + 'apiMall/food/cate/list?t=' + times
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    var list = res.data.content
    var that = this
    for (var item of list) {
      item.nextList = JSON.parse(item.nextList)
    }
    this.setData({
      cateList: list
    })
  },
  addFn: function () {
    wx.navigateTo({
      url: '../vege-add-category/add-cate'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCateList()
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