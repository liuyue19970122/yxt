// pages/pro_manage/pro_list/list.js
let util = require('../../../utils/util.js');
const app = getApp()
let QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationInfo: {
      show: true,
      county: '定位中...',
    },
    searchValue:'',
    sliderList:[],
    activeSlider:0,
    sliderId:'',
    tabList:[],
    activeTab: 0,
    tabId:'',
    tabShow: false,
    proList:[],
    cateProTotal: 0,//当前类总量
    filterData: {
      cateId: '',
      goodsName: '',
      sortType: '', //价格：price,销量：count
      sortOrder: -1,//排序方向 1(>)/0(<)/-1
      pageNum: 1,
      pageSize: 10
    },
    storeInfo:{},
    proSpecList:[],
    proSpecShow:false,
    checkAllList:[
      {value:1,checked:false,count:0}
    ],//控制全选按钮
    compList: [
      { title: '销量', down: false, up: false, num: 0, type: 'sale' },
      { title: '价格', down: false, up: false, num: 0, type: 'price' }
    ],
    scrollTop: 0,
    cateProTotal: 0,
    cartProList: [],
    cartCheckValue:[],
    cartEmpty: true,
    showCart: false,
    hideCartImg:true,
    buyTotalCount:0,
    buyTotalMoney:0,
    buyFavMoney:0,
    isNewPage:true,
    hasGetCartData:false,
    hasNextPage: true
  },
  //重置购物车数据
  resetCartData(){
    let pl=this.data.proList
    let proList=this.initProList(pl)
    let cartProList=[]
    this.changeCartData(cartProList)
    this.setData({proList,cartProList})
  },
  //清除
  onClear(e) {
    if (this.data.searchValue) {
      let filterData = this.data.filterData
      filterData.goodsName = ''
      let tabShow = false
      this.setData({
        tabShow,
        filterData,
        scrollTop: 0,
        searchValue: ''
      })
      let actType = 'refresh'
      this.sortParmReset()
      this.getProInfoList(filterData, actType)
    } else {
      this.setData({
        searchValue: ''
      })
    }
  },
  //搜索功能
  onSearch(e) {
    let searchValue = e.detail
    let filterData = this.data.filterData
    filterData.goodsName = searchValue
    filterData.cateId = -1
    filterData.pageNum = 1
    filterData.pageSize = 10
    let sliderList = this.data.sliderList
    let sliderId = sliderList[0].keyId
    let tabList = JSON.parse(sliderList[0].nextList)
    let tabId = tabList[0].keyId
    let tabShow = false
    this.setData({
      tabList,
      tabShow,
      sliderId,
      tabId,
      filterData,
      searchValue,
      scrollTop: 0,
      activeTab: 0,
      activeSlider: 0,
    })
    this.sortParmReset()
    let actType = 'refresh'
    this.getProInfoList(filterData, actType)
  },
  //大类一级change事件
  onFirstCateChange(evt){
    let index=evt.detail
    let sliderList=this.data.sliderList
    let sliderId=sliderList[index].keyId
    let tabList=JSON.parse(sliderList[index].nextList)
    if(!tabList.length){
      return
    }
    let tabId=tabList[0].keyId
    let filterData=this.data.filterData
    filterData.cateId=tabId
    filterData.goodsName = ''
    filterData.pageNum=1
    filterData.sortOrder=-1
    this.setData({
      tabList,
      sliderId,
      tabId,
      filterData,
      tabShow:false,
      activeTab:0,
      activeSlider:index,
      scrollTop:0
    })
    let actType = 'refresh'
    this.getProInfoList(filterData, actType)
    this.sortParmReset()
  },
  //大类二级change事件
  onSecondCateChange(evt){
    let index=evt.detail.index
    console.log(index)
    let tabList=this.data.tabList
    console.log(tabList)
    let tabId=tabList[index].keyId
    let filterData = this.data.filterData
    filterData.cateId = tabId
    filterData.goodsName = ''
    filterData.pageNum = 1
    filterData.sortOrder = -1
    this.setData({
      tabId,
      filterData,
      activeTab:index,
      scrollTop:0
    })
    let actType='refresh'
    this.getProInfoList(filterData,actType)
    this.sortParmReset()
  },
  handleClickTab(e) {
    let index = e.detail
    let tabList = this.data.tabList
    let tabId = tabList[index].keyId
    let filterData = this.data.filterData
    filterData.cateId = tabId
    filterData.goodsName = ''
    filterData.pageNum = 1
    this.setData({
      filterData,
      tabId,
      scrollTop: 0,
      activeTab: index
    })
    let actType = 'refresh'
    this.getProInfoList(filterData, actType)
  },
 
  bindTabCollapse(){
    let tabShow=!this.data.tabShow
    this.setData({tabShow})
  },
  seeProDetail(e){
    let index = e.detail
    let list = this.data.proList
    let id = list[index].keyId
    wx.navigateTo({
      url: '/pages/mall/pro-details/preview/preview?id=' + id + '&actType=detail'
    })
  },
  //bindEdit 商品详情修改
  bindEdit(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/mall/pro-add/add?id='+id+'&actType=edit&sliderId='+this.data.sliderId+'&tabId='+this.data.tabId
    })
  },
  //更改商品上下架状态//store/inst/upOrDown
  //goodsId,attrId,status
  bindChangeStatus(e){
    let goodsId=e.target.dataset.id
    let status=e.target.dataset.status
    status===0?status=1:status===1?status=0:''
    let url = app.globalData.baseUrl + 'apiMall/store/inst/upOrDown'
    //postRequestList = function (url, data, actType, callBack)
    let data={
      goodsId: goodsId,
      attrId:'',
      status:status
    }
    util.postRequestList(url,data,actType,this.changeStatusRes)
  },
  changeStatusRes(res,actType){
    console.log(res)
  },
  //排序参数还原
  sortParmReset(){
    let compList= [
      { title: '销量', down: false, up: false, num: 0, type: 'sale' },
      { title: '价格', down: false, up: false, num: 0, type: 'price' }
    ]
    this.setData({
      compList
    })
  },
  //排序功能
  sortClick(e) {
    console.log(e)
    let type = e.currentTarget.dataset.type
    let curIndex = parseInt(e.currentTarget.dataset.index)
    let list = this.data.compList
    let num = list[curIndex].num + 1
    list[curIndex].num = num
    let proList = this.data.proList
    list.forEach((item, index) => {
      if (curIndex !== index) {
        item.down = false
        item.up = false
        item.num = 0
      }
    })
    if (num % 3 === 0) {
      list[curIndex].up = false
      list[curIndex].down = false
    
    }
    if (num % 3 === 1) {
      list[curIndex].up = false
      list[curIndex].down = true
      if (type === 'sale') {
        this.compSort(proList, 'sellCount', 'down')
      }
      if (type === 'price') {
        this.compSort(proList, 'sellPrice', 'down')
      }
    }
    if (num % 3 === 2) {
      list[curIndex].up = true
      list[curIndex].down = false
      if (type === 'sale') {
        this.compSort(proList, 'sellCount', 'up')
      }
      if (type === 'price') {
        this.compSort(proList, 'sellPrice', 'up')
      }
    }
    this.setData({
      compList: list
    })
  },
  //排序功能
  compSort(list, key, type) {
    console.log(list)
    if (type === 'up') {
      list.sort((a, b) => {
        return a[key] - b[key]
      })
    }
    if (type === 'down') {
      list.sort((a, b) => {
        return b[key] - a[key]
      })
    }
    this.setData({
      proList: list
    })
  },
  //查看购物车详情
  bindShowCard(){
    if(this.data.cartEmpty){
      wx.showToast({
        title: '购物车空的',
        icon:'none'
      })
    }else{
      let show=!this.data.showCart
      let imgShow=!this.data.hideCartImg
      this.setData({
        showCart: show,
        hideCartImg: imgShow
      })
    }
  },
  closeCart(){
    this.setData({
      showCart: false,
      hideCartImg:true
    })
  },
  //购物车内商品操作
  bindCartAdd(e){
    let index = parseInt(e.target.dataset.index)
    let cpl=this.data.cartProList
    let obj=cpl[index]
    let count = obj.cusBuyCount
    obj.cusBuyCount=count+1
    // 商城数据变化
    let proList=this.data.proList
    this.setData({proList})
    this.changeCartData(cpl)
    this.proDataCompare(cartProList,proList)
  },
  //购物数据减少
  bindCartReduce(e){
    let index = parseInt(e.target.dataset.index)
    let cpl = this.data.cartProList
    let count = cpl[index].cusBuyCount
    let proList=this.data.proList
    if(count===1){
      cpl.splice(index,1)
    }else if(count>1){
      cpl[index].cusBuyCount = count - 1
    }
    this.setData({proList})
    this.changeCartData(cpl)
    this.proDataCompare(cpl,proList)
  },
  //购物操作展示某个商品规格
  bindBuy(e) {
    let index =parseInt(e.currentTarget.dataset.index)
    let list=this.data.proList
    let proSpecList = JSON.parse(list[index].attrList) 
    let alCart = this.data.cartProList
    proSpecList.forEach(item => {
      alCart.forEach(value => {
        if (item.orgId === value.orgId && item.goodsId === value.goodsId && item.keyId === value.attrId) {
          item.cusBuyCount = value.cusBuyCount
        }
      })
    })
    this.setData({
      proSpecShow: true,
      proSpecList: proSpecList
    })
  },
  //购买数量减
  bindCountReduce(e){
    let index = parseInt(e.target.dataset.index) 
    let list=this.data.proSpecList
    let count=list[index].cusBuyCount
    let orgId=list[index].orgId
    let attrId=list[index].keyId
    let cartProList=this.data.cartProList
    count--
    list[index].cusBuyCount = count>0?count:0
    if(count===0){
      for (let i = 0; i < cartProList.length; i++) {
        let curObj = cartProList[i]
        if (curObj.orgId === orgId && curObj.attrId === attrId) {
          cartProList.splice(i,1)
        }
      }
    }
    if(count>0){
      for (let i = 0; i < cartProList.length; i++) {
        let curObj = cartProList[i]
        if (curObj.orgId === orgId && curObj.attrId === attrId) {
          curObj.cusBuyCount = count
        }
      }
    }
    this.changeCartData(cartProList)
    this.proDataCompare(cartProList,this.data.proList)
    this.setData({
      proSpecList: list
    })
  },
  //购买数量加
  bindCountAdd(e){
    let index = parseInt(e.target.dataset.index)
    let list = this.data.proSpecList
    let curObj = list[index]
    let count = curObj.cusBuyCount
    let orgId = curObj.orgId
    let attrId = curObj.attrId
    let cartProList = this.data.cartProList
    if (count===0) {
      count++
      curObj.cusChecked = true
      curObj.cusBuyCount=count
      cartProList.unshift(curObj)
    }else{
      count++
      curObj.cusBuyCount = count
      for (let i = 0; i < cartProList.length; i++) {
        let cartObj = cartProList[i]
        if (cartObj.orgId === orgId && cartObj.attrId === attrId) {
          cartObj.cusBuyCount = count
          cartObj.cusChecked=true
        }
      }
    }
    this.changeCartData(cartProList)
    this.proDataCompare(cartProList,this.data.proList)
    this.setData({
      proSpecList: list
    })
  },
  //商品选择++
  bindProAdd(e){
    let index=parseInt(e.currentTarget.dataset.index)
    let proList=this.data.proList
    let count=proList[index].cusBuyCount
    let goodsId=proList[index].goodsId
    let cpl=this.data.cartProList
    proList[index].cusBuyCount=count+1
    if(count===0){
      proList[index].cusOptShow=true
      proList[index].cusAddShow=false
      let attrlist=JSON.parse(proList[index].attrList)
      let curObj=attrlist[0]
      curObj.cusChecked = true
      curObj.cusBuyCount=count+1
      cpl.unshift(curObj)
    }else{
      proList[index].cusBuyCount=count+1
      cpl.forEach((item,index)=>{
        if(item.goodsId===goodsId){
          item.cusBuyCount+=1
        }
      })
    }
    this.changeCartData(cpl)
    this.setData({proList})
  },
  //商品选择--
  bindProReduce(e){
    let index=e.currentTarget.dataset.index
    let proList=this.data.proList
    let count=proList[index].cusBuyCount
    let goodsId=proList[index].goodsId
    count--
    proList[index].cusBuyCount=count
    let cpl=this.data.cartProList
    if(count===0){
      proList[index].cusAddShow=true
      proList[index].cusOptShow=false
      cpl.forEach((item,index)=>{
        if(item.goodsId===goodsId){
          cpl.splice(index,1)
        }
      })
    }else{
      cpl.forEach((item,index)=>{
        if(item.goodsId===goodsId){
          item.cusBuyCount=count
        }
      })
    }
    this.changeCartData(cpl)
    this.setData({proList})
  },
  /**
   * 设置商品数据初始属性设置用于界面显示
   * @param  pl 商品数据 Array
  */
  initProList(pl){
    console.log(1111)
    let orgId = parseInt(this.data.storeInfo.orgId)
    pl.forEach(item => {
      item.orgId = orgId
      item.orgName = this.data.storeInfo.orgName
      let imgSrc = item.goodsPic
      let goodsId = item.keyId
      let goodsName = item.goodsName
      item.cusBuyCount=0
      item.goodsId=item.keyId
      let attrList = JSON.parse(item.attrList)
      item.cusOptShow=false
      //cusOptShow,cusAddShow,cusSelShow
      if(attrList.length>1){
        item.cusSelShow=true
        item.cusAddShow=false
      }else{
        item.cusSelShow=false
        item.cusAddShow=true
      }
      attrList.sort((a, b) => {
        return a.attrPrice - b.attrPrice
      })
      attrList.forEach(item => {
        item.cusBuyCount = 0
        item.goodsPic = imgSrc
        item.orgId = orgId
        item.orgName = this.data.storeInfo.orgName
        item.goodsId = goodsId
        item.goodsName = goodsName
        item.attrId=item.keyId
        item.cusSalePrice = util.getMoney(item.attrPrice).toString()
        item.cusOriPrice = util.getMoney(item.attrNormalPrice).toString()
        item.cusChecked = false
      })
      item.attrList = JSON.stringify(attrList) 
      item.cusSalePrice = util.getMoney(attrList[0].attrPrice)
      item.cusOriPrice = util.getMoney(attrList[0].attrNormalPrice)
      item.cusSalePriceFen = attrList[0].attrPrice
      item.cusOriPriceFen = attrList[0].attrNormalPrice
      item.specTitle=attrList[0].attrName
    })
    return pl
  },
  /**
   * 设置商品数据和购物车数据对比属性设置用于界面显示
   * @param cpl 购物车数据 Array
   * @param  pl 商品数据 Array
   */
  proDataCompare(cpl,pl){
    if(cpl.length){
      let clen=cpl.length
      let plen=pl.length
      for(let j=0;j<plen;j++){
        pl[j].cusBuyCount=0
        for(let i=0;i<clen;i++){
          if(cpl[i].goodsId===pl[j].goodsId){
            let buyCount=pl[j].cusBuyCount+cpl[i].cusBuyCount
            pl[j].cusBuyCount=buyCount
            console.log(buyCount)
          }
        }
        let attLen=JSON.parse(pl[j].attrList).length
        //cusOptShow,cusAddShow,cusSelShow
        if(attLen===1){
          pl[j].cusOptShow= pl[j].cusBuyCount?true:false
          pl[j].cusAddShow=pl[j].cusBuyCount?false:true
        }
      }
      this.setData({
        proList:pl
      })
    }else{
      let proList=this.initProList(pl)
      this.setData({proList})
    }
  },
  //购物车数据更改
  changeCartData(cartProList){
    let cpl = cartProList.length
    if(cpl){
      let buyTotalCount = 0
      let buyTotalMoney = 0
      let buyFavMoney = 0
      let oriPrice = 0
      let cartCheckValue = []
      let checkAllList=this.data.checkAllList
      cartProList.forEach((item,index) => {
        if (item.cusChecked){
          cartCheckValue.push(index.toString())
          buyTotalCount += item.cusBuyCount
          buyTotalMoney += item.attrPrice * item.cusBuyCount
          oriPrice += item.attrNormalPrice * item.cusBuyCount
        }
      })
      checkAllList[0].checked = cartCheckValue.length ===cpl?true:false
      buyFavMoney = oriPrice - buyTotalMoney
      buyTotalMoney = util.getMoney(buyTotalMoney).toString()
      buyFavMoney = util.getMoney(buyFavMoney).toString()
      let hideCartImg = this.data.showCart?false:true
      this.setData({
        cartProList,
        buyTotalCount,
        buyFavMoney,
        buyTotalMoney,
        cartCheckValue,
        checkAllList,
        hideCartImg,
        cartEmpty: false
      })
    }else{
      this.setData({
        cartEmpty:true,
        hideCartImg:true,
        showCart: false
      })
    }
  },
  //bindSpecChoice选取某个商品规格数据
  bindSpecChoice(e){
    let index=parseInt(e.detail.value)
    let list=this.data.proSpecList
    let obj=list[index]
    let orgId=obj.orgId
    let cartList=this.data.cartProList
    
    cartList.push(obj)
    this.setData({
      cartProList: cartList
    })
  },
  //购物车全选
  cartCheckAll(e){
    let len = e.detail.value.length
    let list = this.data.cartProList
    list.forEach(item => {
      item.cusChecked = len ? true : false
    })
    this.changeCartData(list)
  },
  //购物车选择更改
  cartCheckboxChange(e){
    let curArr = e.detail.value
    let prevArr=this.data.cartCheckValue
    let difArr=this.getArrDifference(curArr,prevArr)
    let index=parseInt(difArr[0])
    let list = this.data.cartProList
    let obj = list[index]
    obj.cusChecked = !obj.cusChecked
    this.changeCartData(list)
  },
  //获取两个数组中不中的值
  getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  },
  //清空购物车
  bindClearCart(){
    let _this=this
    wx.showModal({
      title: '提示',
      content: '是否清空购物车',
      success(res) {
        if (res.confirm) {
          let cartProList=[]
          _this.setData({
            cartProList,
            showCart:false,
            cartEmpty:true,
            hideCartImg:true,
          })
          let proList=_this.data.proList
          _this.proDataCompare(cartProList,proList)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //关闭某个商品规格详情
  closeProSpec(){
    this.setData({
      proSpecShow: false
    })
  },
  //去订单提交界面bindToSubmit
  bindToSubmit(){
    if(this.data.cartEmpty){
      wx.showToast({
        title: '购物车空的',
        icon:'none'
      })
    }else if(this.data.buyTotalCount===0){
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
    }else{
      let proInfoStr=JSON.stringify(this.data.cartProList)
      wx.navigateTo({
        url: '/pages/mall/handle-order/buyer-order/order?orderInfo='+proInfoStr,
      })
    }
  },
  //获取分类列表/apiStock/stock/cate/list
  getCateList(){
    let url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res,type){
    let sliderList=res.data.content
    let cusAll = {
      cateLogo: null,
      cateName: "全部",
      defaultId: -1,
      keyId: -1,
      nextList: '[{"keyId":-1,"defaultId":-1,"cateName":"全部"}]'
    }
    sliderList.unshift(cusAll)
    let sliderId = sliderList[0].keyId
    let tabList=JSON.parse(sliderList[0].nextList)
    let tabId=tabList[0].keyId
    let filterData=this.data.filterData
    filterData.cateId=tabId
    this.setData({
      sliderList,
      sliderId,
      tabList,
      tabId,
      filterData
    })
    let actType = 'refresh'
    this.getProInfoList(filterData,actType)
  },
  //获取商品列表///store/inst/adminList
  getProInfoList(data, actType){
    wx.showLoading({
      title: '加载中...',
    })
    let url = app.globalData.baseUrl + 'apiMall/store/inst/adminList'
    util.getRequestListData(url, data, actType, this.proInfoListRes)
    //getRequestListData = function (url, data,actType, callBack)
  },
  proInfoListRes(res, type) {
    if(res.data.code==='200'){
      let result=res.data.content
      let list=result.list
      let total=result.total
      let hasNextPage=result.hasNextPage
      let setList=this.initProList(list)
      if(type==='reachBottom'){
        let proList=this.data.proList
        setList.forEach(item=>{
          proList.push(item)
        })
        console.log(proList)
        this.setData({
          proList
        })
      }
      if(type==='refresh'){
        this.setData({
          proList: setList,
        })
      }
      this.setData({
        cateProTotal: total,
        hasNextPage: hasNextPage
      })
    }
    wx.hideLoading()
  },
  //到达底部
  bindReachBottom(){
    console.log(this.data.hasNextPage)
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.setData({
        filterData
      })
      let actType='reachBottom'
      this.getProInfoList(filterData, actType)
    }
  },
  //获取位置
  getLocal: function () {
    let vm = this;
    util.getUserLocation.location().then(res => {
      let latitude = res.latitude
      let longitude = res.longitude
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,//106.93 
          longitude: longitude
        },
        success: function (res) {
          let locationInfo = vm.data.locationInfo
          locationInfo.show = true
          locationInfo.county = res.result.ad_info.district
          vm.setData({
            locationInfo
          })
        },
        fail: function (res) {
          let locationInfo = vm.data.locationInfo
          locationInfo.show = false
          locationInfo.county = '定位中...'
          vm.setData({
            locationInfo
          })
          console.log(res);
        },
        complete: function (res) {
          // console.log(res);
        }
      });
    }).catch(err => {
      console.log(err)
    })
  },
  //拒绝授权或授权失败
  authFail(title) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true
    })
    let locationInfo = this.data.locationInfo
    locationInfo.show = false
    locationInfo.county = '定位中...'
    this.setData({
      locationInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let info = wx.getStorageSync('localToken')
    this.setData({storeInfo:info.userInfo})
    
    this.getCateList()//获取店铺分类及商品
    //获取定位信息
    // qqmapsdk = new QQMapWX({
    //   key: 'APYBZ-TKQ6X-GAJ4A-7CDCW-JHK4K-LFB2Q'
    // });
    // let vm = this
    // util.getUserLocation.getAuthSetting().then(res => {
    //   console.log(res)
    //   if (res.authSetting['scope.userLocation'] === true) {
    //     this.getLocal()
    //   }
    //   if (res.authSetting['scope.userLocation'] === false) {
    //     wx.showModal({
    //       title: '请求授权当前位置',
    //       content: '需要获取您的地理位置，请确认授权',
    //       success: function (res) {
    //         if (res.cancel) {
    //           vm.authFail('拒绝授权')
    //         } else if (res.confirm) {
    //           util.getUserLocation.againAuth().then(res => {
    //             vm.getLocal()
    //           })
    //         }
    //       }
    //     })
    //   }
    //   if (res.authSetting['scope.userLocation'] === undefined) {
    //     wx.authorize({
    //       scope: 'scope.userLocation',
    //       success: (res) => {
    //         vm.getLocal()
    //       },
    //       fail: (res) => {
    //         vm.authFail('拒绝授权')
    //         console.log('失败：', res)
    //       },
    //     })
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
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