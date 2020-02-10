// pages/stock/stock-change/stock-change.js
let util = require('../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],
    goodList: [],
    ifStorage: false,
    ifStorehouse: false,
    ifType: false,
    stockList: [],
    warnFlag: false,
    stockIndex: 0,
    cateIndex: 0,
    total:0,
    warnList: [{
      warnFlag: false,
      name: '全部'
    }, {
      warnFlag: true,
      name: '库存告急'
    }],
    warnIndex: 0,
    searchValue:'',
    filterData:{
      goodsName: '',
      cateId: '',
      locationId:'',
      warnFlag:false,
      goodsName: '',
      pageSize: 10,
      pageNum: 1,
    },
    hasNextPage:true,
    scrollTop:0,
    editShow:false,
    curIndex:0
  },
 
  //搜索货品
  onSearch(e){
    let searchValue=e.detail
    let filterData=this.data.filterData
    filterData.pageNum=1
    filterData.goodsName=searchValue
    this.setData({filterData,searchValue,scrollTop:0})
    this.getGoodList(filterData,'refresh')
  },//清除
  onClear(e){
    let searchValue=this.data.searchValue
    if (searchValue){
      let filterData = this.data.filterData
      filterData.goodsName = ''
      filterData.pageNum=1
      let actType = 'refresh'
      this.getGoodList(filterData, actType)
    }else{
      this.setData({
        searchValue: ''
      })
    }
  },
  //选择筛选条件
  goSelect: function(e) {
    var _this = this
    var type = e.currentTarget.dataset.type
    if (type == 'storage') {
      this.setData({
        ifStorage: !_this.data.ifStorage,
        ifStorehouse: false,
        ifType: false
      })
    } else if (type == 'storehouse') {
      this.setData({
        ifStorage: false,
        ifStorehouse: !_this.data.ifStorehouse,
        ifType: false
      })
    } else if (type == 'type') {
      this.setData({
        ifStorage: false,
        ifStorehouse: false,
        ifType: !_this.data.ifType
      })
    }
  },
  //仓库位置选择
  bindStockId(e) {
    let index=parseInt(e.currentTarget.dataset.index)
    let filterData=this.data.filterData
    filterData.pageNum=1
    filterData.locationId=this.data.stockList[index].keyId
    this.setData({
      stockIndex: index,
      ifStorehouse: false,
      filterData,
      scrollTop:0
    })
    this.getGoodList(filterData,'refresh')
  },
  //分类选择
  bindCateChange(e) {
    let index=parseInt(e.currentTarget.dataset.index)
    let filterData=this.data.filterData
    filterData.pageNum=1
    filterData.cateId=this.data.cateList[index].keyId
    this.setData({
      cateIndex: index,
      ifType: false,
      filterData,
      scrollTop:0
    })
    this.getGoodList(filterData,'refresh')
  },
  //预警选择
  bindWarnFlag(e) {
    let index=parseInt(e.currentTarget.dataset.index)
    let flag=e.currentTarget.dataset.flag
    let filterData=this.data.filterData
    filterData.pageNum=1
    filterData.warnFlag=flag
    this.setData({
      warnFlag: flag,
      ifStorage: false,
      warnIndex: index,
      filterData
    })
    this.getGoodList(filterData,'refresh')
  },
  //取消选择
  cancelSelect() {
    this.setData({
      ifStorage: false,
      ifStorehouse: false,
      ifType: false
    })
  },
  //编辑
  handleEdit(e){
    let curIndex=parseInt(e.currentTarget.dataset.index)
    this.setData({editShow:true,curIndex})
  },
  bindClose(){
    this.setData({editShow:false})
  },
  //修改货品品
  bindEditGoods(){
    let index=this.data.curIndex
    let goodsInfo=this.data.goodList[index]
    let str=JSON.stringify(goodsInfo)
    let str1 = str.replace(/\?/g, '*')
    let str2 = str1.replace(/\&/g, '#')
    let str3 = str2.replace(/\=/g, '$')
    this.setData({editShow:false})
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-update/update?proInfo='+str3,
    })
  },
  //删除货品
  bindDelGoods(){
    let index=this.data.curIndex
    let id=this.data.goodList[index].keyId
    let _this=this
    this.setData({editShow:false})
    wx.showModal({
      title: '提示',
      content: '确认是否删除该货品？',
      success(res) {
        if (res.confirm) {
          _this.delProRequest(id)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //删除货品///stock/inst/delete
  delProRequest(id){
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/delete'
    util.postRequestList(url,{stockId:id}, false, this.delProRes)
  },
  delProRes(res,type){
    console.log(res)
    if(res.data.code==='200'){
      let index=this.data.curIndex
      let goodList=this.data.goodList
      let total=this.data.total-1
      goodList.splice(index,1)
      this.setData({goodList,total})
      wx.showToast({
        title: '删除成功',
        duration:2000
      })
    }else{
      wx.showModal({
        title:'提示',
        content:res.data.message,
        showCancel:false
      })
    }
  },
  //加载更多
  bindReachBottom(){
    if(this.data.hasNextPage){
      let filterData = this.data.filterData
      filterData.pageNum += 1
      this.setData({
        filterData
      })
      this.getGoodList(filterData,'reachBottom')
    }
  },
  //选择模板
  goAddTpls(){
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-tpls/tpls?pageInType=fromList&method=refreshGoodsList',
    })
  },
  //选择货品模板
  goInsert(){
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-tpl/tpl?pageInType=fromList&method=refreshGoodsList',
    })
  },
  //添加货品
  goAdd() {
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-in?pageInType=proAdd&method=refreshGoodsList',
    })
  },
  //刷新列表数据
  refreshGoodsList(){
    let filterData={
      goodsName: '',
      cateId: '',
      locationId:'',
      warnFlag:false,
      goodsName: '',
      pageSize: 10,
      pageNum: 1,
    }
    filterData.pageNum=1
    this.setData({
      scrollTop:0,
      stockIndex: 0,
      cateIndex: 0,
      warnIndex:0,
      filterData
    })
    this.getCateList()
    this.getTotalMoney()
  },
  //获取仓库总金额
  getTotalMoney(){
    var url = app.globalData.baseUrl + 'apiStock/stock/inst/money'
    util.getRequestList(url, false, this.totalMoneyRes)
  },
  totalMoneyRes(res){
    if(res.data.code=200){
      this.setData({
        totalMoney: util.getMoney(res.data.content).toLocaleString()
      })
    }
  },
  //获取仓库位置列表
  getLocationList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/location/list'
    var data = {
      pageSize: 9999,
      pageNum: 1
    }
    util.getRequestListData(url, data, false, this.locListRes)
  },
  locListRes: function(res) {
    wx.hideLoading()
    var list = res.data.content.list
    var item = {
      keyId: -1,
      locationName: '全部'
    }
    list.unshift(item)
    this.setData({
      stockList: list
    })
    let filterData=this.data.filterData
    filterData.cateId=this.data.cateList[this.data.cateIndex].keyId
    filterData.locationId=this.data.stockList[this.data.stockIndex].keyId
    this.getGoodList(filterData,'refresh')
  },
  //获取分类列表
  getCateList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res) {
    var list = res.data.content
    for (var item of list) {
      item.nextList = JSON.parse(item.nextList)
    }
    list.unshift({
      keyId: -1,
      cateName: '全部',
      nextList: []
    })
    this.setData({
      cateList: list
    })
    this.getLocationList()
  },
  //获取仓库商品列表
  getGoodList: function(data,type) {
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/list'
    util.getRequestListData(url, data, type, this.goodListRes)
  },
  goodListRes(res,type) {
    if (res.data.code == 200) {
      let list = res.data.content.list
      let hasNextPage=res.data.content.hasNextPage
      console.log(hasNextPage)
      for (var item of list) {
        var time = util.formatTime(item.lastTime)
        item.totalMoney = util.getMoney(item.totalMoney).toLocaleString()
        item.lastTime = time
      }
      if(type==='refresh'){
        this.setData({goodList:list})
      }
      if(type==='reachBottom'){
        let goodList=this.data.goodList
        list.forEach(item=>{
          goodList.push(item)
        })
        this.setData({goodList})
      }
      this.setData({
        hasNextPage,
        total:res.data.content.total
      })
      console.log(this.data.hasNextPage)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCateList()
    this.getTotalMoney()
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