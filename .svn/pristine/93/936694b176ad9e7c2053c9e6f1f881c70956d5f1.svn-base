// pages/stock/stock-in/stock-in.js
var util = require('../../../utils/util.js');
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proCateList: [],
    multiProArray: [],//类别数组
    multiProIndex: [0,0],
    oldMultiProIndex:'[0,0]',
    multiCateName:'请选择货品分类',
    locationList:[],
    locationIndex:0,
    selLocationName:'请选择仓库位置',
    unitList: [],
    unitIndex:0,
    selUnitName:'请选择单位',
    proInfo :{
      cateId: '',
      locationId: '',
      goodsName: '',
      goodsUnit: '',
      goodsPic: '/utils/img/upload.png',
      description: '',
    },
    proInfoRules:{
      cateId: {require:true,msg:'请选择货品类别'},
      goodsName: {require:true,msg:'请输入货品名称'},
      goodsUnit: {require:true,msg:'请选择货品规格'},
      goodsPic: {require:true,msg:'请选上传货品图片'},
    },
    pageInType:'',
    methodKey:'',
    isNewPage:true
  },
  //数据初始化
  initData(){
    let proInfo=this.data.proInfo
    proInfo.goodsName=''
    proInfo.description=''
    proInfo.goodsPic='/utils/img/upload.png'
    this.setData({proInfo})
  },
  //去设置分类
  toSetCate(e){
    wx.navigateTo({
      url: '/pages/stock/stock-system-category/stock-system-category',
    })
    this.setData({isNewPage:false})
  },
  //去设置仓库货品
  toSetCatePro(){
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-in',
    })
  },
  //商品分类改变
  bindCateChange(e) {
    let val = e.detail.value
    let fi=val[0]
    let si=val[1]
    let multiProArray = this.data.multiProArray
    let cateId = multiProArray[1][si].keyId
    let multiCateName = multiProArray[0][fi].cateName + '/' + multiProArray[1][si].cateName
    let proInfo = this.data.proInfo
    proInfo.cateId = cateId
    let oldMultiProIndex=JSON.stringify(val)
    this.setData({
      multiCateName,
      proInfo,
      oldMultiProIndex
    })
  },
  bindCateCancel(e){
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let arr=JSON.parse(this.data.oldMultiProIndex)
    data.multiProIndex[0] = arr[0]
    data.multiProIndex[1]=arr[1]
    let index=arr[0]
    let si=arr[1]
    let cateId = this.data.multiProArray[0][index].keyId
    let obj = ''
    cateList.forEach(item => {
      if (item.keyId === cateId) {
        obj = item.nextList
      }
    })
    let nextList = JSON.parse(obj)
    data.multiProArray[1] = nextList
    let multiCateName = data.multiProArray[0][index].cateName + '/' + data.multiProArray[1][si].cateName
    let proInfo=this.data.proInfo
    proInfo.cateId=data.multiProArray[1][si].keyId
    this.setData({multiCateName,proInfo})
    this.setData(data)
  },
  bindCateColumnChange(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let proInfo=this.data.proInfo
    console.log(cateList)
    let multiCateName = ''
    let columnIndex = e.detail.column
    data.multiProIndex[columnIndex] = e.detail.value;
    switch (columnIndex) {
      case 0:
        let fi_0=e.detail.value
        let cateId = data.multiProArray[columnIndex][fi_0].keyId
        let obj = ''
        cateList.forEach(item => {
          if (item.keyId === cateId) {
            obj = item.nextList
          }
        })
        let nextList = JSON.parse(obj)
        data.multiProArray[1] = nextList
        data.multiProIndex[1] = 0;
        multiCateName = data.multiProArray[0][fi_0].cateName + '/' + data.multiProArray[1][0].cateName
        proInfo.cateId=data.multiProArray[1][0].keyId
        break;
      case 1:
        data.multiProIndex[1] = e.detail.value;
        let fi_1= data.multiProIndex[0]
        let si_1= data.multiProIndex[1]
        multiCateName = data.multiProArray[0][fi_1].cateName + '/' + data.multiProArray[1][si_1].cateName
        proInfo.cateId=data.multiProArray[1][si_1].keyId
      break;
    }
    this.setData(data);
    this.setData({multiCateName,proInfo})
  },

  //选择货品规格
  bindUnitChange(e) {
    console.log(e)
    let index = parseInt(e.detail.value)
    let unitList = this.data.unitList
    let selUnitName=unitList[index]
    let proInfo = this.data.proInfo
    proInfo.goodsUnit = selUnitName
    this.setData({proInfo,selUnitName})
  },
  bindUnitCancel(e) {

  },
  //去选择库存位置
  bindLocatinoChange(e) {
    console.log(e)
    let index = parseInt(e.detail.value)
    let list = this.data.locationList
    let locationId = list[index].keyId
    let proInfo = this.data.proInfo
    proInfo.locationId = locationId
    let selLocationName=list[index].locationName
    this.setData({
      proInfo,
      locationIndex:index,
      selLocationName,
    })
  },
  bindLocatinoCancel(e) {

  },
  //货品名称赋值
  bindNameInput(e){
    console.log(e)
    this.setData({
      ['proInfo.goodsName']:e.detail.value
    })
  },
  //选择图片
  upImage() {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var files = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.fileUploadUrl + '/apiUser/file/upload',
          filePath: files[0],
          name: 'file',
          header: {
            Authorization: wx.getStorageSync('localToken').token
          },
          success(res) {
            console.log(res)
            let proInfo=that.data.proInfo
            proInfo.goodsPic=JSON.parse(res.data).content
            that.setData({
              proInfo
            })
          }
        })
      },
    })
  },
  
  //获取描述
  getDes(e) {
    this.setData({
      ['proInfo.description']: e.detail.value
    })
  },
  //提醒消息
  warnInfo(msg){
    Notify({type: 'warning',message: msg});
  },
  //新增货品
  addGoods: function() {
    let rules=this.data.proInfoRules
    let proInfo = this.data.proInfo
    for(let key in rules){
      if(key==='goodsPic'){
        if(proInfo.goodsPic.indexOf('utils')>0){
          this.warnInfo(rules[key].msg)
          return
        }
      }else{
        if(rules[key].require&&!proInfo[key]){
          this.warnInfo(rules[key].msg)
          return
        }
      }
      
    }
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/new'
    util.postRequestList(url, proInfo, false, this.addRes)
  },
  addRes(res) {
    if (res.data.code == 200) {
      if(this.data.pageInType==='hanleOrder'){
        let cateId=res.data.content.cateId
        let stockId=res.data.content.keyId
        let method=this.data.methodKey
        let prevPage=util.getPrevPage()
        prevPage[method](cateId,stockId)
        this.backPrevPage()
      }
      if(this.data.pageInType==='proAdd'){
        this.backPrevPage()
      }
      if(this.data.pageInType==='fromList'){
        let method=this.data.methodKey
        let prevPage=util.getPrevPage()
        prevPage[method]()
        this.backPrevPage()
      }
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  //返回上一页
  backPrevPage(){
    wx.showToast({
      icon: 'success',
      title: '添加成功',
      duration:2000,
      mask:true,
      success:function(){
        wx.navigateBack({delta:1})
      }
    })
  },
  //获取分类列表
  getCateList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res,type) {
    if(res.data.code==='200'){
      let cateList = res.data.content
      let proInfo=this.data.proInfo
      console.log(cateList)
      let twoArr = []
      let multiProIndex = [0,0]
      let multiCateName='请选择货品类别'
      if(cateList.length){
        if(this.data.isNewPage){
          let nextList = JSON.parse(cateList[0].nextList)
          twoArr[0] = cateList
          twoArr[1] = nextList
          proInfo.cateId=nextList[0].keyId
        }else{
          let proInfo=this.data.proInfo
          let cateId=proInfo.cateId
          twoArr[0] = cateList
          cateList.forEach((item,fi)=>{
            let nl=JSON.parse(item.nextList)
            nl.forEach((val,si)=>{
              if(cateId===val.keyId){
                twoArr[1] = nl
                multiProIndex[0]=fi
                multiProIndex[1]=si
                multiCateName = item.cateName + '/' +val.cateName
              }
            })
          })
        }
        let oldMultiProIndex=JSON.stringify(multiProIndex)
        this.setData({
          multiCateName,
          multiProIndex,
          oldMultiProIndex,
          multiProArray: twoArr,
          proCateList:cateList
        })
      }else{  
        this.setData({
          multiCateName,
          multiProIndex,
          proInfo
        })
      }
    }
  },
  //获取单位名称
  getUnitList() {
    var url = app.globalData.baseUrl + 'apiStock/default/unit/list'
    util.getRequestList(url, false, this.unitListRes)
  },
  unitListRes(res,type) {
    if(res.data.code==='200'){
      let unitList=res.data.content
      if(unitList.length){
        let proInfo=this.data.proInfo
        if(unitList.length){
          this.setData({
            unitList,
            proInfo
          })
        }
      }
    }
  },
  //获取库存位置
  getLocationList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/location/list'
    var data = {
      pageSize: 5000,
      pageNum: 1
    }
    util.getRequestListData(url, data, false, this.locationListRes)
  },
  locationListRes(res,type) {
    if(res.data.code==='200'){
      let locationList=res.data.content.list
      let proInfo=this.data.proInfo
      console.log(locationList)
      if(locationList.length){
        proInfo.locationId=locationList[0].keyId
        let locationIndex=0
        let  selLocationName=locationList[0].locationName
        this.setData({
          locationList,
          proInfo,
          locationIndex,
          selLocationName
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let pageInType=options.pageInType
    let methodKey=options.methodKey
    if(methodKey&&methodKey!='undefined'){
      this.setData({methodKey})
    }
    this.setData({pageInType})
    this.getCateList()
    this.getUnitList()
    this.getLocationList()
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
    // if(!this.data.isNewPage){
    //   this.getCateList()
    // }
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