// pages/oa/staff-module/salary-info-list/list.js
var util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    salaryList:[],
    userId:'',
    showAddDialog:false,
    typeList:[],
    typeIndex:0,
    money:'',
    typeName:'',
    isNew:false,
    isHave:true,
  },
  bindTypeChange(e){
    this.setData({
      typeIndex:e.detail.value
    })
    if(e.detail.value==this.data.typeList.length-1){
      this.setData({
        isNew:true
      })
    }else{
      this.setData({
        isNew: false
      })
    }
  },
  bindMoney(e){
    var value=util.clearNoNum(e.detail.value)
    this.setData({
      money:value
    })
  },
  addType(){
    var type = this.data.typeIndex<this.data.typeList.length-1? this.data.typeList[this.data.typeIndex]:this.data.typeName
    var url = app.globalData.baseUrl +'apiUser/user/setSalary'
    var data={
      userId:this.data.userId,
      salaryType: type,
      salary:this.data.money
    }
    util.postRequestList(url,data,false,this.addRes)
  },
  addRes(res){
    if(res.data.code==200){
      this.setData({
        showAddDialog:false,
        money:'',
        typeName:''
      })
      this.getDetail()
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  onClose(){
    this.setData({
      showAddDialog:false
    })
  },
  goSet(e){
    wx.navigateTo({
      url: '../set-salary/set-salary?index='+e.currentTarget.dataset.index,
    })
  },
  getDetail() {
    var url = app.globalData.baseUrl + 'apiUser/user/detail'
    var data = {
      keyId: this.data.userId
    }
    util.getRequestListData(url, data, false, this.detailRes)
  },
  detailRes(res) {
    if (res.data.code == 200) {
      var content = res.data.content
      var salaryList = JSON.parse(content.salaryList)
      salaryList.map((item)=>{
        item.money=util.getMoney(item.money)
      })
      this.setData({
        salaryList: salaryList
      })
    }
  },
  goAdd(){
    this.getSalaryType()
    this.setData({
      showAddDialog:true
    })
  },
  getSalaryType() {
    var url = app.globalData.baseUrl + 'apiUser/user/salaryType'
    var data={
      userId:this.data.userId
    }
    util.getRequestListData(url, data,false, this.typeRes)
  },
  typeRes(res) {
    var list=res.data.content
    if(list.length==0){
      this.setData({
        isNew:true,
        isHave:false
      })
    }else{
      list.push("其他")
      this.setData({
        typeList: list
      })
    }
  },
  getTypeName(e){
    this.setData({
      typeName:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId:options.id
    })
    this.getDetail()
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
    this.getDetail()
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