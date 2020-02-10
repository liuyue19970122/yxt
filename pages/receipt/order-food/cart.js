// pages/receipt/vage-list/list.js
var util = require('../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],
    selectFirstIndex: 0,
    selectSecondIndex: 0,
    pageNum: 1,
    pages: 1,
    pageSize: 10,
    foodList: [],
    showTypeModule: false,
    cartProList: [],
    cartEmpty: true,
    showCart: false,
    hideCartImg: true,
    buyTotalCount: 0,
    buyTotalMoney: 0,
    buyFavMoney: 0,
    proSpecList: [],
    selectSpecIndex: 0,
    selectFoodIndex: -1,
    // tableId: -1,
    vageName:'',
    tableId:[],
    tableName:''
  },
  bindVageName(e) {
    this.setData({
      vageName: e.detail.value
    })
  },
  goSearch() {
    this.setData({
      pageNum: 1,
      selectFirstIndex: 0
    })
    this.getFoodList()
  },
  bindTabCollapse() {
    var showTypeModule = !this.data.showTypeModule
    this.setData({
      showTypeModule
    })
  },
  //查看购物车详情
  bindShowCard() {
    if (this.data.cartEmpty) {
      wx.showToast({
        title: '购物车空的',
        icon: 'none'
      })
    } else {
      let show = !this.data.showCart
      let imgShow = !this.data.hideCartImg
      this.setData({
        showCart: show,
        hideCartImg: imgShow
      })
    }
  },
  closeCart() {
    this.setData({
      showCart: false,
      hideCartImg: true
    })
  },
  //购物车内商品操作
  bindCartAdd(e) {
    let index = parseInt(e.target.dataset.index)
    let cpl = this.data.cartProList
    let count = cpl[index].count
    cpl[index].count = count + 1
    var foodList = this.data.foodList
    foodList.map((item) => {
      if (item.keyId == cpl[index].foodId) {
        item.count++
      }
    })
    this.changeCartData(cpl)
    this.setData({
      cartProList: cpl,
      foodList: foodList
    })
  },
  bindCountReduce(e) {
    var foodList = this.data.foodList
    var cpl = this.data.cartProList
    cpl.map((item, index) => {
      if (item.foodId == foodList[e.currentTarget.dataset.index].keyId) {
        item.count--
      }
      if (item.count == 0) {
        cpl.splice(index, 1)
      }
    })
    foodList[e.currentTarget.dataset.index].count--
      this.setData({
        foodList: foodList,
        cartProList: cpl,
      })
    this.changeCartData(cpl)
  },
  bindCartReduce(e) {
    let index = parseInt(e.target.dataset.index)
    let cpl = this.data.cartProList
    let count = cpl[index].count
    var foodList = this.data.foodList
    foodList.map((item) => {
      if (item.keyId == cpl[index].foodId) {
        item.count--
      }
    })
    if (count === 1) {
      cpl.splice(index, 1)
    } else {
      cpl[index].count = count - 1
    }
    this.changeCartData(cpl)
    this.setData({
      cartProList: cpl,
      foodList: foodList
    })
  },
  //购物操作展示某个商品规格
  bindBuy(e) {
    var foodList = this.data.foodList
    this.setData({
      selectFoodIndex: e.currentTarget.dataset.index
    })
    if (foodList[this.data.selectFoodIndex].attrList.length == 1) {
      var obj = foodList[this.data.selectFoodIndex].attrList[0]
      var list = this.data.cartProList
      var isNew = true
      list.map((item) => {
        if (item.foodId == foodList[this.data.selectFoodIndex].keyId) {
          foodList[this.data.selectFoodIndex].count++
            if (obj.keyId == item.attrId) {
              item.count++
                isNew = false
            }
        }
      })
      if (isNew) {
        var item = {
          goodsName: this.data.foodList[this.data.selectFoodIndex].foodName,
          attrName: obj.attrName,
          sellPrice: obj.sellPrice,
          attrPrice: obj.attrPrice,
          count: 1,
          foodId: this.data.foodList[this.data.selectFoodIndex].keyId,
          goodsPic: this.data.foodList[this.data.selectFoodIndex].mainPic,
          attrId: obj.keyId
        }
        foodList[this.data.selectFoodIndex].count = 1
        list.push(item)
      }
      var totalMoney = 0
      var count = 0
      list.map((item) => {
        totalMoney += item.sellPrice * item.count
        count += item.count
      })
      this.setData({
        cartProList: list,
        proSpecShow: false,
        buyTotalCount: count,
        cartEmpty: false,
        buyTotalMoney: util.getMoney(totalMoney),
        foodList: foodList
      })
    } else {
      this.setData({
        proSpecShow: true
      })
    }

  },
  // 选择规格
  selectSpec: function(e) {
    this.setData({
      selectSpecIndex: e.target.dataset.index,
    })
  },
  // 确认加入购物车
  submitAdd: function() {
    var that = this
    var obj = {}
    this.data.foodList[that.data.selectFoodIndex].attrList.map((item, index) => {
      if (index == that.data.selectSpecIndex) {
        obj = item
      }
    })
    var list = this.data.cartProList
    var foodList = this.data.foodList
    var isNew = true
    var isAnothor = true
    list.map((item) => {
      if (item.foodId == foodList[this.data.selectFoodIndex].keyId) {
        if(isAnothor){
          foodList[this.data.selectFoodIndex].count++
          isAnothor = false
        }
        if (obj.keyId == item.attrId) {
          item.count++
          isNew = false
        }
      }
    })
    if (isNew) {
      var item = {
        goodsName: foodList[this.data.selectFoodIndex].foodName,
        attrName: obj.attrName,
        sellPrice: obj.sellPrice,
        attrPrice: obj.attrPrice,
        count: 1,
        foodId: foodList[this.data.selectFoodIndex].keyId,
        goodsPic: foodList[this.data.selectFoodIndex].mainPic,
        attrId: obj.keyId
      }
      list.push(item)
    }
    if (isAnothor) {
      foodList[this.data.selectFoodIndex].count = 1
    }
    this.changeCartData(list)
    this.setData({
      cartProList: list,
      proSpecShow: false,
      // buyTotalCount: count,
      // cartEmpty: false,
      // buyTotalMoney: util.getMoney(totalMoney),
      foodList: foodList
    })
  },
  //购物车数据更改
  changeCartData(cartProList) {
    let cpl = cartProList.length
    if (cpl) {
      let buyTotalCount = 0
      let buyTotalMoney = 0
      let buyFavMoney = 0
      let oriPrice = 0
      cartProList.forEach((item, index) => {
        buyTotalCount += item.count
        buyTotalMoney += item.sellPrice * item.count
      })
      buyFavMoney = oriPrice - buyTotalMoney
      buyTotalMoney = util.getMoney(buyTotalMoney).toString()
      buyFavMoney = util.getMoney(buyFavMoney).toString()
      let hideCartImg = this.data.showCart ? false : true
      this.setData({
        buyTotalCount,
        buyFavMoney,
        buyTotalMoney,
        hideCartImg,
        cartEmpty: false
      })
    } else {
      this.setData({
        cartEmpty: true,
        hideCartImg: true,
        showCart: false
      })
    }
    let cplStr = JSON.stringify(cartProList)
    // wx.setStorage({
    //   key: 'cartProList',
    //   data: cplStr,
    // })
  },
  // 提交购物车
  bindToSubmit() {
    wx.navigateTo({
      url: '/pages/receipt/place-order/list?tableId=' + JSON.stringify(this.data.tableId) + "&orderId=" + this.data.orderId+'&tableName='+this.data.tableName,
    })
  },
  //清空购物车
  bindClearCart() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否清空购物车',
      success(res) {
        if (res.confirm) {
          var list=that.data.foodList
          list.map((item)=>{
            item.count=0
          })
          that.setData({
            cartProList: [],
            showCart: false,
            cartEmpty: true,
            hideCartImg: true,
            foodList:list
          })
          // wx.setStorage({
          //   key: 'cartProList',
          //   data: '[]',
          // })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //关闭某个商品规格详情
  closeProSpec() {
    this.setData({
      proSpecShow: false
    })
  },
  goAdd() {
    wx.navigateTo({
      url: '../vage/add/add',
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '../vege/vege-detail/detail?id=' + e.currentTarget.dataset.id + "&type=1",
    })
  },
  getCateList() {
    var url = app.globalData.baseUrl + 'apiMall/food/cate/list?t=' + times
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res) {
    var cateList = res.data.content
    var that = this
    cateList.map((item) => {
      var jtem = {
        keyId: item.keyId,
        cateName: "全部"
      }
      item.nextList = JSON.parse(item.nextList)
      item.nextList.unshift(jtem)
    })
    var item = {
      keyId: -1,
      cateName: '全部',
      nextList: [{
        keyId: -1,
        cateName: '全部'
      }]
    }
    cateList.unshift(item)
    this.setData({
      cateList,
    })
    if (cateList.length > 0) {
      this.getFoodList()
    }
  },
  changeFirstCate: function(e) {
    this.setData({
      selectFirstIndex: e.currentTarget.dataset.index,
      selectSecondIndex: 0,
      pageNum: 1
    })
    // wx.showLoading({
    //   title: '获取中',
    // })
    this.getFoodList()
  },
  changeSecondCateTab(e) {
    this.setData({
      selectSecondIndex: e.detail.index,
      showTypeModule: false,
      pageNum: 1
    })
    this.getFoodList()
  },
  changeSecondCate(e) {
    this.setData({
      selectSecondIndex: e.currentTarget.dataset.index,
      showTypeModule: false
    })
  },
  goInsert() {
    wx.navigateTo({
      url: '../vege/default-list/list',
    })
  },
  getFoodList() {
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl + 'apiMall/food/inst/list?t=' + times
    var data = {
      cateId: this.data.cateList[this.data.selectFirstIndex].nextList.length > 0 ? this.data.cateList[this.data.selectFirstIndex].nextList[this.data.selectSecondIndex].keyId : this.data.cateList[this.data.selectFirstIndex].keyId,
      pageNum: this.data.pageNum,
      name:this.data.vageName,
      pageSize: this.data.pageSize
    }
    util.getRequestListData(url, data, false, this.foodListRes)
  },
  foodListRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    var cartProList = this.data.cartProList
    res.data.content.list.map((item) => {
      item.attrList = JSON.parse(item.attrList)
      item.count = 0
      cartProList.map((ktem) => {
        if (ktem.foodId == item.keyId) {
          item.count += ktem.count
        }
      })
      item.attrList.map((jtem) => {
        jtem.attrPrice = util.getMoney(jtem.sellPrice)
      })
    })
    var list = this.data.pageNum == 1 ? res.data.content.list : this.data.foodList.concat(res.data.content.list)
    this.setData({
      foodList: list,
      pages: res.data.content.pages
    })
  },
  getNextPage() {
    var that = this
    if (that.data.pages > that.data.pageNum) {
      this.setData({
        pageNum: ++that.data.pageNum
      })
      // wx.showLoading({
      //   title: '获取中',
      // })
      that.getFoodList()
    } else {
      wx.showToast({
        title: '已经是最后一页',
        duration: 2000,
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.tableId) {
      this.setData({
        tableId: JSON.parse(options.tableId),
        tableName:options.tableName
      })
    }
    if(options.orderId){
      this.setData({
        orderId: options.orderId
      })
    }
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
    this.setData({
      pageNum: 1
    })
    this.getCateList()
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