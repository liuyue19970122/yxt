// pages/mall/pro_details/detail.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType:'detail',
    picList: [],
    proSpecShow:false,
    specLsit:[],
    goodsInfo:{},
    detailInfo:'',
    dataReady:false
  },
  //查看商品规格详情
  handleScanSpec(){
    this.setData({
      proSpecShow: true
    })
  },
  //关闭商品规格详情
  closeProSpec(){
    this.setData({
      proSpecShow: false
    })
  },
  //获取商品实例详情///store/inst/detail
  //goodsId
  getProDetail(id, actType) {
    wx.showLoading({
      title:'加载中...',
      mask:true
    })
    let url = app.globalData.baseUrl + 'apiMall/store/inst/detail'
    let data = { goodsId: id }
    util.getRequestListData(url, data, actType, this.proDetailRes)
    //getRequestListData = function (url, data,actType, callBack)
  },
  proDetailRes(res, actType) {
    wx.hideLoading()
    if(res.data.code==='200'){
      let data = res.data.content
      let goodsInfo = data.goodsInfo
      let detailInfo = data.detailInfo
      let dtlStr=detailInfo.detail
      let dtlStr1=dtlStr.replace(/\<img/gi, '<img class="richImg" ')
      let imgList = data.imgList
      let picList=[]
      imgList.forEach(item=>{
        picList.push(item.url)
      })
      let attrList = data.attrList
      if(attrList.length){
        if(attrList.length>1){
          attrList.sort((a,b)=>{
            return a.attrPrice - b.attrPrice
          })
        }
        attrList.forEach(item=>{
          item.cusNormalPrice= util.getMoney(item.attrNormalPrice).toString() 
          item.cusSalePrice= util.getMoney(item.attrPrice).toString() 
        })
        goodsInfo.cusNormalPrice =attrList[0].cusNormalPrice
        goodsInfo.cusSalePrice = attrList[0].cusSalePrice
        goodsInfo.attrName = attrList[0].attrName
      }else{
        goodsInfo.cusNormalPrice ='暂未设置'
        goodsInfo.cusSalePrice = '暂未设置'
        goodsInfo.attrName = '暂未设置'
      }
      this.setData({
        picList: picList,
        goodsInfo: goodsInfo,
        detailInfo: dtlStr1,
        specLsit:attrList,
        dataReady:true
      })
      console.log(this.data.specLsit)
    }
  },
  //获取商品模板实例详情///store/default/detail
  //goodsId
  getTplDetail(id, actType) {
    wx.showLoading({
      title:'加载中...',
      mask:true
    })
    let url = app.globalData.baseUrl + 'apiMall/store/default/detail'
    let data = { goodsId: id }
    util.getRequestListData(url, data, actType, this.tplDetailRes)
    //getRequestListData = function (url, data,actType, callBack)
  },
  tplDetailRes(res, actType) {
    console.log(res)
    wx.hideLoading()
    if(res.data.code==='200'){
      let data = res.data.content
      let goodsInfo = data.goodsInfo
      let detailInfo = data.detailInfo
      let dtlStr=detailInfo.detail
      let dtlStr1=dtlStr.replace(/<img/gi, "<img class='richImg' ")
      let imgList = data.imgList
      let picList=[]
      imgList.forEach(item=>{
        picList.push(item.url)
      })
      let attrList = data.attrList
      if(attrList.length>1){
        attrList.sort((a,b)=>{
          return a.attrPrice - b.attrPrice
        })
      }
      attrList.forEach(item=>{
        item.cusNormalPrice= util.getMoney(item.attrNormalPrice).toString() 
        item.cusSalePrice= util.getMoney(item.attrPrice).toString() 
      })
      goodsInfo.cusNormalPrice =attrList[0].cusNormalPrice
      goodsInfo.cusSalePrice = attrList[0].cusSalePrice
      goodsInfo.attrName = attrList[0].attrName
      this.setData({
        picList: picList,
        goodsInfo: goodsInfo,
        detailInfo: dtlStr1,
        specLsit:attrList,
        dataReady:true
      })
      console.log(this.data.detailInfo)
      console.log(this.data.specLsit)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let actType=options.actType
    this.setData({pageType:actType})
    if(actType==='preview'){
      let infoStr = options.proInfo
      let infoStr1 = infoStr.replace(/\*\*/g, '=')
      let infoStr2 = infoStr1.replace(/\*/g,'&')
      let proData = JSON.parse(infoStr2) 
      let specLsit = JSON.parse(options.specLsit)
      if(specLsit.length){
        specLsit.forEach(item=>{
          if (item.normalPrice){
            let ap = util.accMul(item.normalPrice,100)
            item.cusNormalPrice = util.getMoney(ap).toString()
          }
          if (item.attrNormalPrice){
            let ap = util.accMul(item.attrNormalPrice, 100)
            item.cusNormalPrice = util.getMoney(ap).toString()
          }
          if (item.attrPrice){
            let ap = util.accMul(item.attrPrice, 100)
            item.cusSalePrice = util.getMoney(ap).toString()
          }
        })
        proData.cusNormalPrice=specLsit[0].cusNormalPrice
        proData.cusSalePrice=specLsit[0].cusSalePrice
        proData.attrName = specLsit[0].attrName
      }else{
        proData.cusNormalPrice='暂未设置'
        proData.cusSalePrice='暂未设置'
        proData.attrName = '暂未设置'
      }
      let imgListStr = options.imgList.replace(/\*\*/g, '=')
      let imgListStr1 = imgListStr.replace(/\*/g, '?')
      let imgList = JSON.parse(imgListStr1)
      console.log(proData)
      let dtlStr = proData.detail
      let dtlStr1=dtlStr.replace(/<img/gi, "<img class='richImg' ");
      this.setData({
        picList: imgList,
        goodsInfo: proData,
        detailInfo: dtlStr1,
        specLsit,
        dataReady:true
      })
      console.log(this.data.specLsit)
    }
    if(actType==='detail'){
      let id=options.id
      let actType=false
      this.getProDetail(id, actType)
    }
    if(actType==='tplDetail'){
      let id=options.id
      let actType=false
      this.getTplDetail(id, actType)
    }
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