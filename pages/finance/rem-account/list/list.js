// pages/finance/rem-account/list/list.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curMonth: '',
    endMonth:'',
    billList:[],
    typeIndex:0,
    typeName:'全部',
    typeList:[],
    filterData:{
      typeCode:'',
      crtTime:'',
      pageNum:1,
      pageSize:10
    }
  },
  //picker时间事件
  bindDateChange(e) {
    console.log(e)
    let val=e.detail.value
    let curMonth=val.replace('-','年')+'月'
    console.log(curMonth)
    let ym=val.replace('-','/')
    let ms=Date.parse(new Date(ym))
    let filterData=this.data.filterData
    filterData.crtTime=ms
    filterData.pageNum=1
    this.setData({
      curMonth,
      filterData
    })
    this.getBillList(filterData,'refresh')
  },
  //bindTypeChange选择分类
  bindTypeChange(e){
    let index=parseInt(e.detail.value)
    let tl=this.data.typeList
    let tc=tl[index].typeCode
    let tn=tl[index].typeName
    let filterData=this.data.filterData
    filterData.typeCode=tc
    filterData.pageNum=1
    this.setData({
      typeIndex:index,
      typeName:tn,
      filterData
    })
    this.getBillList(filterData,'refresh') 
  },
  //查看详情
  scanDetail(e){
    console.log(e)
    let id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/finance/rem-account/detail/detail?id='+id,
    })
  },
  //加载更多
  bindReachBottom(e){
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum++
      this.setData({filterData})
      this.getBillList(filterData,'reachBottom')
    }
  },
  //获取记账列表//bookbill/list
  getBillList(data,type){
    let url = app.globalData.baseUrl +'apiMall/bookbill/list'
    util.getRequestListData(url,data,type,this.billListRes)
  },
  billListRes(res,type){
    if(res.data.code==='200'){
      let list=res.data.content.list
      let hasNextPage=res.data.content.hasNextPage
      list.forEach(item=>{
        item.cusBillTime=util.formatDate(item.billTime)
        if(item.typeCode.indexOf('-')!=-1){
          item.cusMoney=item.typeCode+util.getMoney(item.money).toString()
        }else{
          item.cusMoney=util.getMoney(item.money).toString()
        }
      })
      if(type=='refresh'){
        this.setData({billList:list})
      }
      if(type==='reachBottom'){
        let cbl=this.data.billList
        list.forEach(item=>{
          cbl.push(item)
        })
        this.setData({billList:cbl})
      }
      this.setData({hasNextPage})
    }
  },
  //获取记账类型//bookbill/listType
  getBillType(){
    let url = app.globalData.baseUrl +'apiMall/bookbill/listType'
    util.getRequestList(url,false,this.billTypeRes)
  },
  billTypeRes(res,type){
    if(res.data.code==='200'){
      let obj={
        typeName:'全部',
        typeCode:''
      }
      let typeList=res.data.content
      typeList.unshift(obj)
      this.setData({typeList})
      console.log(res)
    }
  },
  //记账
  bindToAdd(){
    wx.navigateTo({
      url: '/pages/finance/rem-account/add/add',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cd=new Date()
    const year = cd.getFullYear()
    const month = cd.getMonth() + 1
    let curMonth=year+'年'+month+'月'
    let endMonth=year+'-'+month
    this.setData({curMonth,endMonth})
    this.getBillType()
    let filterData=this.data.filterData
    this.getBillList(filterData,'refresh')
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