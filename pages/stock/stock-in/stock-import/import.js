// pages/stock/stock-in/stock-in.js
var util = require('../../../../utils/util.js');
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proCateList: [],
    multiProArray: [],//类别数组
    multiProIndex: [0,0],
    multiCateName:'请选择货品分类',
    locationList:[],
    locationIndex:0,
    selLocationName:'请选择仓库位置',
    proList:[],
    proInfo :{
      defaultIds:[],
      cateId:'',
      locationId:''
    },
    proInfoRules:{
      cateId: {require:true,msg:'请选择货品类别'}
    },
    pageInType:'',
    methodKey:'',
    isNewPage:true
  },
  //去设置分类
  toSetCate(e){
    wx.navigateTo({
      url: '/pages/stock/stock-system-category/stock-system-category',
    })
    this.setData({isNewPage:false})
  },
  //去添加模板货品
  handleAddPro(){
    wx.navigateTo({
      url: '/pages/stock/stock-in/add-pro/add',
    })
  },
  //去导入模板货品
  handleImportPro(){
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-tpl/tpl?pageInType=fromAdd',
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
    this.setData({
      multiCateName,
      proInfo,
    })
  },
  bindCateColumnChange(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let proInfo = this.data.proInfo
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
        proInfo.cateId = data.multiProArray[1][0].keyId
        break;
      case 1:
        data.multiProIndex[1] = e.detail.value;
        let fi_1= data.multiProIndex[0]
        let si_1= data.multiProIndex[1]
        multiCateName = data.multiProArray[0][fi_1].cateName + '/' + data.multiProArray[1][si_1].cateName
        proInfo.cateId = data.multiProArray[1][si_1].keyId
      break;
    }
    this.setData(data);
    this.setData({multiCateName,proInfo})
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
  //删除选中模板
  delSelPro(e){
    let index=parseInt(e.currentTarget.dataset.index) 
    let proList=this.data.proList
    proList.splice(index,1)
    this.setData({proList})
  },
  //提醒消息
  warnInfo(msg){
    Notify({type: 'warning',message: msg});
  },
  //提交数据
  addSubmit(){
    let proList=this.data.proList
    let proInfo=this.data.proInfo
    if(!proList.length){
      this.warnInfo('请添加货品')
      return
    }
    if(!proInfo.cateId){
      this.warnInfo('请选择货品类别')
      return
    }
    let ids=[]
    proList.forEach(item=>{
      ids.push(item.keyId)
    })
    let data={
      defaultIds:ids,
      cateId:proInfo.cateId,
      locationId:proInfo.locationId
    }
    this.selProRequest(data)
  },
  //选好数据//stock/inst/initDefault
  selProRequest(data){
    wx.showLoading({
      title: '提交中...',
      mask:true
    })
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/initDefault'
    util.postRequestList(url, data, false, this.selAddRes)
  },
  selAddRes(res,type){
    wx.hideLoading()
    if(res.data.code=='200'){
      console.log(this.data.pageInType)
      if(this.data.pageInType==='fromList'){
        let method=this.data.methodKey
        console.log(method)
        let prevPage=util.getPrevPage()
        prevPage[method]()
      }
      wx.showToast({
        title: '添加成功',
        duration:2000,
        mask:true,
        success:function(){
          wx.navigateBack({
            delta:1,
            complete: (res) => {},
          })
        }
      })
    }else{
      wx.showToast({
        title: res.data.message,
        icon:'none'
      })
    }
  },
  //获取分类列表
  getCateList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res,type) {
    if(res.data.code==='200'){
      let cateList = res.data.content
      console.log(cateList)
      let twoArr = []
      let multiProIndex = [0,0]
      let multiCateName='请选择货品类别'
      if(cateList.length){
        if(this.data.isNewPage){
          console.log(111)
          let nextList = JSON.parse(cateList[0].nextList)
          twoArr[0] = cateList
          twoArr[1] = nextList
        
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
        this.setData({
          multiCateName,
          multiProIndex,
          multiProArray: twoArr,
          proCateList:cateList
        })
      }else{  
        this.setData({
          multiCateName,
          multiProIndex,
        })
      }
    }
  },
  //获取库存位置
  getLocationList() {
    var url = app.globalData.baseUrl + 'apiStock/stock/location/list'
    var data = {
      pageSize: 9999,
      pageNum: 1
    }
    util.getRequestListData(url, data, false, this.locationListRes)
  },
  locationListRes(res,type) {
    if(res.data.code==='200'){
      let locationList=res.data.content.list
      this.setData({
        locationList
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(options.list){
      let proListStr=options.list
      let proListStr1 = proListStr.replace(/\*/g, '?')
      let proInfoStr2 = proListStr1.replace(/\#/g, '&')
      let proInfoStr3 = proInfoStr2.replace(/\$/g, '=')
      let proList=JSON.parse(proInfoStr3) 
      this.setData({proList})
    }
    let pageInType=options.pageInType
    let methodKey=options.method
    if(methodKey&&methodKey!='undefined'){
      this.setData({methodKey})
    }
    this.setData({pageInType})
    this.getCateList()
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
    if(!this.data.isNewPage){
      this.getCateList()
    }
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