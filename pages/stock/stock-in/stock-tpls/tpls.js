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
    pageInType:'',
    methodKey:''
  },
   //清除
   onClear(e) {
    let filterData = this.data.filterData
    let searchValue = this.data.searchValue
    if (searchValue&&this.data.activeSlider===0) {
      filterData.name= ''
      filterData.pageNum=1
      let scrollTop = 0
      this.setData({
        filterData,
        scrollTop,
        searchValue:''
      })
      let actType = 'refresh'
      this.getTpls(filterData, actType)
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
    filterData.pageNum=1
    let scrollTop = 0
    this.setData({
      searchValue,
      filterData,
      scrollTop
    })
    let actType = 'refresh'
    this.getTpls(filterData, actType)
  },
  //bindReachBottom
  bindReachBottom(){
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.setData({filterData})
      this.getTpls(filterData,'reachBottom')
    }
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
    let id=list[index].keyId
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-tpls-dtl/dtl?id='+id,
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
    let proCheckValue=[]
    tplsList.forEach(item=>{
      if(item.keyId===keyId){
        item.cusChecked=false
      }
    })
    tplsList.forEach((item,index)=>{
      if(item.cusChecked){
        proCheckValue.push(index.toString())
      }
    })
    let selCount=selTplsList.length
    this.setData({selTplsList,tplsList,selCount,proCheckValue})
  },
  //提交数据
  goToSubmit(){
    let sl=this.data.selTplsList
    if(sl.length){
      let data={
        tmpId:[]
      }
      sl.forEach(item=>{
        data.tmpId.push(item.keyId)
      })
      this.selTplsRequest(data)
    }else{
      wx.showToast({
        title: '请选择货品',
        icon:'none'
      })
    }
  },
  //选好模板/stock/inst/initTmpDefault
  selTplsRequest(data){
    wx.showLoading({
      title: '提交中...',
      mask:true
    })
    let url = app.globalData.baseUrl + 'apiStock/stock/inst/initTmpDefault'
    util.postRequestList(url, data, false, this.selTplsRes)
  },
  selTplsRes(res,type){
    wx.hideLoading()
    if(res.data.code=='200'){
      let prevPage=util.getPrevPage()
      let methodKey=this.data.methodKey
      prevPage[methodKey]()
      wx.showToast({
        title: '添加成功',
        duration:2000,
        mask:true,
        success:function(){
          wx.navigateBack({
            delta:1,
            complete: (res) => {},
          })
        }
      })
    }else{
      wx.showToast({
        title: res.data.message,
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
  //获取模模板列表/default/stock/listTmp
  //name
  getTpls(data,actType){
    let url = app.globalData.baseUrl + 'apiStock/default/stock/listTmp'
    util.getRequestListData(url,data, actType, this.getTplsRes)
  },
  getTplsRes(res,type){
    if(res.data.code==='200'){
      let list=res.data.content.list
      let hasNextPage=res.data.content.hasNextPage
      list.forEach(item=>{
        item.cusCrtTime=util.formatDate(item.crtTime)
      })
      let selList=this.data.selTplsList
      let cl=this.compareList(list,selList)
      if(type==='refresh'){
        this.setData({tplsList:cl})
      }
      if(type==='reachBottom'){
        let tpls=this.data.tplsList
        cl.forEach(item=>{
          tpls.push(item)
        })
        this.setData({tplsList:tpls})
      }
      this.setData({hasNextPage})
      console.log(res)
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
    let pageInType=options.pageInType
    let methodKey=''
    if(pageInType==='fromList'){
      methodKey=options.method
    }
    this.setData({pageInType,methodKey})
    let filterData=this.data.filterData
    this.getTpls(filterData,'refresh')
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