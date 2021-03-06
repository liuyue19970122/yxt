// pages/receipt/vege/default-list/list.js
var util = require('../../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pages: 1,
    pageSize: 10,
    foodList: [],
    selectList: [],
    searchName: '',
    changeList: [],
    multiCateName: '请选择菜品分类',
    multiProArray: [],//类别数组
    multiProIndex: [0, 0],
    oldMultiProIndex: '[0,0]',
    isNewPage: true,
    isSubmit: false,
    tplList:[]
  },
  //商品分类改变
  bindCateChange(e) {
    let val = e.detail.value
    let fi = val[0]
    let si = val[1]
    let multiProArray = this.data.multiProArray
    let cateId = multiProArray[1][si].keyId
    let multiCateName = multiProArray[0][fi].cateName + '/' + multiProArray[1][si].cateName
    // let proInfo = this.data.proInfo
    // proInfo.cateId = cateId
    let oldMultiProIndex = JSON.stringify(val)
    this.setData({
      multiCateName,
      cateId,
      oldMultiProIndex
    })
  },
  bindCateCancel(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let arr = JSON.parse(this.data.oldMultiProIndex)
    data.multiProIndex[0] = arr[0]
    data.multiProIndex[1] = arr[1]
    let index = arr[0]
    let si = arr[1]
    let cateId = this.data.multiProArray[0][index].keyId
    let obj = ''
    cateList.forEach(item => {
      if (item.keyId === cateId) {
        obj = item.nextList
      }
    })
    let nextList = obj
    data.multiProArray[1] = nextList
    let multiCateName = data.multiProArray[0][index].cateName + '/' + data.multiProArray[1][si].cateName
    this.setData({ multiCateName })
    this.setData(data)
  },
  bindCateColumnChange(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let multiCateName = ''
    let columnIndex = e.detail.column
    data.multiProIndex[columnIndex] = e.detail.value;
    switch (columnIndex) {
      case 0:
        let fi_0 = e.detail.value
        let cateId = data.multiProArray[columnIndex][fi_0].keyId
        let obj = ''
        cateList.forEach(item => {
          if (item.keyId === cateId) {
            obj = item.nextList
          }
        })
        let nextList = obj
        data.multiProArray[1] = nextList
        data.multiProIndex[1] = 0;
        multiCateName = data.multiProArray[0][fi_0].cateName + '/' + data.multiProArray[1][0].cateName
        break;
      case 1:
        data.multiProIndex[1] = e.detail.value;
        let fi_1 = data.multiProIndex[0]
        let si_1 = data.multiProIndex[1]
        multiCateName = data.multiProArray[0][fi_1].cateName + '/' + data.multiProArray[1][si_1].cateName
        break;
    }
    this.setData(data);
    this.setData({ multiCateName })
  },
  goAddCate() {
    wx.navigateTo({
      url: '/pages/receipt/vege-add-category/add-cate',
    })
  },
  //获取分类列表
  getCateList() {
    var url = app.globalData.baseUrl + 'apiMall/food/cate/list?t=' + times
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res, type) {
    if (res.data.code === '200') {
      let cateList = res.data.content
      let twoArr = []
      let multiProIndex = [0, 0]
      let multiCateName = '请选择货品类别'
      if (cateList.length) {
        cateList.map((item) => {
          var jtem = {
            keyId: item.keyId,
            cateName: item.cateName
          }
          item.nextList = JSON.parse(item.nextList)
          item.nextList.unshift(jtem)
        })
        if (this.data.isNewPage) {
          let nextList = cateList[0].nextList
          twoArr[0] = cateList
          twoArr[1] = nextList
          let cateId = nextList[0].keyId
          this.setData({
            cateId
          })
          multiCateName = twoArr[0][0].cateName + '/' + twoArr[1][0].cateName
        } else {
          let cateId = this.data.cateId
          twoArr[0] = cateList
          cateList.forEach((item, fi) => {
            let nl = item.nextList
            nl.forEach((val, si) => {
              if (cateId == val.keyId) {
                twoArr[1] = nl
                multiProIndex[0] = fi
                multiProIndex[1] = si
                multiCateName = item.cateName + '/' + val.cateName
              }
            })
          })
        }
        let oldMultiProIndex = JSON.stringify(multiProIndex)
        this.setData({
          multiCateName,
          multiProIndex,
          oldMultiProIndex,
          multiProArray: twoArr,
          proCateList: cateList
        })
      } else {
        this.setData({
          multiCateName,
          multiProIndex,
        })
      }
    }
  },
  searchChange: function (e) {
    this.setData({
      searchName: e.detail
    })
  },
  goSearch() {
    this.setData({
      pageNum: 1
    })
    this.getFoodList()
  },
  getFoodList() {
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl + 'apiMall/food/default/tempList?t=' + times
    var data = {
      foodName: this.data.searchName
    }
    util.getRequestListData(url, data, false, this.tplRes)
  },
  tplRes(res) {
    wx.hideLoading()
    var list = res.data.content
    list.map((item) => {
      item.status = false
      // item.sellPrice = util.getMoney(item.sellPrice)
    })
    // var list = this.data.pageNum > 1 ? this.data.foodList.concat(list) : list
    this.setData({
      tplList: list,
      pages: res.data.content.pages
    })
  },
  getNextPage() {
    var that = this
    if (that.data.pages > that.data.pageNum) {
      this.setData({
        pageNum: ++that.data.pageNum
      })
      that.getFoodList()
    } else {
      wx.showToast({
        title: '已经是最后一页',
        duration: 2,
      })
    }
  },
  changeStatus(e) {
    var list = this.data.tplList
    list.map((item, index) => {
      if (index == e.currentTarget.dataset.index) {
        item.status = !item.status
      }
    })
    this.setData({
      tplList: list
    })
  },
  onSubmit() {
    if(!this.data.cateId){
      wx.showToast({
        icon: 'none',
        title: '请选择分类',
      })
      return false
    }
    if (this.data.isSubmit) {
      return false
    }
    this.setData({
      isSubmit: true
    })
    var url = app.globalData.baseUrl + 'apiMall/food/admin/initDefaultByTemp?t=' + times
    var list = []
    this.data.tplList.map((item) => {
      if (item.status) {
        list.push(item.keyId)
      }
    })
    var data = {
      cateId: this.data.cateId,
      tmpIds: list
    }
    util.postRequestList(url, data, false, this.submitRes)
  },
  submitRes(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: res.data.message,
        duration: 2
      })
    }
    this.setData({
      isSubmit: false
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '../tpl-food-list/list?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.cateId) {
      this.setData({
        cateId: options.cateId,
        isNewPage: false
      })
    } else {

    }
    this.getFoodList()
    // var prevPage = util.getPrevPage()
    // var cateId = prevPage.data.cateList[prevPage.data.selectFirstIndex].nextList.length > 0 ? prevPage.data.cateList[prevPage.data.selectFirstIndex].nextList[prevPage.data.selectSecondIndex].keyId : prevPage.data.cateList[prevPage.data.selectFirstIndex].keyId;
    // this.setData({
    //   cateId: cateId
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
    this.setData({
      isSubmit: false
    })
    this.getCateList()
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
    // this.getNextPage()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})