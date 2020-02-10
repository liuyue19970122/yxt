// pages/receipt/vage-list/list.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],
    selectFirstIndex: 0,
    selectSecondIndex: 0,
    pageNum: 1,
    pages: 1,
    pageSize: 10,
    foodList: [],
    showTypeModule:false,
    vageName:'',
    delIndex:0
  },
  bindVageName(e){
    this.setData({
      vageName:e.detail.value
    })
  },
  goSearch(){
    this.setData({
      pageNum:1,
      selectFirstIndex:0
    })
    this.getFoodList()
  },
  goEdit(e){
    wx.navigateTo({
      url: '../vage/add/add?id='+e.currentTarget.dataset.id,
    })
  },
  bindTabCollapse(){
    var showTypeModule=!this.data.showTypeModule
    this.setData({showTypeModule})
  },
  goAdd() {
    if(this.data.selectFirstIndex==0){
      wx.navigateTo({
        url: '../vage/add/add',
      })
    }else{
      var cateList = this.data.cateList
      var selectFirstIndex = this.data.selectFirstIndex
      var selectSecondIndex = this.data.selectSecondIndex
      var cateId = cateList[selectFirstIndex].nextList.length > 0 ? cateList[selectFirstIndex].nextList[selectSecondIndex].keyId.toString() : cateList[selectFirstIndex].keyId.toString()
      wx.navigateTo({
        url: '../vage/add/add?cateId=' + cateId,
      })
    }
  },
  goDetail(e){
    if (this.data.selectFirstIndex == 0){
      wx.navigateTo({
        url: '../vege/vege-detail/detail?id=' + e.currentTarget.dataset.id + "&type=1",
      })
    } else {
      var cateList = this.data.cateList
      var selectFirstIndex = this.data.selectFirstIndex
      var selectSecondIndex = this.data.selectSecondIndex
      var cateId = cateList[selectFirstIndex].nextList.length > 0 ? cateList[selectFirstIndex].nextList[selectSecondIndex].keyId.toString() : cateList[selectFirstIndex].keyId.toString()
      wx.navigateTo({
        url: '../vege/vege-detail/detail?id=' + e.currentTarget.dataset.id + "&type=1&cateId="+cateId,
      })
    }
    
  },
  getCateList() {
    var url = app.globalData.baseUrl + 'apiMall/food/cate/list?t=' + times
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res) {
    var cateList = res.data.content
    var that = this
    cateList.map((item) => {
      var jtem = {
        keyId: item.keyId,
        cateName: "全部"
      }
      item.nextList = JSON.parse(item.nextList)
      item.nextList.unshift(jtem)
    })
    var item={
      keyId:-1,
      cateName:'全部',
      nextList:[{
        keyId:-1,
        cateName:'全部'
      }]
    }
    cateList.unshift(item)
    this.setData({
      cateList,
    })
    if (cateList.length>0){
      this.getFoodList()
    }
  },
  changeFirstCate: function(e) {
    this.setData({
      selectFirstIndex: e.currentTarget.dataset.index,
      pageNum:1,
      selectSecondIndex: 0,
      showTypeModule:false,
    })
    this.getFoodList()
  },
  changeSecondCateTab(e) {
    this.setData({
      selectSecondIndex: e.detail.index,
      showTypeModule: false,
      pageNum: 1,
    })
    // wx.showLoading({
    //   title: '获取中',
    // })
    this.getFoodList()
  },
  changeSecondCate(e) {
    this.setData({
      selectSecondIndex: e.currentTarget.dataset.index,
      showTypeModule:false
    })
  },
  goTpl(){
    if (this.data.selectFirstIndex == 0) {
      wx.navigateTo({
        url: '../vege/default-tpl/list',
      })
    } else {
      var cateList = this.data.cateList
      var selectFirstIndex = this.data.selectFirstIndex
      var selectSecondIndex = this.data.selectSecondIndex
      var cateId = cateList[selectFirstIndex].nextList.length > 0 ? cateList[selectFirstIndex].nextList[selectSecondIndex].keyId.toString() : cateList[selectFirstIndex].keyId.toString()
      wx.navigateTo({
        url: '../vege/default-tpl/list?cateId=' + cateId,
      })
    }
  },
  goInsert() {
    if (this.data.selectFirstIndex == 0) {
      wx.navigateTo({
        url: '../vege/default-list/list',
      })
    } else {
      var cateList = this.data.cateList
      var selectFirstIndex = this.data.selectFirstIndex
      var selectSecondIndex = this.data.selectSecondIndex
      var cateId = cateList[selectFirstIndex].nextList.length > 0 ? cateList[selectFirstIndex].nextList[selectSecondIndex].keyId.toString() : cateList[selectFirstIndex].keyId.toString()
      wx.navigateTo({
        url: '../vege/default-list/list?cateId=' + cateId,
      })
    }
  },
  getFoodList() {
    var url = app.globalData.baseUrl + 'apiMall/food/admin/list?t=' + times
    var data = {
      cateId: this.data.cateList[this.data.selectFirstIndex].nextList.length > 0 ? this.data.cateList[this.data.selectFirstIndex].nextList[this.data.selectSecondIndex].keyId : this.data.cateList[this.data.selectFirstIndex].keyId,
      name:this.data.vageName,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    wx.showLoading({
      title: '获取中',
    })
    util.getRequestListData(url, data, false, this.foodListRes)
  },
  foodListRes(res) {
    setTimeout(()=>{
      wx.hideLoading()
    },500)
    res.data.content.list.map((item)=>{
      item.attrList=JSON.parse(item.attrList)
      item.attrList.map((jtem)=>{
        jtem.sellPrice=util.getMoney(jtem.sellPrice)
      })
    })
    var list=this.data.pageNum==1?res.data.content.list:this.data.foodList.concat(res.data.content.list)
    this.setData({
      foodList: list,
      pages: res.data.content.pages
    })
  },
  getNextPage() {
    util.getNextPage(this,this.data.pages,this.getFoodList)
  },
  goDel(e){
    var id=e.currentTarget.dataset.id
    var index=e.currentTarget.dataset.index
    this.setData({
      delIndex:index
    })
    var that=this
    wx.showModal({
      title: '提示',
      content: '确定删除该菜品么',
      success:function(res){
        if(res.confirm){
          var url = app.globalData.baseUrl +'apiMall/food/admin/deleteFood'
          var data={
            foodId:id
          }
          util.postRequestList(url,data,false,that.delRes)
        }
      }
    })
  },
  delRes(res){
    if(res.data.code==200){
      var foodList=this.data.foodList
       var index=this.data.delIndex
      foodList.splice(index,1)
       this.setData({
         foodList
       })
    }else{
      wx.showToast({
        icon:'none',
        title: res.data.message,
      })
    }
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
    this.setData({
      pageNum:1
    })
    this.getCateList()
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