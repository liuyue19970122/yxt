// pages/mall/pro_details/detail.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picList: [],
    proSpecShow:false,
    specLsit:[],
    goodsId:null,
    goodsInfo:{},
    detailInfo:'',
    checkAllList:[
      {value:1,checked:false,count:0}
    ],//控制全选按钮
    cartProList: [],
    cartCheckValue:[],
    cartEmpty: true,
    showCart: false,
    hideCartImg:true,
    buyTotalCount:0,
    buyTotalMoney:0,
    buyFavMoney:0,
    hasGetCartData:false,
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
  //拨打电话
  bindPhone(e){
    let _this=this
    wx.makePhoneCall({
      phoneNumber: _this.data.goodsInfo.mobile,
      success:function(res){

      },
      fail(resp){
        wx.showModal({
          title: '提示',
          content: resp.message,
          showCancel:false
        })
        console.log(resp)
      }
    })
  },
  //bindCollect收藏///org/collect/add添加一个收藏
  //collectType//收藏类型(1:店铺,2:商品)//targetId
  ///org/collect/delete
  bindCollect(e) {
    let _this = this
    let collect = this.data.goodsInfo.isCollect
    if (collect==='1') {
      let data = { collectId: _this.data.goodsInfo.collectId }
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
    } else {
      let data = { collectType: 2, targetId: _this.data.goodsInfo.keyId }
      _this.addCollect(data)
    }
  },
  addCollect(data) {
    let url = app.globalData.baseUrl + 'apiUser/org/collect/add'
    util.postRequestList(url, data, false, this.addCollectRes)
  },
  addCollectRes(res, actType) {
    if (res.data.code == '200') {
      let result=res.data.content
      let goodsInfo = this.data.goodsInfo
      goodsInfo.isCollect = '1'
      goodsInfo.collectId = result.keyId
      this.setData({ goodsInfo })
      wx.showToast({
        title: '收藏成功',
      })
    }
  },
  delCollect(data) {
    let url = app.globalData.baseUrl + 'apiUser/org/collect/delete'
    util.postRequestList(url, data, false, this.delCollectRes)
  },
  delCollectRes(res, actType) {
    if (res.data.code == '200') {
      let goodsInfo = this.data.goodsInfo
      goodsInfo.isCollect = '0'
      this.setData({ goodsInfo })
    }
  },
  //购物车数据和商品详情对比
  proInfoCompare(proInfo,cpl,specLsit){
    let sll=specLsit.length
    proInfo.cusOptShow=false
    proInfo.cusSelShow=false
    proInfo.cusAddShow=false
    proInfo.cusBuyCount=0
    proInfo.goodsId=proInfo.keyId
    specLsit.forEach(item=>{
      item.cusBuyCount=0
    })
    if(sll===1){
      proInfo.cusAddShow=true
      cpl.forEach(item=>{
        if(item.orgId===proInfo.orgId&&item.goodsId==proInfo.goodsId){
          proInfo.cusOptShow=true
          proInfo.cusAddShow=false
          proInfo.cusBuyCount=item.cusBuyCount
        }
      })
    }else{
      proInfo.cusSelShow=true
      let buyCount=0
      cpl.forEach(item=>{
        specLsit.forEach(val=>{
          if(item.goodsId==val.goodsId&&item.orgId==val.orgId&&item.attrId==val.attrId){
            val.cusBuyCount=item.cusBuyCount
            buyCount+=item.cusBuyCount
          }
        })
      })
      proInfo.cusBuyCount=buyCount
    }
    this.setData({
      goodsInfo:proInfo,
      specLsit
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
  //商品选择++
  bindProAdd(e){
    let goodsInfo=this.data.goodsInfo
    console.log(goodsInfo)
    let count=goodsInfo.cusBuyCount
    let goodsId=goodsInfo.goodsId
    let cpl=this.data.cartProList
    goodsInfo.cusBuyCount=count+1
    if(count===0){
      goodsInfo.cusOptShow=true
      goodsInfo.cusAddShow=false
      //orgId,goodsId,attrId,buyCount,chooseFlag
      let specLsit=this.data.specLsit
      console.log(specLsit)
      let atObj =specLsit[0]
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
    this.setData({goodsInfo})
  },
  //商品选择--
  bindProReduce(e){
    let goodsInfo=this.data.goodsInfo
    let count=goodsInfo.cusBuyCount
    let goodsId=goodsInfo.goodsId
    count--
    goodsInfo.cusBuyCount=count
    let cpl=this.data.cartProList
    if(count===0){
      goodsInfo.cusAddShow=true
      goodsInfo.cusOptShow=false
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
    this.setData({goodsInfo})
  },
  //购物车内商品操作
  bindCartAdd(e){
    let index = parseInt(e.target.dataset.index)
    let cpl=this.data.cartProList
    let obj=cpl[index]
    let count = obj.cusBuyCount
    obj.cusBuyCount=count+1
    let carId=obj.carId
    let buyCount = count + 1
    let chooseFlag = obj.cusChecked ? '1' : '0'
    this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    // 商城数据变化
    let proInfo=this.data.goodsInfo
    let specLsit=this.data.specLsit
    this.proInfoCompare(proInfo,cpl,specLsit)
    this.changeCartData(cpl)
  },
  //购物数据减少
  bindCartReduce(e){
    let index = parseInt(e.target.dataset.index)
    let cpl = this.data.cartProList
    let carId = cpl[index].carId
    let count = cpl[index].cusBuyCount
    let proInfo=this.data.goodsInfo
    let specLsit=this.data.specLsit
    if(count===1){
      cpl.splice(index,1)
      this.delCartRecord({ carId })//data={carId}
    }else if(count>1){
      cpl[index].cusBuyCount = count - 1
      let buyCount = count - 1
      let chooseFlag = cpl[index].cusChecked?'1':'0'
      this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    }
    this.proInfoCompare(proInfo,cpl,specLsit)
    this.changeCartData(cpl)
  },
  //购买数量减
  bindCountReduce(e){
    let index = parseInt(e.target.dataset.index) 
    let list=this.data.specLsit
    let count=list[index].cusBuyCount
    let orgId=list[index].orgId
    let attrId=list[index].attrId
    let cartProList=this.data.cartProList
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
    let proInfo=this.data.goodsInfo
    this.proInfoCompare(proInfo,cartProList,list)
    this.changeCartData(cartProList)
  },
  //购买数量加
  bindCountAdd(e){
    let index = parseInt(e.target.dataset.index)
    let list = this.data.specLsit
    let curObj = list[index]
    let count = curObj.cusBuyCount
    let orgId = curObj.orgId
    let attrId = curObj.keyId
    let cartProList = this.data.cartProList
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
      this.setData({
        specLsit: list
      })
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
          this.proInfoCompare(this.data.goodsInfo,cartProList,list)
        }
      }
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
          let cartProList=[]
          let goodsInfo=that.data.goodsInfo
          let specLsit=that.data.specLsit
          that.setData({
            cartProList,
            showCart:false,
            cartEmpty:true,
            hideCartImg:true,
          })
          that.proInfoCompare(goodsInfo,cartProList,specLsit)
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
      let cpl=this.data.cartProList
      let orderInfo=JSON.stringify(cpl)
      wx.navigateTo({
        url: '/pages/mall/mall-suborder/order?orderInfo='+orderInfo,
      })
    }
  },
  //获取购物车数据///shopcar/list
  getCartProList(){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
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
      this.changeCartData(list)
      this.getProDetail(this.data.goodsId,false)
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
      this.proInfoCompare(this.data.goodsInfo,list,this.data.specLsit)
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
  //获取商品实例详情///store/inst/detail
  //goodsId
  getProDetail(id, actType) {
    let url = app.globalData.baseUrl + 'apiMall/store/inst/detail'
    let data = { goodsId: id }
    util.getRequestListData(url, data, actType, this.proDetailRes)
  },
  proDetailRes(res, actType) {
    wx.hideLoading()
    if(res.data.code==='200'){
      let data = res.data.content
      let goodsInfo = data.goodsInfo
      let detailInfo = data.detailInfo
      let dtlStr=detailInfo.detail
      let dtlStr1=dtlStr.replace(/<img/gi, "<img class='richImg' ")
      let imgList = data.imgList
      let orgId=goodsInfo.orgId
      let goodsId=goodsInfo.keyId
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
        item.cusBuyCount=0
        item.orgId=orgId
        item.goodsId=goodsId
        item.attrId=item.keyId
      })
      goodsInfo.cusNormalPrice =attrList[0].cusNormalPrice
      goodsInfo.cusSalePrice = attrList[0].cusSalePrice
      goodsInfo.attrName = attrList[0].attrName
      this.proInfoCompare(goodsInfo,this.data.cartProList,attrList)
      this.setData({
        picList: picList,
        detailInfo: dtlStr1,
        dataReady:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id
    this.setData({goodsId:id})
    this.getCartProList()
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