// pages/finance/rem-account/add/add.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
let util = require('../../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billInfoRules:{
      typeCode:{required:true,msg:'请选择记账类型'},
      title:{required:true,msg:'请输入记账名称'},
      money:{required:true,msg:'请输入记账金额'},
      userId:{required:true,msg:'请选择记账经办人'},
      billTime:{required:true,msg:'请选择记账日期'}
    }
  },
  //initData数据还原
  initData(){
    this.setData({
      dateContent:'请选择时间',
      typeName:'请选择类型',
      typeIndex:'',
      typeList:[],
      userName:'请选择经办人',
      userIndex:'',
      userList:[],
      imgList:[],
      billInfo:{
        typeCode:'',
        title:'',
        money:'',
        userId:'',
        billTime:'',
        linkImgs:'[]',
        remark:'',
      },
    })
  },
  //类型选择
  bindTypeChange(e){
    console.log(e)
    let index=parseInt(e.detail.value)
    let tl=this.data.typeList
    let tc=tl[index].typeCode
    let tn=tl[index].typeName
    this.setData({
      typeIndex:index,
      typeName:tn,
      ['billInfo.typeCode']:tc
    }) 
  },
  //bindTitleInput输入记账名称
  bindTitleInput(e){
    this.setData({
      ['billInfo.title']:e.detail.value
    })
  },
  //记账金额
  bindMoneyInput(e){
    let val=e.detail.value
    let money=util.clearNoNum(val)
    this.setData({
      ['billInfo.money']:money
    })
  },
  //记账经办人
  bindUserChange(e){
    console.log(e)
    let index=parseInt(e.detail.value)
    let ul=this.data.userList
    let uc=ul[index].keyId
    let un=ul[index].name
    this.setData({
      userIndex:index,
      userName:un,
      ['billInfo.userId']:uc
    }) 
  },
  //记账时间
  bindDateChange(e){
    let dt = e.detail.value
    let od=dt.replace(/'-'/g,'/')
    let ms=Date.parse(new Date(od))
    this.setData({
      dateContent:dt,
      ['billInfo.billTime']:ms
    })
  },
  //备注
  bindMarkInput(e){
    this.setData({
      ['billInfo.remark']:e.detail.value
    })
  },
  //选择图片
  bindUploadImg() {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var files = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.fileUploadUrl + '/apiUser/file/upload',
          filePath: files[0],
          name: 'file',
          header: {
            Authorization: wx.getStorageSync('localToken').token
          },
          success(res) {
            console.log(res)
            let imgList=that.data.imgList
            let imgSrc=JSON.parse(res.data).content
            imgList.push(imgSrc)
            that.setData({
              imgList,
              ['billInfo.linkImgs']:JSON.stringify(imgList)
            })
          }
        })
      },
    })
  },
  //删除图片
  deleteCurImg(e){
    let index=parseInt(e.target.dataset.index) 
    let imgList=this.data.imgList
    imgList.splice(index,1)
    this.setData({
      imgList,
      ['billInfo.linkImgs']:JSON.stringify(imgList)
    })
  },
  //提示警告信息
  warnInfo(msg){
    Notify({ type: 'warning', message: msg });
  },
  //提交添加一笔账
  submitBill(){
    let rules=this.data.billInfoRules
    let bill=this.data.billInfo
    console.log(bill)
    for(let key in rules){
      if(rules[key].required&&!bill[key]){
        this.warnInfo(rules[key].msg)
        return
      }
    }
    this.billAddReq(bill)
  },
  //获取员工列表///user/list
  getUserList(){
    let data={
      name:'',
      mobile:'',
      idCard:''
    }
    let url = app.globalData.baseUrl +'apiUser/user/list'
    util.getRequestListData(url,data,false,this.userListRes)
  },
  userListRes(res,type){
    if(res.data.code==='200'){
      this.setData({
        userList:res.data.content
      })
    }
  },
  //获取记账类型//bookbill/listType
  getBillType(){
    let url = app.globalData.baseUrl +'apiMall/bookbill/listType'
    util.getRequestList(url,false,this.billTypeRes)
  },
  billTypeRes(res,type){
    if(res.data.code==='200'){
      this.setData({
        typeList:res.data.content
      })
    }
  },
  //添加一笔记账//bookbill/add
  //typeCode,title,content,billTime
  billAddReq(data){
    let url = app.globalData.baseUrl +'apiMall/bookbill/add'
    util.postRequestList(url,data,false,this.addReqRes)
  },
  addReqRes(res,type){
    let _this=this
    if(res.data.code==='200'){
      wx.showModal({
        title:'提示',
        content:'添加成功',
        showCancel:true,
        cancelText:'返回',
        confirmText:'继续',
        success:function(res){
          if(res.confirm){
            _this.initData()
          }else if (res.cancel) {
            wx.redirectTo({
              url:'/pages/finance/rem-account/list/list'
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
    this.getUserList()
    this.getBillType()
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