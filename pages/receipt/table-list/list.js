// pages/receipt/table-list/list.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    desktopList: [],
    orderId:'',
    activeId: 0,
    type: '',
    selectId:'',
    lock: false,
    showSetDialog:false,
    actions: [{
      name: '修改',
      color: '07c160',
      index: 0
    },
    {
      name: '删除',
      color: 'fe2200',
      index: 1
    }
    ],
    selectIndex:0
  },
  goSet(e){
    this.setData({
      selectId: e.currentTarget.dataset.id,
      selectIndex:e.currentTarget.dataset.index,
      showSetDialog:true
    })
  },
  bindCloseSet(){
    this.setData({ 
      showSetDialog:false
    })
  },
  onSelect(e) {
    var that = this
    var index = e.detail.index
    if (index == 1) {
      wx.showModal({
        title: '提示',
        content: '确定删除该桌位么',
        success: function (res) {
          if (res.confirm) {
            var url = app.globalData.baseUrl + 'apiMall/food/desktop/delete'
            var data = {
              deskId: that.data.selectId
            }
            util.postRequestList(url, data, false, that.delRes)
          }
        }
      })
    } else {
      this.goUpdate()
    }
  },
  delRes(res) {
    if (res.data.code == 200) {
      var that = this
      var desktopList = that.data.desktopList
      var index = that.data.selectIndex
      desktopList.splice(index, 1)
      this.setData({
        desktopList: desktopList,
        showSetDialog: false
      })
    } else {
      wx.showToast({
        title: res.data.message,
      })
      this.setData({
        showSetDialog: false
      })
    }
  },
  selectItem(e) {
    if (this.data.type == 'reChoose') {
      var prevPage = util.getPrevPage()
      var tableId=[]
      tableId.push(e.currentTarget.dataset.id)
      prevPage.setData({
        tableId: tableId,
        tableName: this.data.desktopList[e.currentTarget.dataset.index].deskCode
      })
      wx.navigateBack({
        delta: 1
      })
    } else if (this.data.type == 'choose'){
      if(e.currentTarget.dataset.status==1){
        wx.navigateTo({
          url: '../submit-order/submit?orderId='+e.currentTarget.dataset.orderid,
        })
        return false
      }
      var tableId = []
      tableId.push(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: '../order-food/cart?tableId=' + JSON.stringify(tableId) + "&tableName=" + this.data.desktopList[e.currentTarget.dataset.index].deskCode,
      })
    } 
    else {
      var list = this.data.desktopList
      list[e.currentTarget.dataset.index].isSelect = !list[e.currentTarget.dataset.index].isSelect
      this.setData({
        desktopList: list
      })
    }
  },
  getList() {
    wx.showLoading({
      title: '获取中',
    })
    var url = app.globalData.baseUrl + 'apiMall/food/desktop/list'
    util.getRequestList(url, false, this.listRes)
  },
  listRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    if (res.data.code == 200) {
      var list=[]
      if(this.data.type==''){
        res.data.content.map((item) => {
          item.isSelect = false
          list.push(item)
        })
      }else if(this.data.type=='submit'||this.data.type=='reChoose'){
        res.data.content.map((item) => {
          item.isSelect = false
          if(item.status!=1){
            list.push(item)
          }
        })
      }else{
        res.data.content.map((item) => {
          item.isSelect = false
          
            list.push(item)
        })
      }
      this.setData({
        desktopList: list
      })
    }
  },
  goAdd: function() {
    wx.navigateTo({
      url: '../table-add/add',
    })
  },
  clickItem: function(e) {
    this.data.lock = true;
    this.setData({
      activeId: e.currentTarget.dataset.id
    })
  },
  goUpdate(e) {
    var that=this
    wx.navigateTo({
      url: '../table-update/update?index=' + that.data.selectIndex,
    })
  },
  closeActive: function() {
    this.setData({
      activeId: 0
    })
  },
  addRes(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  bindChoose() {
    if (this.data.type == 'reChoose') {
      // var util=app.globalData.baseUrl
      var prevPage = util.getPrevPage()
      // var list=prevPage.data.tableId
      var list = this.data.desktopList
      var tableId = prevPage.data.tableId
      list.map((item) => {
        if (item.isSelect) {
          tableId.push(item.keyId)
        }
      })
      prevPage.setData({
        tableId: tableId
      })
      wx.navigateBack({
        delta: 1
      })
    } else if (this.data.type = 'submit') {
      var url = app.globalData.baseUrl + 'apiMall/food/order/addDesk'
      var list = this.data.desktopList
      var tableId = []
      list.map((item) => {
        if (item.isSelect) {
          tableId.push(item.keyId)
        }
      })
      var data = {
        orderId: this.data.orderId,
        deskId: tableId
      }
      util.postRequestList(url, data, false, this.addRes)
    } else if (this.data.type == 'choose') {
      var list = this.data.desktopList
      var tableId = []
      list.map((item) => {
        if (item.isSelect) {
          tableId.push(item.keyId)
        }
      })
      wx.navigateTo({
        url: '../order-food/cart?tableId=' + JSON.stringify(tableId),
      })
    }
  },
  goPay(e) {
    if (this.data.lock) {
      this.data.lock = false;
      return;
    }
    var id = e.currentTarget.dataset.id
    var status = e.currentTarget.dataset.status
    var index = e.currentTarget.dataset.index
    if (this.data.type == '') {
      if (status == 1) {
        wx.navigateTo({
          url: '../submit-order/submit?tableId=' + id + "&orderId=" + this.data.desktopList[index].orderId,
        })
      } else {
        wx.navigateTo({
          url: '../order-food/cart?tableId=' + id,
        })
      }
    } else {
      var prevPage = util.getPrevPage()
      prevPage.setData({
        tableId: e.currentTarget.dataset.id
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  goOrder() {
    wx.navigateTo({
      url: '../order-food/cart',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type) {
      this.setData({
        type: options.type,
        orderId:options.orderId
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
    this.getList()
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