//index.js
//获取应用实例
var util = require('../../utils/util.js');
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
var list = []
var list1 = []
var timer = ''
var timestamp = Date.parse(new Date())
var timer2 = ''
Page({
  data: {
    trendData: {},
    cWidth: '',
    cHeight: '',
    ec: {},
    isGong: true,
    isMsg: true,
    motto: 'Hello World',
    userInfo: {},
    value: '',
    background: '#FE2200',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    range: '0',
    token: '',
    rangeArray: [{
      id: '1',
      range: 'day',
      name: '日'
    }, {
      id: '2',
      range: 'month',
      name: '月'
    }, {
      id: '2',
      range: 'quarter',
      name: '季'
    }],
    isRefreshing:false,
    menuList: [],
    warnTotal: 0,
    orderList: [],
    orderTotal: 0,
    startPoint: '',
    btnTop: 750,
    windowHeight: '',
    windowWidth: '',
    isIpx: false,
    timeIndex: 0,
    bannerList: [],
    totalData: {},
    noReadCount: 0,
  },
  getTrend() {
    
    var url = app.globalData.baseUrl + 'apiMall/index/trend'
    var data = {
      type: this.data.rangeArray[this.data.timeIndex].range
    }
    util.getRequestListData(url, data, false, this.trendRes)
  },
  refresh(){
    this.setData({
      isRefreshing: true
    })
    this.getTrend()
  },
  trendRes(res) {
    var obj = res.data.content
    setTimeout(()=>{
      this.setData({
        isRefreshing: false
      })
    },1000)
    for (var i in obj) {
      for (var j in obj[i]) {
        if (j != 'attrName') {
          obj[i][j] = util.getMoney(obj[i][j])
        }
      }
    }
    this.setData({
      trendData: obj
    })
    this.initChart()
  },
  initChart() {
    this.echartsComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(chart);
      var option = this.getOption()
      chart.setOption(option);
      return chart;
    })
  },
  getOption() {
    var trendData = this.data.trendData
    var xData = []
    var profitData = []
    var buyData = []
    var sellData = []
    for (var i in trendData) {
      xData.push(trendData[i].attrName)
      profitData.push(trendData[i].profit)
      buyData.push(trendData[i].buy)
      sellData.push(trendData[i].sell)
    }
    var option = {
      color: ["#ca4f4b", "#88afff", "#ebde30"],
      legend: {
        itemHeight: 14,
        itemWidth: 14,
        selectedMode: false,
        data: [{
            name: '收入',
            icon: 'rect',
          },
          {
            name: '支出',
            icon: 'rect',
          },
          {
            name: '利润',
            icon: 'rect',
          }
        ],
        top: 0,
        left: 'center',
        backgroundColor: '#fff',
        z: 100,
        textStyle: {
          fontSize: 14
        }
      },
      grid: {
        containLabel: true,
        left: 12,
        top: 40,
        bottom: 0,
        right: 20
      },
      tooltip: {
        show: true,
        trigger: 'none'
      },
      toolbox: {
        show: true,
        orient: 'horizontal',
        feature: {
          restore: {
            show: true
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xData,
        axisLabel: {
          fontSize: 14,
        },
        rich: {},
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          }
        },
        axisLabel: {
          fontSize: 14,
        },
        rich: {},
      },
      series: [{
        name: '收入',
        type: 'line',
        smooth: true,
        data: sellData
      }, {
        name: '支出',
        type: 'line',
        smooth: true,
        data: buyData
      }, {
        name: '利润',
        type: 'line',
        smooth: true,
        data: profitData
      }, ],
    };
    return option
  },
  bindBuyMeal() {
    wx.navigateTo({
      url: '/pages/receipt/table-list/list?type=choose',
    })
  },
  getBannerList() {
    var url = app.globalData.baseUrl + 'apiUser/banner/list'
    util.getRequestList(url, false, this.getBannerRes)
  },
  getBannerRes(res) {
    this.setData({
      bannerList: res.data.content
    })
  },
  getTotalData() {
    var url = app.globalData.baseUrl + 'apiMall/index/total'
    util.getRequestList(url, false, this.getTotalRes)
  },
  getTotalRes(res) {
    if (res.data.code == 200) {
      var totalData = res.data.content
      var monthProfit = util.getMoney(totalData.monthProfit)
      var monthSell = util.getMoney(totalData.monthSell)
      var monthSell = util.getMoney(totalData.monthSell)
      var todaySell = util.getMoney(totalData.todaySell)
      totalData.monthProfit = util.formatMoney(util.getMoney(totalData.monthProfit))
      totalData.monthSell = util.formatMoney(util.getMoney(totalData.monthSell))
      totalData.todayBuy = util.formatMoney(util.getMoney(totalData.todayBuy))
      totalData.todaySell = util.formatMoney(util.getMoney(totalData.todaySell))
      this.setData({
        totalData
      })
    }
  },
  getWarnList: function() {
    // var url = app.globalData.baseUrl + 'apiStock/stock/inst/warnList'
    var url = app.globalData.baseUrl + 'apiStock/stock/inst/list'
    var data={
      warnFlag:1
    }
    util.getRequestListData(url, data, false,this.listRes)
  },
  listRes(res) {
    this.setData({
      warnTotal: res.data.content.total
    })
  },
  getOrderList() {
    if (this.data.isGong) {
      var url = app.globalData.baseUrl + 'apiMall/order/admin/list'
      var data = {
        status: 1
      }
    } else {
      var url = app.globalData.baseUrl + 'apiMall/food/order/list'
      var data = {
        status: 0
      }
    }
    util.getRequestListData(url, data, false, this.orderlistRes)
  },
  orderlistRes(res) {
    this.setData({
      orderTotal: res.data.content.total
    })
  },
  goWarn: function() {
    wx.navigateTo({
      url: '../stock/stock-change/stock-change?flag=true',
    })
    // wx.navigateTo({
    //   url: '../stock/stock-warn/list',
    // })
  },
  goOrder() {
    if (this.data.isGong) {
      wx.navigateTo({
        url: '/pages/mall/mall-order/ghs-manager/manager?status=1',
      })
    } else {
      wx.navigateTo({
        url: '/pages/receipt/order-record/list?status=0',
      })
    }
  },
  goHandleOrder: function() {
    wx.navigateTo({
      url: '/pages/mall/handle-order/handle-order',
    })
  },
  unlogin() {
    wx.stopLocationUpdate()
    wx.removeStorageSync("localToken")
    wx.redirectTo({
      url: '/pages/common/login/login',
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onSearch: function() {},
  onCancel: function() {},
  getMenuList() {
    var url = app.globalData.baseUrl + 'apiUser/menu/list?t=' + timestamp
    util.getRequestList(url, false, this.menuRes)
  },
  menuRes(res) {
    var menuList = res.data.content
    var list = []
    for (var item of menuList) {
      var jtem = {
        icon: item.logoUrl,
        isClose: true,
        title: item.menuName,
        id: item.keyId,
        nextMenu: JSON.parse(item.nextMenu)
      }
      list.push(jtem)
    }
    this.setData({
      menuList: list
    })
  },
  getNoRead() {
    var url = app.globalData.baseUrl + 'apiMall//msg/noReadCount'
    util.getRequestList(url, false, this.noReadRes)
  },
  noReadRes(res) {
    if (res.data.code == 200) {
      this.setData({
        noReadCount: res.data.content
      })
    }
  },
  bindGoMall() {
    if (!this.data.isGong) {
      wx.navigateTo({
        url: '/pages/mall/mall-store/store',
      })
    }
  },
  onShow() {
    this.getWarnList()
    this.getTotalData()
    this.getBannerList()
    this.getNoRead()
    this.getTrend()
    var userInfo = wx.getStorageSync('localToken').userInfo
    wx.setNavigationBarTitle({
      title: userInfo.orgName,
    })
    if (userInfo.orgType == '1') {
      this.setData({
        isGong: true
      })
      this.getOrderList()
    } else {
      this.setData({
        isGong: false
      })
    }
    timer = setInterval(() => {
      this.getNoRead()
      this.getWarnList()
      this.getOrderList()
      this.getTotalData()
    }, 3000)
    var token = wx.getStorageSync("localToken").token
    this.setData({
      token: token
    })
  },
  // 刷新按钮开始移动
  buttonStart(e) {
    // 获取起始点
    this.setData({
      startPoint: e.touches[0]
    })
  },
  buttonMove(e) {
    let {
      windowWidth,
      windowHeight,
      btnTop,
      startPoint,
      isIpx
    } = this.data
    // 获取结束点
    let endPoint = e.touches[e.touches.length - 1]
    // 计算移动距离相差
    let translateX = endPoint.clientX - startPoint.clientX
    let translateY = endPoint.clientY - startPoint.clientY
    // 初始化
    startPoint = endPoint
    // 赋值
    btnTop = btnTop + translateY
    // 根据屏幕匹配临界值
    let topSpace = 100
    if (isIpx) {
      topSpace = 134
    } else {
      topSpace = 100
    }
    if (btnTop + topSpace >= windowHeight) {
      btnTop = windowHeight - topSpace
    }
    // 顶部tab临界值
    if (btnTop <= 43) {
      btnTop = 43
    }
    this.setData({
      btnTop: btnTop,
      startPoint: startPoint
    })
  },
  selectTime(e) {
    this.setData({
      timeIndex: e.currentTarget.dataset.index
    })
    this.getTrend()
  },
  //实时上传位置///delivery/position
  //longitude,latitude
  liveUploadLocation(data) {
    let url = app.globalData.baseUrl + 'apiMall/delivery/position'
    util.postRequestList(url, data, false, this.uploadLocationRes)
  },
  uploadLocationRes(res, type) {},
  //toHandleOrder去开单
  toHandleOrder() {
    if (this.data.isGong) {
      wx.navigateTo({
        url: '/pages/mall/my-mall/mall?actType=add',
      })
    } else {
      wx.navigateTo({
        url: '/pages/receipt/table-list/list',
      })
    }
  },
  //检查是否需要实时上传位置信息
  ///delivery/checkUpPos
  checkUpPos() {
    let url = app.globalData.baseUrl + 'apiMall/delivery/checkUpPos'
    util.getRequestList(url, false, this.checkPosRes)
  },
  checkPosRes(res, type) {
    if (res.data.code === '200') {
      if (res.data.content) {
        this.realTimeUpload()
      }
    }
  },
  //handleSetting
  handleSetting(e) {
    let result = e.detail
    if (result.authSetting['scope.userLocationBackground']) {
      this.checkUpPos()
    } else {
      // this.setData({settingShow:true})
    }
  },
  //开启实时位置上传
  realTimeUpload() {
    //实时监控位置
    let _this = this
    let oldTimes = new Date().getTime()
    let times = 1 //次数
    wx.startLocationUpdateBackground({
      success(res) {
        app.globalData.isRealTime = true
        wx.onLocationChange((res) => {
          let curTimes = new Date().getTime()
          let fi = Math.floor((curTimes - oldTimes) / 60000)
          if (fi === times) {
            times++
            let data = {
              longitude: res.longitude,
              latitude: res.latitude
            }
            _this.liveUploadLocation(data)
          }
        })
      },
      fail(err) {
        _this.setData({
          settingShow: true
        })
      },
    })
  },
  //获取授权并实时上传位置
  locationUpdateAuth() {
    let _this = this
    if (wx.canIUse('startLocationUpdateBackground')) {
      util.getUserLocation.getAuthSetting().then(res => {
        if (res.authSetting['scope.userLocationBackground'] === true) {
          _this.checkUpPos()
        }
        if (res.authSetting['scope.userLocationBackground'] === false) {
          _this.setData({
            settingShow: true
          })
        }
        if (res.authSetting['scope.userLocationBackground'] === undefined) {
          _this.checkUpPos()
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onLoad: function(options) {
    this.locationUpdateAuth()
    this.getBannerList()
    this.getMenuList()
    this.echartsComponent = this.selectComponent('#mychart');
    // this.initChart()
    if (options.path) {}
    wx.hideHomeButton({
      success: function(res) {}
    })
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        var name = 'iPhone X'
        var isIpx = false
        if (res.model.indexOf(name) > -1) {
          isIpx = true
        }
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          isIpx: isIpx,
          btnTop: res.windowHeight * 0.65
        })
      },
    })
    // util.setTitle()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onHide: function() {
    clearInterval(timer)
    clearInterval(timer2)
    timer = null
    timer2 = null
  },
  onUnload() {
    clearInterval(timer)
    timer = null
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})