// pages/system/account-manager/account-manager.js

var util = require('../../../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:'',
    pageNum:1,
    pages:0,
    pageSize:10,
    statusIndex:0,
    allCheck:false,
    statusList:[
      {
        index:0,
        status:'未结',
      }, {
        index: 1,
        status: '已结',
      },
    ],
    result: [],
    ifStatus:false,
    totalMoney:0,
  },
  bindAllCheck(){
    var that=this
    this.setData({
      allCheck:!that.data.allCheck
    })
    if(this.data.allCheck){
      var list = []
      var totalMoney=0
      this.data.hangList.map((item) => {
        list.push(item.keyId.toString())
        totalMoney+=item.billMoney
      })
      this.setData({
        result:list,
        totalMoney:util.getMoney(totalMoney)
      })
    }else{
      this.setData({
        result:[],
        totalMoney:0
      })
    }
  },
  cancelSelect(){
    this.setData({
      ifStatus:false
    })
  },
  selectStatus(){
    this.setData({
      ifStatus:true
    })
  },
  bindStatus(e){
    this.setData({
      statusIndex:e.currentTarget.dataset.index,
      ifStatus: false,
      result:[],
      allCheck:false,
      totalMoney:0
    })
    this.getList()
  },
  getList(){
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl + 'apiMall/food/hangbill/list'
    var data={
      hangUserId:this.data.id,
      pageNum:this.data.pageNum,
      pageSize: this.data.pageSize,
      status:this.data.statusIndex
    }
    util.getRequestListData(url,data,false,this.getRes)
  },
  getRes(res){
    wx.hideLoading()
    if(res.data.code==200){
      var list=res.data.content.list
      list.map((item)=>{
        item.realMoney = util.getMoney(item.billMoney).toLocaleString(),
          item.crtTime = util.formatTime(item.crtTime)
      })
      list=this.data.pageNum==1?list:this.data.hangList.concat(list)
      this.setData({
        hangList:list,
        pages:res.data.content.pages
      })
    }
  },
  getDetail(){
    var url = app.globalData.baseUrl +'apiMall/food/hangbill/userDetail'
    var data={
      keyId:this.data.id
    }
    util.getRequestListData(url,data,false,this.detailRes)
  },
  detailRes(res){
    res.data.content.billMoney = util.getMoney(res.data.content.billMoney).toLocaleString()
    this.setData({
      detail:res.data.content
    })
  },
  onChange(event) {
    if(event.detail.length==this.data.hangList.length){
      this.setData({
        allCheck:true
      })
    }else{
      this.setData({
        allCheck: false
      })
    }
    this.setData({
      result: event.detail
    });
    var totalMoney=0
    for(var item of this.data.hangList){
      for(var jtem of event.detail){
        if(item.keyId==jtem){
          totalMoney+=item.billMoney
        }
      }
    }
    this.setData({
      totalMoney:util.getMoney(totalMoney).toLocaleString()
    })
  },
  bindSubmit(){
    if(this.data.result.length==0){
      return false
    }
    var that=this
    wx.showModal({
      title: '提示',
      content: '确定结清么？',
      success:function(res){
        if(res.confirm){
          var url = app.globalData.baseUrl + 'apiMall/food/hangbill/bill'
          var data = {
            billIds: that.data.result
          }
          util.postRequestList(url, data, false, that.submitRes)
        }else{

        }
      }
    })
   
  },
  submitRes(res){
    var that=this
    if(res.data.code==200){
      wx.showModal({
        title: '提示',
        content: '结清成功',
        showCancel:false,
        success(){
          that.setData({
            pageNum:1,
            totalMoney:0,
            result:[]
          })
          that.getDetail()
          that.getList()
        }
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index=options.index
    var prevPage=util.getPrevPage()
    var id=prevPage.data.peopleList[index].keyId
    this.setData({
      id: id
    })
    this.getDetail()
    this.getList()    
  },
  goReset(e){
    wx.navigateTo({
      url: '../add-person/add?id='+this.data.detail.keyId,
    })
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
    util.getNextPage(this,this.data.pages,this.getList)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})