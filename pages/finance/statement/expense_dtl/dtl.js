// pages/finance/statement/detail/detail.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateArr:[],
    curIndex:0,
    curMonth:'',
    detailList:[],
    filterData:{
      month:'',
      day:'-1',
      pageNum:1,
      pageSize:10
    },
    hasNextPage:true
  },
  //picker时间事件
  bindDateChange(e) {
    let val=parseInt(e.detail.value)
    let dateArr=this.data.dateArr
    let filterData=this.data.filterData
    filterData.day=dateArr[val].day
    let curMonth=dateArr[val].name
    this.setData({filterData,curMonth})
    this.getDetail(filterData,'refresh')
  },
  //获取报表详情列表
  getDetail(data,type){
    wx.showLoading({title:'加载中...'})
    let url= app.globalData.baseUrl +'apiMall/report/outcomeDetail'
    util.getRequestListData(url,data,type,this.detailRes)
  },
  detailRes(res,type){
    wx.hideLoading()
    console.log(res)
    if(res.statusCode===200&&res.data.code==='200'){
      let list=res.data.content.list
      let hasNextPage=res.data.content.hasNextPage
      list.forEach(item=>{
        item.cusMoney=util.getMoney(item.totalMoney).toString()
      })
      if(type==='refresh'){
        this.setData({detailList:list})
      }
      if(type==='reachBottom'){
        let detailList=this.data.detailList
        list.forEach(item=>{
          detailList.push(item)
        })
        this.setData({detailList})
      }
      this.setData({hasNextPage})
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  //底部触发
  bindReachBottom(){
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.setData({filterData})
      this.getDetail(filterData,'reachBottom')
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let month=options.month
    let curMonth=options.curMonth
    let dateArr=util.formatGetDayRange(month,curMonth)
    let filterData=this.data.filterData
    filterData.month=month
    this.setData({filterData,dateArr,curMonth})
    this.getDetail(filterData,pageInType,'refresh')
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