// pages/finance/statement/income/income.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:0,
    subPrice:'00',
    curYear:'',
    nowYear:'',
    outcomeList:[]
  },
  //picker时间事件
  bindDateChange(e) { 
    let year=e.detail.value
    this.setData({
      curYear:year
    })
    let data={
      year:year
    }
    this.getOutcomeInfo(data)
  },
  bindDateCancel(e){},
  //查看详情
  bindClick(e){
    let month=e.detail
    let curMonth=''
    let list=this.data.outcomeList
    list.forEach(item=>{
      if(item.month===month){
        curMonth=item.monthInfo
      }
    })
    wx.navigateTo({
      url: '/pages/finance/statement/expense_dtl/dtl?month='+month+'&curMonth='+curMonth,
    })
  },
  //获取支出详情
  getOutcomeInfo(data){
    wx.showLoading({title:'加载中...'})
    let url = app.globalData.baseUrl +'apiMall/report/outcome'
    util.getRequestListData(url,data,false,this.outcomeInfoRes)
  },
  outcomeInfoRes(res,type){
    wx.hideLoading()
    if(res.data.code==='200'&& res.statusCode===200){
      console.log(res)
      let list=res.data.content
      let price=0
      list.forEach(item=>{
        if(item.totalMoney){
          item.cusTotalMoney=util.getMoney(item.totalMoney).toString()
        }else{
          item.cusTotalMoney=0
        }
        price=util.accAdd(price,item.totalMoney)
      })
      if(price){
        list.forEach(item=>{
          if(item.totalMoney){
            let p=util.accDiv(item.totalMoney,price)
            let pws=util.accMul(p,100)
            item.cusPercent=pws+'%'
          }else{
            item.cusPercent='0%'
          }
        })
      }else{
        list.forEach(item=>{
         item.cusPercent='0%'
        })
      }
      let priceStr=util.getMoney(price).toString()
      let priceArr=priceStr.split('.')
      let intPrice=priceArr[0]
      let litPrice=priceArr[1]
      this.setData({
        outcomeList:list,
        price:intPrice,
        subPrice:litPrice
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
    let year = new Date().getFullYear()
    let data={
      year:year
    }
    this.setData({curYear:year,nowYear:year})
    this.getOutcomeInfo(data)
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