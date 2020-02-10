// pages/mall/mall-cart/cart.js
let util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartProList: [],
    oriCartProList:'[]',
    allChecked: true,
    isChecked: true,
    buyAllMoney: 0
  },
  //店铺商品显示或隐藏
  bindCollaps(e) {
    console.log(e)
    let index = parseInt(e.currentTarget.dataset.index)
    let list = this.data.cartProList
    list[index].cusCollapse = !list[index].cusCollapse
    this.setData({
      cartProList: list
    })
  },
  //店铺全选
  storeCheckboxChange(e) {
    let index = parseInt(e.target.dataset.index)
    let val = e.target.dataset.value
    let listStr=this.data.oriCartProList
    let list = JSON.parse(listStr)
    let curList = this.data.cartProList
    let orgId = curList[index].orgId
    list.forEach(item => {
      if (orgId === item.orgId) {
        item.cusChecked = val ? false : true
        let carId = item.carId
        let buyCount = item.buyCount
        let chooseFlag = val ? '0' : '1'
        this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
      }
    })
    this.changeCartPro(list, false)
    console.log(e)
  },
  //店铺单选更改
  cartCheckboxChange(e) {
    let val = e.target.dataset.value
    let orgId = e.target.dataset.org
    let goodsId = e.target.dataset.goods
    let attrId = e.target.dataset.key
    let listStr = this.data.oriCartProList
    let list = JSON.parse(listStr)
    // let list=this.data.cartProList
    list.forEach(item => {
      if (orgId === item.orgId && goodsId === item.goodsId && attrId === item.attrId) {
        item.cusChecked = val ? false : true
        let carId = item.carId
        let buyCount = item.buyCount
        let chooseFlag = val ? '0' : '1'
        this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
      }
    })
    this.changeCartPro(list, false)
  },
  //bindCartReduce
  bindCartReduce(e){
    let orgId = e.target.dataset.org
    let goodsId = e.target.dataset.goods
    let attrId = e.target.dataset.key
    let listStr = this.data.oriCartProList
    let list = JSON.parse(listStr)
    let curCount=0
    let curIndex=0
    let carId=0
    list.forEach((item,index)=> {
      if (orgId === item.orgId && goodsId === item.goodsId && attrId === item.attrId) {
        curCount=item.cusBuyCount
        curIndex=index
        carId=item.carId
      }
    })
    if(curCount-1===0){
      list.splice(curIndex, 1)
      this.delCartRecord({ carId })//data={carId}
    }else{
      list[curIndex].cusBuyCount = curCount - 1
      let buyCount = curCount - 1
      let chooseFlag = list[curIndex].cusChecked ? '1' : '0'
      this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    }
    this.changeCartPro(list, false)
  },
  bindCartAdd(e){
    let orgId = e.target.dataset.org
    let goodsId = e.target.dataset.goods
    let attrId = e.target.dataset.key
    let listStr = this.data.oriCartProList
    let list = JSON.parse(listStr)
    let curCount = 0
    let curIndex = 0
    let carId = 0
    list.forEach((item,index) => {
      if (orgId === item.orgId && goodsId === item.goodsId && attrId === item.attrId) {
        curCount = item.cusBuyCount
        curIndex = index
        carId = item.carId
      }
    })
    console.log(curCount)
    list[curIndex].cusBuyCount = curCount + 1
    let buyCount = curCount + 1
    let chooseFlag = list[curIndex].cusChecked ? '1' : '0'
    this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    this.changeCartPro(list, false)
    console.log(list)
  },
  //
  //选择所有
  allCheckboxChange(e) {
    let val = e.target.dataset.value
    let listStr = this.data.oriCartProList
    let list = JSON.parse(listStr)
    list.forEach(item => {
      item.cusChecked = val ? false : true
      let carId=item.carId
      let buyCount = item.buyCount
      let chooseFlag = val ? '0' : '1'
      this.updateCartRecord({ carId, buyCount, chooseFlag })//carId,buyCount,chooseFlag
    })
    this.changeCartPro(list, false)
  },
  //清空购物车/shopcar/release
  clearCart(){
    let _this=this
    wx.showModal({
      title: '提示',
      content: '确认是否删清空购物车？',
      success(res) {
        if (res.confirm) {
          let url = app.globalData.baseUrl + 'apiMall/shopcar/release'
          util.postRequestList(url, {}, false, _this.clearCartRes)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  clearCartRes(res,type){
    if(res.data.code==='200'){
      wx.showToast({
        title: '清空成功',
      })
      this.setData({cartProList:[]})
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  //结算
  goToSubmit() {
    let isChecked = this.data.isChecked
    if (isChecked) {
      wx.navigateTo({
        url: '/pages/mall/mall-suborder/order',
      })
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
    }
  },
  //购物车数据更改
  changeCartPro(list, actType) {
    if (list.length) {
      let arr = []
      list.forEach(item => {
        arr.push(item.orgId)
      })
      let arrUni = util.uniqueArr(arr)
      let arrObj = []
      let allMoney = 0
      let allCheck = true
      let isChecked = false
      arrUni.forEach(item => {
        let obj = {
          orgName: '',
          orgId: item,
          cusChecked: true,
          proList: []
        }
        list.forEach(val => {
          if (item === val.orgId) {
            obj.orgName = val.orgName
            obj.proList.push(val)
            if (val.cusChecked === false) {
              obj.cusChecked = false
              allCheck = false
            } else {
              allMoney += val.attrPrice * val.cusBuyCount
              isChecked = true
            }
          }
        })
        arrObj.push(obj)
      })
      let curList = this.data.cartProList
      arrObj.forEach((item, index) => {
        if (actType) {
          item.cusCollapse = false
        } else {
          item.cusCollapse = curList[index].cusCollapse
        }
      })
      let allMoneyStr = util.getMoney(allMoney).toString()
      let listStr = JSON.stringify(list)
      this.setData({
        cartProList: arrObj,
        oriCartProList:listStr,
        buyAllMoney: allMoneyStr,
        allChecked: allCheck,
        isChecked: isChecked
      })
      console.log(arrObj)
    }else{
      this.setData({
        cartProList: [],
        oriCartProList:'[]',
        buyAllMoney: '0.00',
        allChecked: false,
        isChecked: false
      })
    }
  },
  //更新一条数据功能/shopcar/update
  //carId,buyCount,chooseFlag
  updateCartRecord(data) {
    let url = app.globalData.baseUrl + 'apiMall/shopcar/update'
    util.postRequestList(url, data, false, this.updateCartRecordRes)
  },
  updateCartRecordRes(res, type) { },
  // //清空购物车/shopcar/release//无参
  // clearCartRecord() {
  //   let data = {}
  //   let url = app.globalData.baseUrl + 'apiMall/shopcar/release'
  //   util.postRequestList(url, data, false, this.clearCartRecordRes)
  // },
  clearCartRecordRes(res, type) { },
  //删除购物记录///shopcar/delete//carId
  delCartRecord(data) {
    let url = app.globalData.baseUrl + 'apiMall/shopcar/delete'
    util.postRequestList(url, data, false, this.delCartRecordRes)
  },
  delCartRecordRes(res, type) { },
  //获取购物车数据///shopcar/list
  getCartProList() {
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    let url = app.globalData.baseUrl + 'apiMall/shopcar/list'
    util.getRequestList(url, false, this.getCartProListRes)
  },
  getCartProListRes(res, type) {
    wx.hideLoading()
    if (res.data.code === '200') {
      let list = res.data.content
      console.log(list)
      list.forEach(item => {
        item.cusChecked = item.chooseFlag == "1" ? true : false
        item.cusBuyCount = item.buyCount
        item.cusSalePrice = util.getMoney(item.attrPrice).toString()
        item.cusOriPrice = util.getMoney(item.attrNormalPrice).toString()
      })
      let listStr=JSON.stringify(list)
      this.setData({oriCartProList:listStr})
      this.changeCartPro(list,true)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getCartProList()
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