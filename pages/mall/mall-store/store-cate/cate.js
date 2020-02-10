// pages/mall/mall-store/store-cate/cate.js
// pages/pro_manage/pro_list/list.js
let util = require('../../../../utils/util.js');
const app = getApp()
let QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
let qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationInfo:{
      show:true,
      county:'定位中...',
    },
    searchValue:'',
    cateImageList:[],
    scrollLeft:0,
    curCateId:0,
    intoViewId:'',
    proList:[],
    filterData:{
      cateId: '',
      goodsName: '',
      pageNum: 1,
      pageSize: 10
    },
    storeInfo:{},
    proSpecList:[],
    proSpecShow:false,
    checkAllList:[
      {value:1,checked:false,count:0}
    ],//控制全选按钮
    
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
    hasGetCartData:false
  },
  /**定位分类位置
   * @param arr 
   * @param index
   * @param key
   * @return name
  */
  cateLoction(arr,index,key){
    let clen=arr.length
    let name=''
    if(clen-5>=0){
      if(index<=2){
        name='cate'+arr[0][key]
      }else if(index>2&&clen-index<2){
        name='cate'+arr[clen-5][key]
      }else if(index>2&&clen-index>=2){
        name='cate'+arr[index-2][key]
      }
    }else if(clen-5<0){
      name='cate'+arr[0][key]
    }
    return name
  },
  //获取分类商品
  handleCatePro(e){
    let cateId=e.currentTarget.dataset.id
    let curCateId=this.data.curCateId
    let index=e.currentTarget.dataset.index
    let cateList=this.data.cateImageList
    let intoViewId=this.cateLoction(cateList,index,'keyId')
    if(curCateId!==cateId){
      let filterData=this.data.filterData
      filterData.cateId=cateId
      filterData.pageNum=1
      this.setData({
        filterData,
        intoViewId,
        curCateId:
        cateId
      })
      let actType='refresh'
      this.getProInfoList(filterData,actType)
    }
  },
  //cartCheck阻止冒泡事件
  cartCheck(){},
  //bindCollect收藏///org/collect/add添加一个收藏
  //collectType//收藏类型(1:店铺,2:商品)//targetId
  ///org/collect/delete
  bindCollect(e){
    let _this=this
    let collect=e.currentTarget.dataset.collect
    if(collect){
      let data = { collectId: _this.data.storeInfo.collectId}
      wx.showModal({
        title: '提示',
        content: '是否取消收藏',
        success(res) {
          if (res.confirm) {
            _this.delCollect(data)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      let data = { collectType: 1, targetId: _this.data.storeInfo.orgId}
      _this.addCollect(data)
    }
  },
  //清除收搜内容
  onClear(e) {
    let filterData = this.data.filterData
    let searchValue = this.data.searchValue
    if (searchValue) {
      filterData.goodsName= ''
      filterData.pageNum = 1
      let scrollTop = 0
      this.setData({
        filterData,
        scrollTop,
        searchValue:''
      })
      let actType = 'refresh'
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
    filterData.pageNum = 1
    let scrollTop = 0
    this.setData({
      searchValue,
      filterData,
      scrollTop,
    })
    let actType = 'refresh'
    this.getProInfoList(filterData, actType)
  },
  //查看详情
  seeProDetail(e){
    let index = parseInt(e.detail)
    let list=this.data.proList
    let id=list[index].keyId
    wx.navigateTo({
      url: '/pages/mall/pro-details/mall-detail/detail?id=' + id
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
    let orgId=obj.orgId
    let goodsId=obj.goodsId
    obj.cusBuyCount=count+1
    let carId=obj.carId
    let buyCount = count + 1
    let chooseFlag = obj.cusChecked ? '1' : '0'
    this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    // 商城数据变化
    let proList=this.data.proList
    proList.forEach((item,index)=>{
      if(item.goodsId===goodsId&&item.orgId===orgId){
        let attrList=JSON.parse(item.attrList)
        let attLen=attrList.length
        if(attLen===1){
          item.cusBuyCount=count
          item.cusOptShow=true
          item.cusAddShow=false
        }
      }
    })
    this.changeCartData(cpl)
    this.proDataCompare(cpl,proList)
  },
  //购物数据减少
  bindCartReduce(e){
    let index = parseInt(e.target.dataset.index)
    let cpl = this.data.cartProList
    let carId = cpl[index].carId
    let count = cpl[index].cusBuyCount
    let proList=this.data.proList
    let orgId=cpl[index].orgId
    let goodsId=cpl[index].goodsId
    if(count===1){
      proList.forEach((item,index)=>{
        if(item.goodsId===goodsId&&item.orgId===orgId){
          let attrList=JSON.parse(item.attrList)
          let attLen=attrList.length
          if(attLen===1){
            item.cusBuyCount=0
            item.cusOptShow=false
            item.cusAddShow=true
          }
        }
      })
      cpl.splice(index,1)
      this.delCartRecord({ carId })//data={carId}
    }else if(count>1){
      proList.forEach((item,index)=>{
        if(item.goodsId===goodsId&&item.orgId===orgId){
          let attrList=JSON.parse(item.attrList)
          let attLen=attrList.length
          if(attLen===1){
            item.cusBuyCount=count-1
          }
        }
      })
      cpl[index].cusBuyCount = count - 1
      let buyCount = count - 1
      let chooseFlag = cpl[index].cusChecked?'1':'0'
      this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    }
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
          item.carId=value.carId
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
    let pl=this.data.proList
    count--
    list[index].cusBuyCount = count>0?count:0
    if(count===0){
      let carId=0
      for (let i = 0; i < cartProList.length; i++) {
        let curObj = cartProList[i]
        if (curObj.orgId === orgId && curObj.attrId === attrId) {
          carId = curObj.carId
          cartProList.splice(i,1)
        }
      }
      this.delCartRecord({carId})
    }
    if(count>0){
      for (let i = 0; i < cartProList.length; i++) {
        let curObj = cartProList[i]
        if (curObj.orgId === orgId && curObj.attrId === attrId) {
          curObj.cusBuyCount = count
          let carId = curObj.carId
          let buyCount = count
          let chooseFlag = curObj.cusChecked ? '1' : '0'
          this.updateCartRecord({ carId, buyCount, chooseFlag })
        }
      }
    }
    this.changeCartData(cartProList)
    this.proDataCompare(cartProList,pl)
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
    let attrId = curObj.keyId
    let cartProList = this.data.cartProList
    let pl=this.data.proList
    if (count===0) {
      count++
      curObj.cusChecked = true
      curObj.cusBuyCount=count
      let data = {
        orgId: curObj.orgId,
        goodsId: curObj.goodsId,
        attrId: curObj.keyId,
        buyCount: count,
        chooseFlag: '1'
      }
      //orgId,goodsId,attrId,buyCount,chooseFlag
      this.addCartRecord(data)
    }else{
      count++
      curObj.cusBuyCount = count
      for (let i = 0; i < cartProList.length; i++) {
        let cartObj = cartProList[i]
        if (cartObj.orgId === orgId && cartObj.attrId === attrId) {
          cartObj.cusBuyCount = count
          cartObj.cusChecked=true
          let carId = cartObj.carId
          let buyCount = cartObj.cusBuyCount
          let chooseFlag = cartObj.cusChecked ? '1' : '0'
          this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
          this.changeCartData(cartProList)
          this.proDataCompare(cartProList,pl)
        }
      }
    }
    this.setData({
      proSpecList: list
    })
  },
  //商品选择++
  bindProAdd(e){
    let index=e.currentTarget.dataset.index
    let proList=this.data.proList
    let count=proList[index].cusBuyCount
    let goodsId=proList[index].goodsId
    let cpl=this.data.cartProList
    proList[index].cusBuyCount=count+1
    if(count===0){
      proList[index].cusOptShow=true
      proList[index].cusAddShow=false
      //orgId,goodsId,attrId,buyCount,chooseFlag
      let attrList=JSON.parse(proList[index].attrList)
      let atObj =attrList[0]
      let data={
        orgId:atObj.orgId, 
        goodsId: atObj.goodsId, 
        attrId:atObj.keyId, 
        buyCount:1, 
        chooseFlag:'1'
      }
      this.addCartRecord(data)
    }else{
      cpl.forEach((item,index)=>{
        if(item.goodsId===goodsId){
          item.cusBuyCount+=1
          let carId = item.carId
          let buyCount = item.cusBuyCount
          let chooseFlag = item.cusChecked ? '1' : '0'
          this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,
        }
      })
      this.changeCartData(cpl)
    }
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
          let carId=item.carId
          cpl.splice(index,1)
          this.delCartRecord({ carId })//data={carId}
        }
      })
    }else{
      cpl.forEach((item,index)=>{
        if(item.goodsId===goodsId){
          item.cusBuyCount=count
          let carId = item.carId
          let buyCount = item.cusBuyCount
          let chooseFlag = item.cusChecked ? '1' : '0'
          this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
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
    pl.forEach(item => {
      let orgId=item.orgId
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
          }
        }
        let attLen=JSON.parse(pl[j].attrList).length
        if(attLen===1){
          //cusOptShow,cusAddShow,cusSelShow
          pl[j].cusOptShow= pl[j].cusBuyCount?true:false
          pl[j].cusAddShow= pl[j].cusBuyCount?false:true
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
      //商品控制属性设置
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
      let carId = item.carId
      let buyCount = item.cusBuyCount
      let chooseFlag = item.cusChecked ? '1' : '0'
      this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
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
    let carId = obj.carId
    let buyCount = obj.cusBuyCount
    let chooseFlag = obj.cusChecked ? '1' : '0'
    this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    
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
    let that=this
    let list=this.data.cartProList
    wx.showModal({
      title: '提示',
      content: '是否清空购物车',
      success(res) {
        if (res.confirm) {
          that.setData({
            cartProList:[],
            showCart:false,
            cartEmpty:true,
            hideCartImg:true,
          })
          list.forEach(item=>{
            that.delCartRecord({carId:item.carId})
          })
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
      wx.navigateTo({
        url: '/pages/mall/mall-suborder/order',
      })
    }
  },
  //获取商城分类列表
  ///default/cate/storeCate
  getStoreCateList(){
    let url = app.globalData.baseUrl + 'apiStock/default/cate/storeCate'
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res,type){
    if(res.data.code==='200'){
      let list=res.data.content
      if(list.length){
        let intoViewId=''
        let cateId=parseInt(this.data.filterData.cateId)
        list.forEach((item,index)=>{
          if(item.keyId===cateId){
            intoViewId=this.cateLoction(list,index,'keyId')
          }
        })
        this.setData({
          cateImageList:list,
          curCateId:cateId,
          intoViewId
        })
      }
    }
  },
  //获取某个商家商品列表///store/inst/listByDefault
  //cateId,goodsName,pageNum,pageSize
  getProInfoList(data, actType){
    wx.showLoading({
      title: '加载中...',
    })
    let url = app.globalData.baseUrl + 'apiMall/store/inst/listByDefault'
    util.getRequestListData(url, data, actType, this.proInfoListRes)
    //getRequestListData = function (url, data,actType, callBack)
  },
  proInfoListRes(res, type) {
    if(res.data.code==='200'){
      let content = res.data.content
      let cateProTotal = content.total
      let hasNextPage = content.hasNextPage
      let list = content.list
      let setList=this.initProList(list)
      if (type === 'refresh') {
        this.setData({
          proList: setList,
          cateProTotal,
          hasNextPage
        })
        if(this.data.hasGetCartData){
          this.proDataCompare(this.data.cartProList,this.data.proList)
        }
      }
      if (type === 'reachBottom') {
        let proList = this.data.proList
        setList.forEach(item => {
          proList.push(item)
        })
        this.setData({
          proList,
          cateProTotal,
          hasNextPage
        })
        if(this.data.hasGetCartData){
          this.proDataCompare(this.data.cartProList,this.data.proList)
        }
      }
    }
    if(this.data.hasGetCartData===false){
      this.getCartProList()
    }
    wx.hideLoading()
  },
  //获取购物车数据///shopcar/list
  getCartProList(){
    let url = app.globalData.baseUrl + 'apiMall/shopcar/list'
    util.getRequestList(url, false, this.getCartProListRes)
  },
  getCartProListRes(res,type){
    if(res.data.code==='200'){
      let list=res.data.content
      list.forEach(item=>{
        item.cusChecked = item.chooseFlag == "1" ? true : false
        item.cusBuyCount = item.buyCount
        item.cusSalePrice = util.getMoney(item.attrPrice).toString()
        item.cusOriPrice = util.getMoney(item.attrNormalPrice).toString()
      })
      this.proDataCompare(list,this.data.proList)
      this.changeCartData(list)
      this.setData({hasGetCartData:true})
    }
  },
  //添加购物一条记录///shopcar/add
  //orgId,goodsId,attrId,buyCount,chooseFlag
  addCartRecord(data){
    let url = app.globalData.baseUrl + 'apiMall/shopcar/add'
    util.postRequestList(url, data, false, this.addCartRecordRes)
  },
  addCartRecordRes(res,type){
    if(res.data.code==='200'){
      let list=this.data.cartProList
      let content=res.data.content
      content.cusChecked = content.chooseFlag == "1" ? true : false
      content.cusBuyCount = content.buyCount
      content.cusSalePrice = util.getMoney(content.attrPrice).toString()
      content.cusOriPrice = util.getMoney(content.attrNormalPrice).toString()
      list.unshift(content)
      this.changeCartData(list)
      let pl=this.data.proList
      this.proDataCompare(list,pl)
    }
  },
  //更新一条数据功能/shopcar/update
  //carId,buyCount,chooseFlag
  updateCartRecord(data) {
    let url = app.globalData.baseUrl + 'apiMall/shopcar/update'
    util.postRequestList(url, data, false, this.updateCartRecordRes)
  },
  updateCartRecordRes(res, type) {},
  //清空购物车/shopcar/release//无参
  clearCartRecord() {
    let data={}
    let url = app.globalData.baseUrl + 'apiMall/shopcar/release'
    util.postRequestList(url, data, false, this.clearCartRecordRes)
  },
  clearCartRecordRes(res, type) {},
  //删除购物记录///shopcar/delete//carId
  delCartRecord(data) {
    let url = app.globalData.baseUrl + 'apiMall/shopcar/delete'
    util.postRequestList(url, data, false, this.delCartRecordRes)
  },
  delCartRecordRes(res, type) {},
  //加载更多..
  bindReachBottom(){
    if(this.data.hasNextPage){
      let filterData = this.data.filterData
      filterData.pageNum += 1
      this.setData({filterData})
      let actType='reachBottom'
      this.getProInfoList(filterData,actType)
    }
  },
  //获取位置
  handleOpenSetting(res) {
    let auth = res.detail.authSetting['scope.userLocation']
    if (auth){
      this.getLocal()
    }else{
      this.authFail('拒绝授权')
    }
  },
  //获取定位信息
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
          locationInfo.show=true
          locationInfo.county = res.result.ad_info.district
          vm.setData({
            locationInfo
          })
        },
        fail: function (res) {
          let locationInfo = vm.data.locationInfo
          locationInfo.show =false
          locationInfo.county = '定位中...'
          vm.setData({
            locationInfo
          })
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
  authFail(title){
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
    let cateId=options.cateId
    let filterData = this.data.filterData
    filterData.cateId=cateId
    this.setData({filterData})
    this.getProInfoList(filterData,'refresh')
    this.getStoreCateList()
    // qqmapsdk = new QQMapWX({
    //   key: 'APYBZ-TKQ6X-GAJ4A-7CDCW-JHK4K-LFB2Q'
    // });
    // let vm=this
    // util.getUserLocation.getAuthSetting().then(res=>{
    //   if (res.authSetting['scope.userLocation']===true) {
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
    //   if (res.authSetting['scope.userLocation'] === undefined){
    //     wx.authorize({
    //       scope: 'scope.userLocation',
    //       success: (res) => {
    //         vm.getLocal()
    //       },
    //       fail: (res) => {
    //         vm.authFail('拒绝授权')
    //       },
    //     })
    //   }
    // }).catch(err=>{
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
    if(!this.data.isNewPage){
      this.getCartProList();
    }
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