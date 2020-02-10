// pages/common/address-review/address-review.js
let util = require('../../../utils/util.js');
const app = getApp()
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
let timer=null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    polyline:[],
    destLocation:{
      longitude:'',
      latitude:'',
    },
    fromLocation:{
      longitude:'',
      latitude:'',
    },
    centerLocation:{
      longitude:'',
      latitude:'',
    },
    scale:16,
    distance: '',
    duration: '',
    orderId:0,
    scaleLevel:[
      {level:18,mult:25},
      {level:17,mult:50},
      {level:16,mult:100},
      {level:15,mult:200},
      {level:14,mult:500},
      {level:13,mult:1000},
      {level:12,mult:2000},
      {level:11,mult:5000},
      {level:10,mult:10000},
      {level:9,mult:20000},
      {level:8,mult:30000},
      {level:7,mult:50000},
      {level:6,mult:100000},
      {level:5,mult:200000},
    ],
    hasDelivery:false
  },
  //测算路程及时间
  getWay() {
    var _this = this
    qqmapsdk.direction({
      mode: 'bicycling', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      from:_this.data.fromLocation,
      to:_this.data.destLocation,
      success: function(res) {
        console.log(res);
        let route=res.result.routes[0]
        let coors=route.polyline
        let pl=[]
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        let distance=route.distance
        let curMult=Math.ceil(distance/7)
        console.log(curMult)
        let scaleLevel=_this.data.scaleLevel
        let scale=16
        for(let i=0;i<scaleLevel.length;i++){
          if(curMult<scaleLevel[i].mult){
            console.log(scaleLevel[i].mult)
            scale=scaleLevel[i].level
            break;
          }
        }
        console.log(scale)
        // console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          distance: _this.getDis(route.distance),
          duration: route.duration + "分钟",
          scale:scale,
          polyline: [{
            points: pl,
            color: '#FE2200',
            width: 4
          }],
          hasDelivery:true
        })
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        // console.log(res);
      }
    });
  },
  getDis(data) {
    // var distance = 700;
    if (data < 1000) {
      data = data + "米";
    } else if (data > 1000) {
      data = (Math.round(data / 100) / 10).toFixed(1) + "公里"
    }
    return data
  },
  //获取路径点
  getPathPoint(id){
    let url = app.globalData.baseUrl + 'apiMall/delivery/orderPos'
    util.getRequestListData(url, { orderId: id }, false, this.pathPointRes)
  },
  pathPointRes(res,type){
    if(res.data.code==='200'){
      let points=res.data.content
      let point=points[0]
      let latitude=point.latitude
      let longitude=point.longitude
      let fromLocation={
        latitude:latitude,//	纬度
        longitude:longitude,//	经度
      }
      let destLocation=this.data.destLocation
      let clatTal=util.accAdd(destLocation.latitude,latitude)
      let clgtTal=util.accAdd(destLocation.longitude,longitude)
      let centerLocation={
        latitude:util.accDiv(clatTal,2),//	纬度
        longitude:util.accDiv(clgtTal,2),//	经度
      }
      this.setData({centerLocation})
      let markers=this.data.markers
      markers.push(fromLocation)
      this.setData({
        markers,
        fromLocation
      })
      this.getWay()
    }
  },
  //设置中心坐标
  // setCenterPoint(latitude,longitude){
  //   let mark={
  //     latitude:latitude,//	纬度
  //     longitude:longitude,//	经度	
  //   }
  //   let markers=[]
  //   markers.push(mark)
  //   this.setData({
  //     centerLocation:mark,
  //     markers
  //   })
  // },
  //未配送或完成订单路径测算
  orderPathTest(latitude,longitude){
    let fromLocation={
      latitude:latitude,//	纬度
      longitude:longitude,//	经度
    }
    let destLocation=this.data.destLocation
    let clatTal=util.accAdd(destLocation.latitude,latitude)
    let clgtTal=util.accAdd(destLocation.longitude,longitude)
    let centerLocation={
      latitude:util.accDiv(clatTal,2),//	纬度
      longitude:util.accDiv(clgtTal,2),//	经度
    }
    let markers=this.data.markers
    markers.push(fromLocation)
    this.setData({
      markers,
      fromLocation,
      centerLocation
    })
    this.getWay()
  },
  //获取订单详情
  getOrderDetail() {
    var url = app.globalData.baseUrl + 'apiMall/order/inst/detail'
    var data = {
      orderId: this.data.orderId
    }
    util.getRequestListData(url, data, false, this.detailRes)
  },
  detailRes(res) {
    if (res.data.code == 200) {
      console.log(res)
      let list=res.data.content
      let ds=list.deliveryStatus
      let latitude=Number(list.latitude) 
      let longitude=Number(list.longitude)
      if(ds&&ds!=='null'){
        let buyLatitude=Number(list.buyLatitude)
        let buyLongitude=Number(list.buyLongitude)
        let deliveryStatus =parseInt(ds)
        let destLocation={
          latitude:buyLatitude,//	纬度
          longitude:buyLongitude,//
        }
        let md={
          latitude:buyLatitude,//	纬度
          longitude:buyLongitude,//
          label:{
            content:'终点',
            color:'#333',
            fontSize:16
          }	
        }
        let markers=[]
        markers.push(md)
        this.setData({destLocation,markers})
        if(deliveryStatus===0){
          this.getPathPoint(this.data.orderId)
          timer=setInterval(()=>{
            this.getPathPoint(this.data.orderId)
          },50000)
        }else{
          this.orderPathTest(latitude,longitude)
        }
        // if(deliveryStatus===1){
        //   this.setCenterPoint(latitude,longitude)
        // } 
      }else{
        this.setCenterPoint(latitude,longitude)
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    qqmapsdk = new QQMapWX({
      key: 'APYBZ-TKQ6X-GAJ4A-7CDCW-JHK4K-LFB2Q'
    });
    let orderId=options.orderId
    let pageInType=options.pageInType
    this.setData({pageInType,orderId})
    this.getOrderDetail()
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
    clearInterval(timer)
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