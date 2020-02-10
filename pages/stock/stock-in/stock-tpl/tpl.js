// pages/receipt/vege/default-list/list.js
var util = require('../../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateImageList:[],
    curCateId:'',
    intoViewId:'',
    filterData:{
      cateId:'-1',
      name:'',
      pageNum: 1,
      pageSize: 10,
    },
    foodList: [],
    scrollTop:0,
    selProList:[],
    showPop:false,
    selectList: [],
    searchValue: '',
    proCheckValue:[],
    selCount:0,
    pageInType:'fromList',
    methodKey:''
  },
  //清除
  onClear(e) {
    let filterData = this.data.filterData
    let searchValue = this.data.searchValue
    if (searchValue&&this.data.activeSlider===0) {
      filterData.name= ''
      filterData.pageNum = 1
      let scrollTop = 0
      this.setData({
        filterData,
        scrollTop,
        searchValue:''
      })
      let actType = 'refresh'
      this.getFoodList(filterData, actType)
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
    filterData.pageNum = 1
    let scrollTop = 0
    this.setData({
      searchValue,
      filterData,
      scrollTop
    })
    let actType = 'refresh'
    this.getFoodList(filterData, actType)
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
      this.getFoodList(filterData,actType)
    }
  },
  //选择货品
  proCheckboxChange(e){
    let curArr = e.detail.value
    let prevArr=this.data.proCheckValue
    let difArr=this.getArrDifference(curArr,prevArr)
    let index=parseInt(difArr[0])
    let fl = this.data.foodList
    let spl=this.data.selProList
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
      selProList:spl,
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
    let selProList=this.data.selProList
    let keyId=selProList[index].keyId
    selProList.splice(index,1)
    let foodList=this.data.foodList
    foodList.forEach(item=>{
      if(item.keyId===keyId){
        item.cusChecked=false
      }
    })
    let selCount=selProList.length
    this.setData({selProList,foodList,selCount})
  },
  //加载更多
  bindReachBottom(){
    if(this.data.hasNextPage){
      let filterData=this.data.filterData
      filterData.pageNum+=1
      this.setData({filterData})
      this.getFoodList(filterData,'reachBottom')
    }
  },
  //提交数据
  goToSubmit(){
    let sl=this.data.selProList
    let pageInType=this.data.pageInType
    if(sl.length){
      let proList=JSON.stringify(sl)
      let proListStr = proList.replace(/\?/g, '*')
      let proInfoStr2 = proListStr.replace(/&/g, '#')
      let imgListStr3 = proInfoStr2.replace(/=/g, '$')
      if(pageInType=='fromList'){
        wx.redirectTo({
          url: '/pages/stock/stock-in/stock-import/import?list='+imgListStr3+'&pageInType='+pageInType+'&method=refreshGoodsList',
        })
      }
      if(pageInType==='fromAdd'){
        let prevPage=util.getPrevPage()
        let proList=prevPage.data.proList
        sl.forEach(item=>{
          proList.push(item)
        })
        prevPage.setData({proList})
        wx.navigateBack({delta:1})
      }
    }else{
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
  //获取系统默认货品///default/stock/list
  getFoodList(data,type) {
    wx.showLoading({
      title: '获取中...',
    })
    let url = app.globalData.baseUrl + 'apiStock/default/stock/list?t=' + times
    util.getRequestListData(url, data, type, this.foodListRes)
  },
  foodListRes(res,type) {
    wx.hideLoading()
    if(res.data.code==='200'){
      let selList=this.data.selProList
      let list = res.data.content.list
      let hasNextPage=res.data.content.hasNextPage
      let cpl=this.compareList(list,selList)
      console.log(cpl)
      if(type==='refresh'){
        this.setData({foodList:cpl,proCheckValue})
      }
      if(type==='reachBottom'){
        let fl=this.data.foodList
        cpl.forEach(item=>{
          fl.push(item)
        })
        this.setData({foodList:fl})
      }
      let proCheckValue=[]
      cpl.forEach((item,index)=>{
        if(item.cusChecked){
          proCheckValue.push(index)
        }
      })
      this.setData({hasNextPage,proCheckValue})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let pageInType=options.pageInType
    let methodKey=options.methodKey
    if(methodKey&&methodKey!='undefined'){
      this.setData({methodKey})
    }
    this.setData({pageInType})
    let filterData=this.data.filterData
    this.getFoodList(filterData,'refresh')
    this.getStoreCateList()
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