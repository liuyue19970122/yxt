// pages/stock/stock-in/stock-tpls/tpls.js
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterData:{
      name:'',
      status:2,
      pageNum:1,
      pageSize:10
    },
    tplsList:[],
    selTplsList:[],
    scrollTop:0,
    showPop:false,
    searchValue: '',
    proCheckValue:[],
    selCount:0,
  },
  //清除
  onClear(e) {
    let filterData = this.data.filterData
    let searchValue = this.data.searchValue
    if (searchValue&&this.data.activeSlider===0) {
      filterData.name= ''
      let scrollTop = 0
      this.setData({
        filterData,
        scrollTop,
        searchValue:''
      })
      let actType = 'refresh'
      this.getHandleOrderList(filterData, actType)
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
    filterData.name = searchValue
    let scrollTop = 0
    this.setData({
      searchValue,
      filterData,
      scrollTop
    })
    let actType = 'refresh'
    this.getHandleOrderList(filterData, actType)
  },
  
  //选择货品
  proCheckboxChange(e){
    let curArr = e.detail.value
    let prevArr=this.data.proCheckValue
    let difArr=this.getArrDifference(curArr,prevArr)
    let index=parseInt(difArr[0])
    let fl = this.data.tplsList
    let spl=this.data.selTplsList
    let flag=fl[index].cusChecked
    let curId=fl[index].keyId
    fl[index].cusChecked=!flag
    if(flag){
      spl.forEach((item,index)=>{
        if(item.keyId===curId){
          spl.splice(index,1)
        }
      })
    }else{
      spl.push(fl[index])
    }
    let selCount=spl.length
    this.setData({
      foodLis:fl,
      selTplsList:spl,
      proCheckValue:curArr,
      selCount
    })
  },
  //获取两个数组中不中的值
  getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  },
  //查看模板详情
  seeTplsDtl(e){
    let index=parseInt(e.currentTarget.dataset.index) 
    let list=this.data.tplsList
    let orderId=list[index].keyId
    wx.navigateTo({
      url: '../order-dtl/dtl?orderId='+orderId,
    })
  },
  //查看已选货品
  seeSelPro(){
    this.setData({showPop:true})
  },
  //关闭窗口
  closeSelPro(){
    this.setData({showPop:false})
  },
  //阻止冒泡
  preventPop(){},

  //删除选中模板
  delSelPro(e){
    let index=parseInt(e.currentTarget.dataset.index) 
    let selTplsList=this.data.selTplsList
    let keyId=selTplsList[index].keyId
    selTplsList.splice(index,1)
    let tplsList=this.data.tplsList
    tplsList.forEach(item=>{
      if(item.keyId===keyId){
        item.cusChecked=false
      }
    })
    let selCount=selTplsList.length
    this.setData({selTplsList,tplsList,selCount})
  },
  //提交数据
  goToSubmit(){
    let sl=this.data.selTplsList
    let slStr=JSON.stringify(sl)
    if(sl.length===1){
      wx.redirectTo({
        url: '../order-add/add?actType=fromImport&slStr='+slStr,
      })
    }else if(sl.length>1){
      let prdId=sl[0].producerId
      let flag=sl.every(item=>{
        return prdId===item.producerId
      });
      if(flag){
        wx.redirectTo({
          url: '../order-add/add?actType=fromImport&slStr='+slStr,
        })
      }else{
        wx.showToast({
          title: '请选择同一供货商',
          icon:'none'
        })
      }
    }else if(sl.length===0){
      wx.showToast({
        title: '请选择货品',
        icon:'none'
      })
    }
  },
  //数据对比
  compareList(list,selList){
    list.forEach(item=>{
      item.cusChecked=false
      selList.forEach(val=>{
        if(item.keyId==val.keyId){
          item.cusChecked=true
        }
      })
    })
    return list
  },
  //触底加载更多
  bindReachBottom(){
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.setData({filterData})
      this.getHandleOrderList(filterData,'reachBottom')
    }
  },
  //获取开单列表/stock/order/list
  //status 状态：0未提交，1已提交，2已完成
  getHandleOrderList(data, actType){
    let url = app.globalData.baseUrl +'apiStock/stock/order/list'
    util.getRequestListData(url,data,actType,this.orderListRes)
  },
  orderListRes(res,type){
    console.log(res)
    if(res.data.code==='200'){
      let list=res.data.content.list
      let hasNextPage=res.data.content.hasNextPage
      list.forEach(item=>{
        let mt = parseInt(item.openTime)
        item.cusDate = util.formatDate(mt)
        item.cusTotalMoney=util.getMoney(item.totalMoney).toString()
        item.cusChecked=false
      })
      let selList=this.data.selTplsList
      let cl=this.compareList(list,selList)
      if(type==='refresh'){
        this.setData({tplsList:cl})
      }
      if(type==='reachBottom'){
        let tpl=this.data.tplsList
        cl.forEach(item=>{
          tpl.push(item)
        })
        this.setData({tplsList:tpl})
      }
      this.setData({hasNextPage})
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let filterData=this.data.filterData
    this.getHandleOrderList(filterData,'refresh')
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