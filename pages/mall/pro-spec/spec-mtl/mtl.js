// pages/mall/pro-spec/spec-mtl/mtl.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proName:'',
    specName:'',
    proCateList:[],
    multiProArray:[],//类别数组
    multiProIndex:[],
    oldMultiProIndex:[],
    selCateName:'请选择商品类别',
    stockProList:[],//分类库存商品
    stockProIndex:[],
    stockName:'请选择库存商品',
    oldStockProIndex:[],
    mtlInfo:{
     
      goodsName:'',
      goodsUnit:'',
      stockId:'',
      count:''
    },
    mtlInfoRules:{
      stockId:{required:true,msg:'请选择库存商品'},
      count:{required:true,msg:'请输入数量'}
    },
    goodsId:'',
    attrId:''
  },
   //商品分类改变
   bindCateChange(e){
    let val=e.detail.value
    let cateId=this.data.multiProArray[1][val[1]].keyId
    let actType=false
    this.setData({
      ['proInfo.cateId']:cateId,
    })
    let oldMultiProIndex=JSON.stringify(this.data.multiProIndex)
    let fi=val[0]
    let si=val[1]
    let selCateName=this.data.multiProArray[0][fi].cateName+'/'+this.data.multiProArray[1][si].cateName
    this.setData({oldMultiProIndex,selCateName})
    this.getStorageProList(cateId, actType)
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
    let cateId = this.data.multiProArray[0][index].keyId
    let obj = ''
    cateList.forEach(item => {
      if (item.keyId === cateId) {
        obj = item.nextList
      }
    })
    let nextList = JSON.parse(obj)
    data.multiProArray[1] = nextList
    let fi=data.multiProIndex[0]
    let si=data.multiProIndex[1]
    let selCateName=data.multiProArray[0][fi].cateName+'/'+data.multiProArray[1][si].cateName
    this.setData({selCateName})
    this.setData(data)
  },
  bindCateColumnChange(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let columnIndex = e.detail.column
    data.multiProIndex[columnIndex] = e.detail.value;
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
        data.multiProIndex[1] = 0;
        break;
      case 1:
        data.multiProIndex[1] = e.detail.value;
        break;
    }
    let fi=data.multiProIndex[0]
    let si=data.multiProIndex[1]
    let selCateName=data.multiProArray[0][fi].cateName+'/'+data.multiProArray[1][si].cateName
    this.setData({selCateName})
    this.setData(data);
  },
  
  //去选择库存产品
  bindStockChange(e){
    let index=parseInt(e.detail.value)
    let list=this.data.stockProList
    //console.log(list)
    let sd=list[index].keyId
    let gn=list[index].goodsName
    let goodsUnit=list[index].goodsUnit
    this.setData({
      ['mtlInfo.stockId']:sd,
      ['mtlInfo.goodsName']:gn,
      ['mtlInfo.goodsUnit']:goodsUnit,
      stockName:gn
    })
    //console.log(this.data.proInfo.stockId)
  },
  bindStockCancel(e){

  },
  //填写数量
  bindInputCount(e){
    this.setData({
      ['mtlInfo.count']:e.detail.value
    })
  },
  // 为某个商品增加规格
  submitMtlInfo(){
    let mtlInfo=this.data.mtlInfo
    let rules=this.data.mtlInfoRules
    let actType=this.data.actType
    for(let key in rules){
      if(rules[key].required){
        if(!mtlInfo[key]&&mtlInfo[key]===''){
          Notify({ type: 'warning', message: rules[key].msg });
          return;
        }
      }
    }
    if(actType==='add'){
      let prevPage =util.getPrevPage()  //上一个页面
      let mtlList=prevPage.data.mtlList
      mtlList.unshift(mtlInfo)
      prevPage.setData({mtlList})
      wx.navigateBack({delta:1})
    }
    if(actType==='edit'){
      let arr=[]
      let obj={
        count:mtlInfo.count,
        stockId:mtlInfo.stockId
      }
      arr.push(obj)
      let data={
        goodsId:this.data.goodsId,
        attrId:this.data.attrId,
        matInfo:JSON.stringify(arr)
      }
      this.addMtl(data)
    }
  },
  //添加规格/store/inst/setAttrMat
  //goodsId,attrId,matInfo
  addMtl(data){
    let url = app.globalData.baseUrl + 'apiMall/store/inst/setAttrMat'
    util.postRequestList(url, data,false, this.addMtlRes)
  },
  addMtlRes(res,type){
    console.log(res)
    if(res.data.code==='200'){
      let curPages=getCurrentPages()
      let prevTwoPage=curPages[curPages.length-3]
      let list=res.data.content
      let mtlInfo=list[0]
      let prevPage =util.getPrevPage()  //上一个页面
      let mtlList=prevPage.data.mtlList
      mtlList.unshift(mtlInfo)
      prevPage.setData({mtlList})
      let specList=prevTwoPage.data.specList
      let index=prevPage.data.specIndex
      specList[index].matInfo=JSON.stringify(mtlList)
      prevTwoPage.setData({specList})
      wx.navigateBack({delta:1})
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  //获取商品分类列表//apiStock/stock/cate/list
  getProCateList(actType) {
    let url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, actType, this.proCateListRes)
  },
  proCateListRes(res, actType) {
    console.log(res)
    if(res.data.code==='200'){
      let cateList = res.data.content
      let nextList = []
      let twoArr = []
      let multiProIndex = [0, 0]
      let selCateName='请选择商品类别'
      nextList = JSON.parse(cateList[0].nextList)
      twoArr[0] = cateList
      twoArr[1] = nextList
      let multiProIndexStr = JSON.stringify(multiProIndex)
      this.setData({
        proCateList: cateList,
        multiProArray: twoArr,
        multiProIndex: multiProIndex,
        oldMultiProIndex: multiProIndexStr,
        selCateName
      })
    }
  },
  //获取仓库某类产品列表///stock/inst/list
  getStorageProList(cateId, actType) {
    let  data = {
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
    console.log(res)
    let list = res.data.content.list
    if(list.length){
      list.forEach(item => {
        item.date = util.formatTime(item.lastTime)
        item.cusName = item.goodsName + '/' + item.goodsCount + item.goodsUnit
      })
      this.setData({
        stockProList: list
      })
      let stockProIndex = this.data.stockProIndex
      let stockName = '请选择库存商品'
      if (actType === 'edit') { 
        let stockId=this.data.proInfo.stockId
        list.forEach((item,index)=>{
          if(item.keyId===stockId){
            stockProIndex[0]=index
            stockName = item.goodsName
          }
        })
        this.setData({ 
          cateDisabled:true,
          stockDisabled:true,
        })
      }
      this.setData({ stockProIndex, stockName })
    }else{
      let stockName='请选择库存商品'
      this.setData({ 
        stockName,
        stockProList: list
      })
    }
    console.log(list)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let actType=options.proActType
    let sn=options.specName
    let pn=options.proName
    this.setData({
      actType,
      specName:sn,
      proName:pn
    })
    if(actType==='edit'){
      let attrId=options.attrId
      let goodsId=options.goodsId
      this.setData({attrId,goodsId})
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