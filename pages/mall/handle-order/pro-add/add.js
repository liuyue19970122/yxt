// pages/mall/handle-order/pro-add/add.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
// Notify({ type: 'danger', message: proInfoRules[key].msg });
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType:'add',
    editProInfoIndex:0,
    proCateList: [],
    cateDisabled:false,
    multiProArray: [],//类别数组
    multiProIndex: [0,0],
    multiCateName:'',
    stockProList: [],//分类库存商品
    stockProIndex: 0,
    stockName:'请选择商品库存归属',
    stockDisabled:false,
    locationName:'',
    nameDisabled:false,
    proInfo:{
      isNew:'0',
      cusAgain:'0',
      cateId:'',
      stockId:'',
      locationId:'',
      stockName:'',
      perMoney:'',
      stockUnit: '',
      count:'',
    },
    proInfoRules:{
      cateId: { required: true, msg: '请选择类别' },
      stockId: { required: true, msg: '请选择库存归属' },
      stockName: {required:true,msg:'请输入货品名称'},
      stockUnit: { required: true, msg: '请输入货品单位' },
      perMoney: { required: true, msg: '请输入货品单价' },
      count: { required: true, msg: '请输入货品数量' }
    }
  },
  //去设置分类
  toSetCate(e){
    wx.navigateTo({
      url: '/pages/stock/stock-system-category/stock-system-category?pageInType=hanleOrder&methodKey=refreshCateData',
    })
  },
  refreshCateData(cateId,stockId){
    console.log(cateId,stockId)
    let proInfo=this.data.proInfo
    proInfo.cateId=parseInt(cateId)
    proInfo.stockId=stockId
    this.setData({proInfo})
    let url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, false, this.refreshCateRes)
  },
  refreshCateRes(res,type){
    if(res.data.code==='200'){
      let cateList=res.data.content
      let cateId=this.data.proInfo.cateId
      let twoArr = []
      twoArr[0]=cateList
      let multiProIndex = [0,0]
      let multiCateName=''
      cateList.forEach((item, fi) => {
        let nextList = JSON.parse(item.nextList)
        nextList.forEach((val,si)=>{
          if (val.keyId === cateId){
            console.log(cateId)
            console.log( val.keyId)
            multiProIndex[0] = fi
            multiProIndex[1]=si
            twoArr[1] = JSON.parse(cateList[fi].nextList)
            multiCateName = item.cateName + '/' + val.cateName
          }
        })
      })
      this.setData({
        proCateList: cateList,
        multiProArray: twoArr,
        multiCateName,
        multiProIndex
      })
      this.refreshStorageList(cateId)
    }else{
      wx.showToast({
        title: res.data.message,
        icon:'none'
      })
    }
  },
  //刷新库存商品数据
  refreshStorageList(cateId){
    let data = {
      cateId: cateId,
      locationId: '',
      goodsName: '',
      warnFlag: '0',
      pageNum: 1,
      pageSize: 9999
    }
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/list'
    util.getRequestListData(url, data, false, this.refreshStorageRes)
  },
  refreshStorageRes(res,type){
    if(res.data.code==='200'){
      let list=res.data.content.list
      let stockId = this.data.proInfo.stockId
      let spi = ''
      list.forEach((item, index) => {
        if (item.keyId === stockId) {
          spi = index
        }
      })
      this.setData({
        ['proInfo.stockName']: list[spi].goodsName,
        ['proInfo.stockUnit']: list[spi].goodsUnit,
        stockProList: list,
        stockName:list[spi].goodsName,
        stockProIndex:spi,
        locationName:list[spi].locationName?list[spi].locationName:'无'
      })
    }else{
      wx.showToast({
        title: res.data.message,
        icon:'none'
      })
    }
  },
  //去设置仓库货品
  toSetCatePro(){
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-in?pageInType=hanleOrder&methodKey=refreshCateData',
    })
  },
  //商品分类改变
  bindCateChange(e) {
    let val = e.detail.value
    let fi=val[0]
    let si=val[1]
    console.log(val)
    let multiProArray = this.data.multiProArray
    console.log(multiProArray)
    let cateId = multiProArray[1][si].keyId
    let multiCateName = multiProArray[0][fi].cateName + '/' + multiProArray[1][si].cateName
    let proInfo = this.data.proInfo
    proInfo.cateId = cateId
    let actType = 'change'
    this.setData({
      multiCateName,
      proInfo
    })
    this.getStorageProList(cateId, actType)
  },
  bindCateCancel(e) {
    
  },
  bindCateColumnChange(e) {
    let data = {
      multiProArray: this.data.multiProArray,
    };
    let cateList = this.data.proCateList
    let columnIndex = e.detail.column
    switch (columnIndex) {
      case 0:
        let cateId = data.multiProArray[columnIndex][e.detail.value].keyId
        let obj = ''
        cateList.forEach(item => {
          if (item.keyId === cateId) {
            obj = item.nextList
          }
        })
        let nextList = JSON.parse(obj)
        data.multiProArray[1] = nextList
        break;
    }
    this.setData(data);
  },

  //去选择库存产品
  bindStockChange(e) {
    let index = parseInt(e.detail.value)
    let list = this.data.stockProList
    let stockId = list[index].keyId
    let stockName = list[index].goodsName
    let stockUnit = list[index].goodsUnit
    console.log(stockName)
    let proInfo = this.data.proInfo
    proInfo.stockId = stockId
    proInfo.stockName = stockName
    proInfo.stockUnit = stockUnit
    let locationName=list[index].locationName?list[index].locationName:'无'
    this.setData({
      stockName,
      proInfo,
      locationName,
      stockProIndex: index
    })
  },
  bindStockCancel(e) {
    
  },
  //货品名称赋值
  bindNameInput(e){
    this.setData({
      ['proInfo.stockName']:e.detail.value
    })
  },
  //货品单价赋值
  bindMoneyInput(e) {
    let value = e.detail.value
    let val = util.clearNoNum(value)
    this.setData({
      ['proInfo.perMoney']: val
    })
  },
  //货品数量赋值
  bindCountInput(e) {
    let value = e.detail.value
    let val = util.clearNoNum(value)
    this.setData({
      ['proInfo.count']: val
    })
  },
  //删除该商品
  delCurPro(e){
    let _this=this
    if(this.data.pageType=='edit'){
      wx.showModal({
        title: '提示',
        content: '是否删除该商品',
        showCancel: true,
        success(res) {
          if (res.confirm) {
            let prevPage = util.getPrevPage()
            let proList = prevPage.data.proList
            let index = _this.data.proInfoIndex
            proList.splice(index, 1)
            prevPage.setData({ proList })
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  //上传
  //信息提示功能
  warnInfo(msg) {
    Notify({ type: 'warning', message: msg });
  },
  //bindSubmit提交商品添加
  bindSubmit(){
    let rules=this.data.proInfoRules
    let proInfo = this.data.proInfo
    for(let key in rules){
      if (rules[key].required && !proInfo[key]) {
        this.warnInfo(rules[key].msg)
        return;
      }
    }
    let prevPage = util.getPrevPage()
    let proList = prevPage.data.proList
    if(this.data.pageType==='add'){
      proList.push(proInfo)
    }
    if(this.data.pageType==='edit'){
      let index=this.data.proInfoIndex
      proList[index]=proInfo
    }
    prevPage.setData({ proList })
    wx.navigateBack({
      delta: 1
    })
  },
  //获取商品分类列表//apiStock/stock/cate/list
  getProCateList(actType) {
    let url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, actType, this.proCateListRes)
  },
  proCateListRes(res, actType) {
    if (res.data.code === '200') {
      let cateList = res.data.content
      // let nextList = JSON.parse(cateList[0].nextList)
      let twoArr = []
      let multiProIndex = [0,0]
      if(actType==='add'){
        let nextList = JSON.parse(cateList[0].nextList)
        twoArr[0] = cateList
        twoArr[1] = nextList
        let cateId = nextList[0].keyId
        let multiCateName = twoArr[0][0].cateName + '/' + twoArr[1][0].cateName
        let proInfo = this.data.proInfo
        proInfo.cateId = cateId
        this.setData({
          multiCateName,
          multiProIndex,
          proInfo
        })
        this.getStorageProList(cateId, actType)
      }
      if(actType==='edit'){
        twoArr[0] = cateList
        let proInfo=this.data.proInfo
        let cateId = proInfo.cateId
        // let stockId=proInfo.stockId
        let multiCateName=''
        let fi=0
        console.log(cateId)
        cateList.forEach((item, fi) => {
          let nextList = JSON.parse(item.nextList)
          nextList.forEach((val,si)=>{
            console.log(cateId)
            if (val.keyId === cateId){
              multiProIndex[0] = fi
              multiProIndex[1]=si
              fi=fi
              multiCateName = item.cateName + '/' + val.cateName
            }
          })
        })
        twoArr[1] = JSON.parse(cateList[fi].nextList)
        this.setData({
          multiCateName,
          multiProIndex,
          proInfo
        })
        this.getStorageProList(cateId, actType)
      }
      this.setData({
        proCateList: cateList,
        multiProArray: twoArr,
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  //获取仓库某类产品列表///stock/inst/list
  getStorageProList(cateId, actType) {
    console.log(actType)
    wx.showLoading({
      title: '加载中...',
    })
    let data = {
      cateId: cateId,
      locationId: '',//
      //仓库ID
      goodsName: '',
      //产品名称
      warnFlag: '0',
      //1是0否只显示告警
      pageNum: 1,
      pageSize: 9999
    }
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/list'
    util.getRequestListData(url, data, actType, this.storageProListRes)
    //getRequestListData = function (url, data,actType, callBack)
  },
  storageProListRes(res, actType) {
    wx.hideLoading()
    if(res.data.code==='200'){
      let list = res.data.content.list
      if (list.length) {
        list.forEach(item => {
          item.date = util.formatTime(item.lastTime)
          item.cusName = item.goodsName + '/' + item.goodsCount + item.goodsUnit
        })
        let stockProIndex = 0
        let stockName='请选择商品的库存归属'
        let locationName=''
        if (actType === 'edit') {
          let stockId = this.data.proInfo.stockId
          console.log(stockId)
          list.forEach((item, index) => {
            if (item.keyId === stockId) {
              stockProIndex = index
              stockName=list[index].goodsName
              locationName=list[index].locationName?list[index].locationName:'无'
            }
          })
        }
        if (actType === 'add' || actType === 'change') {
          stockProIndex = 0
          stockName = list[0].goodsName
          locationName=list[0].locationName?list[0].locationName:'无'
          this.setData({
            ['proInfo.stockId']: list[0].keyId,
            ['proInfo.stockName']: list[0].goodsName,
            ['proInfo.stockUnit']: list[0].goodsUnit
          })
        }
        this.setData({ 
          stockProList: list,
          stockProIndex,
          stockName,
          locationName
        })
      } else {
        if(actType==='change'){
          let stockName='请选择商品库存归属'
          this.setData({
            stockName,
            stockProList: [],
            ['proInfo.stockId']: '',
            ['proInfo.stockName']: '',
            ['proInfo.stockUnit']: ''
          })
        }
      }
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let actType=options.actType
    this.setData({ pageType: actType})
    if (actType==='edit'){
      let proInfo = JSON.parse(options.proInfo)
      let proInfoIndex = parseInt(options.index)
      let cusAgain=proInfo.cusAgain
      console.log(proInfo)
      if(cusAgain==='1'){
        this.setData({
          cateDisabled:true,
          stockDisabled:true,
          nameDisabled:true
        })
      }
      this.setData({ proInfo, proInfoIndex})
    }
    this.getProCateList(actType)
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