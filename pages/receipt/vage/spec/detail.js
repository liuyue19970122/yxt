// pages/receipt/vage/spec/detail.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matInfo: [],
    name: '',
    price: '',
    type: 'new',
    index: '',
    lastType:'',
    isOpen:true,
    foodId:'',
    attrId:'',
    isSubmit:false
  },
  getName: function(e) {
    this.setData({
      name: e.detail
    })
  },
  getPrice: function(e) {
    this.setData({
      price: e.detail
    })
  },
  goAdd() {
    wx.navigateTo({
      url: '../material/detail',
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '../material/detail?index=' + e.currentTarget.dataset.index,
    })
  },
  goDel(e) {
    if(this.data.lastType=='update'){
      var url = app.globalData.baseUrl +'apiMall/food/admin/deleteAttrMat'
      var data={
        matId: this.data.matInfo[e.currentTarget.dataset.index].keyId
      }
      util.postRequestList(url,data,false,this.delMatRes)
      this.setData({
        matIndex: e.currentTarget.dataset.index
      })
    }else{
      var list = this.data.matInfo
      list.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        matInfo: list
      })
    }
  },
  delMatRes(res){
    var that=this
    if(res.data.code==200){
      var list = that.data.matInfo
      list.splice(that.data.matIndex, 1)
      that.setData({
        matInfo: list
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
    
  },
  onSubmit() {
    this.setData({
      isSubmit:true
    })
    var item = {
      attrName: this.data.name,
      attrPrice: this.data.price,
      status: this.data.isOpen?1:0,
      matInfo: JSON.stringify(this.data.matInfo)
    }
    var prevPage = util.getPrevPage()
    var list = prevPage.data.specList
    
    if (prevPage.data.type == 'update') {
      if (this.data.type == 'new') {
        var url = app.globalData.baseUrl +'apiMall/food/admin/addAttr'
        var data={
          foodId:prevPage.data.foodId,
          attrName: this.data.name,
          sellPrice:this.data.price,
          status: this.data.isOpen ? 1 : 0,
          matInfo: JSON.stringify(this.data.matInfo)
        }
        util.postRequestList(url,data,false,this.addRes)
        
      } else {
        var url = app.globalData.baseUrl + 'apiMall/food/admin/updateAttr'
        var data = {
          attrId: this.data.attrId,
          attrName: this.data.name,
          sellPrice: this.data.price,
          status: this.data.isOpen ? 1 : 0,
          // matInfo: JSON.stringify(this.data.matInfo)
        }
        util.postRequestList(url, data, false, this.updateRes)
      }
    } else {
      if (this.data.type == 'new') {
        list.push(item)
      } else {
        list.splice(this.data.index, 1, item)
      }
      prevPage.setData({
        specList: list
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },
  addRes(res){
    var that=this
    if(res.data.code==200){
      var prevPage = util.getPrevPage()
      var list = prevPage.data.specList
      var data = {
        foodId: prevPage.data.foodId,
        attrName: that.data.name,
        // sellPrice: that.data.price,
        attrPrice: that.data.price,
        status: that.data.isOpen ? 1 : 0,
        matInfo: JSON.stringify(that.data.matInfo)
      }
      list.push(data)
      prevPage.setData({
        specList: list
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
    this.setData({
      isSubmit:false
    })
  },
  updateRes(res){
    var that = this
    if (res.data.code == 200) {
      var prevPage = util.getPrevPage()
      var list = prevPage.data.specList
      var data = {
        attrId: prevPage.data.foodId,
        attrName: that.data.name,
        attrPrice: that.data.price,
        status: that.data.isOpen ? 1 : 0,
        matInfo: JSON.stringify(that.data.matInfo)
      }
      list.splice(that.data.index, 1, data)
      prevPage.setData({
        specList: list
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
    this.setData({
      isSubmit:false
    })
  },
  isOpenFn({
    detail
  }) {
    this.setData({
      isOpen: detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.item) {
      var list = this.data.matInfo
      list.push(JSON.parse(options.item))
      this.setData({
        matInfo: list
      })
    }
    var prevPage = util.getPrevPage()
    if (options.index) {
      var list = prevPage.data.specList
      this.setData({
        name: list[options.index].attrName,
        price: list[options.index].attrPrice,
        matInfo: JSON.parse(list[options.index].matInfo),
        type: 'update',
        index: options.index,
        attrId: list[options.index].keyId
      })
    }
    this.setData({
      lastType: prevPage.data.type,
      foodId: prevPage.data.foodId,
    })
    if(options.type){
      this.setData({
        lastType: options.type,
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
    this.setData({
      isSubmit: false
    })
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