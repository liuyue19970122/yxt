// pages/oa/add-staff/add-staff.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleList:[],
    tel:'',
    name:'',
    money:'',
    roleIndex:0,
    date:'',
    loginName:"",
    password:'',
    idCard:'',
    show: false,
    salaryArr:{},
    typeName:'',
    isSubmit:false
  },
  goAddSalary(){
    this.setData({
      show:true
    })
  },
  addSalary(){
    var list=this.data.salaryArr
    var str =this.data.typeName
    list[str]=''
    this.setData({
      salaryArr:list,
      typeName:''
    })
  },
  getTypeName(e){
    this.setData({
      typeName:e.detail
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  getSalary(e){
    var list=this.data.salaryArr
    list[e.currentTarget.dataset.index]=e.detail
    // list.map((item,index)=>{
    //   if(index==e.currentTarget.dataset.index){
    //     item.value=e.detail
    //   }
    // })
    this.setData({
      salaryArr:list
    })
  },
  getRoleList(){
    var url = app.globalData.baseUrl +'apiUser/role/list'
    util.getRequestList(url,false,this.roleRes)
  },
  roleRes(res){
    if(res.data.code==200){
      this.setData({
        roleList:res.data.content
      })
    }
  },
  getDate(e){
    this.setData({
      date: e.detail.value
    })
  },
  getName(e){
    this.setData({
      name:e.detail
    })
  },
  getTel(e){
    this.setData({
      tel: e.detail
    })
  },
  getMoney(e){
    var detail = util.clearNoNum(e.detail)
    this.setData({
      money: detail
    })
  },
  getIdCard(e) {
    this.setData({
      idCard: e.detail
    })
  },
  getLoginName(e) {
    this.setData({
      loginName: e.detail
    })
  },
  getPassword(e) {
    this.setData({
      password: e.detail
    })
  },
  getRole(e){
    this.setData({
      roleIndex: e.detail.value
    })
  },
  getNowDate(){
    var date=new Date()
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) :'0'+ (date.getMonth() + 1)
    let day = date.getDate()
    let nowDate= [year, month, day].join('-') 
    this.setData({
      date:nowDate
    })
  },
  addStaff(){
    this.setData({
      isSubmit:true
    })
    var url=app.globalData.baseUrl+'apiUser/user/add'
    var data={
      roleId:this.data.roleList[this.data.roleIndex].keyId,
      name:this.data.name,
      mobile:this.data.tel,
      idCard:this.data.idCard,
      loginName:this.data.loginName,
      password:this.data.password,
      joinTime:util.getTimest(this.data.date),
      salary:this.data.money,
      otherSalary:JSON.stringify(this.data.salaryArr)
    }
    util.postRequestList(url,data,false,this.addRes)
  },
  addRes(res){
    if(res.data.code==200){
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
    this.setData({
      isSubmit:false
    })
  },
  getSalaryType(){
    var url = app.globalData.baseUrl + 'apiUser/user/salaryType'
    util.getRequestList(url,false, this.typeRes)
  },
  typeRes(res){
    var salaryObj={}
    res.data.content.map((item)=>{
      salaryObj[item]=''
    })
    this.setData({
      salaryArr: salaryObj
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowDate()
    this.getSalaryType()
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
    this.getRoleList()
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