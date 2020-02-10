// pages/receipt/credit-manager/people-list/list.js\
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peopleList:[],
    userName:'',
    showSetDialog:false,
    actions: [{
      name: '查看',
      color: '07c160',
      index: 0
    },
    {
      name: '删除',
      color: 'fe2200',
      index: 1
    },],
    type:''
  },
  bindUserName(e){
    this.setData({
      userName:e.detail.value
    })
  },
  onSelect(e){
    var that=this
    var index=e.detail.index
    if(index==0){
      this.goDetail()
    }else{
      wx.showModal({
        title: '提示',
        content: '确定删除该挂账人么',
        success(res){
          if(res.confirm){
            var url = app.globalData.baseUrl + 'apiMall/food/hangbill/deleteUser'
            var data={
              keyId:that.data.selectId
            }
            util.postRequestList(url,data,false,that.delRes)
          }
        }
      })
    }
  },
  delRes(res){
    if(res.data.code==200){
      var list=this.data.peopleList
      list.splice(this.data.selectIndex,1)
      this.setData({
        peopleList:list
      })
    }else{
      wx.showToast({
        icon:'none',
        title: res.data.message,
        duration:2000
      })
    }
  },
  getList(){
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl +'apiMall/food/hangbill/listUser'
    var data={
      name:this.data.userName
    }
    util.getRequestListData(url,data,false,this.getRes)
  },
  getRes(res){
    wx.hideLoading()
    var list=res.data.content
    list.map((item)=>{
      item.billMoney = util.getMoney(item.billMoney).toLocaleString()
    })
    this.setData({
      peopleList: list
    })
  },
  bindCloseSet(){
    this.setData({
      showSetDialog:false
    })
  },
  goAdd(){
    wx.navigateTo({
      url: '../add-person/add',
    })
  },
  goDetail(){
    wx.navigateTo({
      url: '../credit-detail/detail?index='+this.data.selectIndex,
    })
  },
  openDialog(e){
    var that=this
    if(this.data.type=='submit'){
      var prevPage=util.getPrevPage()
      prevPage.setData({
        hangId: e.currentTarget.dataset.id,
        hangName: that.data.peopleList[e.currentTarget.dataset.index].name
      })
      wx.navigateBack({
        delta:1
      })
    }else{
      this.setData({
        selectId: e.currentTarget.dataset.id,
        selectIndex: e.currentTarget.dataset.index,
        showSetDialog: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      wx.setNavigationBarTitle({
        title: '选择挂账人',
      })
      this.setData({
        type:options.type
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
    this.getList()
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