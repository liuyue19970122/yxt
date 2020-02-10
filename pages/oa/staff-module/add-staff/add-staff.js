// pages/oa/add-staff/add-staff.js
var util = require('../../../../utils/util.js');
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleList: [],
    tel: '',
    name: '',
    money: '',
    roleIndex: 0,
    date: '',
    loginName: "",
    password: '',
    idCard: '',
    show: false,
    salaryArr: {},
    typeName: '',
    keyId: '',
    type:'add',
    leaveTime:'',
    leaveReason:'',
    statusList:[
      {
        status:1,
        name:'在职'
      },
      {
        status: 0,
        name: '离职'
      }
    ],
    statusIndex:0,
    isSubmit:false
  },
  goAddSalary() {
    this.setData({
      show: true
    })
  },
  getLeaveReason(e){
    this.setData({
      leaveReason:e.detail.value
    })
  },
  addSalary() {
    var list = this.data.salaryArr
    var str = this.data.typeName
    list[str] = 0
    this.setData({
      salaryArr: list,
      typeName: '',
      show:false
    })
  },
  getTypeName(e) {
    this.setData({
      typeName: e.detail.value
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  getSalary(e) {
    var list = this.data.salaryArr
    list[e.currentTarget.dataset.index] = e.detail
    // list.map((item,index)=>{
    //   if(index==e.currentTarget.dataset.index){
    //     item.value=e.detail
    //   }
    // })
    this.setData({
      salaryArr: list
    })
  },
  getRoleList() {
    var url = app.globalData.baseUrl + 'apiUser/role/list'
    util.getRequestList(url, false, this.roleRes)
  },
  roleRes(res) {
    if (res.data.code == 200) {
      this.setData({
        roleList: res.data.content
      })
    }
  },
  getDate(e) {
    this.setData({
      date: e.detail.value
    })
  },
  getLeaveDate(e){
    this.setData({
      leaveTime: e.detail.value
    })
  },
  getName(e) {
    this.setData({
      name: e.detail
    })
  },
  getTel(e) {
    this.setData({
      tel: e.detail
    })
  },
  getMoney(e) {
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
  getRole(e) {
    this.setData({
      roleIndex: e.detail.value
    })
  },
  getStatus(e) {
    this.setData({
      statusIndex: e.detail.value
    })
  },
  getNowDate() {
    var date = new Date()
    let year = date.getFullYear()
    let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate()
    let nowDate = [year, month, day].join('-')
    this.setData({
      date: nowDate,
      leaveTime:nowDate
    })
  },
  addStaff() {
    if(this.data.type=='pwd'){
      if (this.data.password.length<6) {
        Notify({
          type: 'warning',
          message: '密码不能小于六位数'
        });
        return false
      }
      var data={
        userId: this.data.keyId,
        password:this.data.password
      }
      var url = app.globalData.baseUrl +'apiUser/user/update'
      util.postRequestList(url,data,false,this.updateRes)
      return false
    }
    if (!(/^1[3456789]\d{9}$/.test(this.data.tel))) {
      Notify({
        type: 'warning',
        message: '手机号格式不正确'
      });
      return false
    }
    if (this.data.name=='') {
      Notify({
        type: 'warning',
        message: '姓名不能为空'
      });
      return false
    }
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(this.data.idCard))) {
      Notify({
        type: 'warning',
        message: '身份证号格式有误，请检查！'
      });
      return false
    }
    if (this.data.money == '') {
      Notify({
        type: 'warning',
        message: '基本工资不能为空'
      });
      return false
    }
    if (this.data.isTap) {
      return false
    } else {
      this.setData({
        isTap: true
      })
    }
    var data = {
      roleId: this.data.roleList[this.data.roleIndex].keyId,
      name: this.data.name,
      mobile: this.data.tel,
      idCard: this.data.idCard,
      // joinTime: util.getTimest(this.data.date),
    }
    if(this.data.type=='info'){
      data.userId=this.data.keyId
      data.status=this.data.statusList[this.data.statusIndex].status
      data.leaveReason = this.data.leaveReason
      data.leaveTime=util.getTimest(this.data.leaveTime)
      var url = app.globalData.baseUrl + 'apiUser/user/update'
      util.postRequestList(url, data, false, this.updateRes)
    }else{
      if (this.data.password.length < 6) {
        Notify({
          type: 'warning',
          message: '密码不能小于六位数'
        });
        return false
      }
      data.password = this.data.password
      data.joinTime = util.getTimest(this.data.date)
      var obj={}
      for(var i in this.data.salaryArr){
        if(this.data.salaryArr[i]!=''){
          obj[i] = this.data.salaryArr[i]
        }
      }
      data.otherSalary = JSON.stringify(obj)
      data.salary=this.data.money
      var url = app.globalData.baseUrl + 'apiUser/user/add'
      util.postRequestList(url, data, false, this.addRes)
    }
  },
  updateRes(res){
    this.setData({
      isTap:false
    })
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    }else{
      wx.showToast({
        icon:'none',
        title: res.data.message,
      })
    }
  },
  addRes(res) {
    this.setData({
      isTap: false
    })
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        icon:'none',
        title: res.data.message,
      })
    }
  },
  getSalaryType() {
    var url = app.globalData.baseUrl + 'apiUser/user/salaryType'
    util.getRequestList(url, false, this.typeRes)
  },
  typeRes(res) {
    var salaryObj = {}
    res.data.content.map((item) => {
      salaryObj[item] = ''
    })
    this.setData({
      salaryArr: salaryObj
    })
  },
  getDetail() {
    var url = app.globalData.baseUrl + 'apiUser/user/detail'
    var data = {
      keyId: this.data.keyId
    }
    util.getRequestListData(url, data, false, this.detailRes)
  },
  detailRes(res) {
    if (res.data.code == 200) {
      var content = res.data.content
      var roleIndex=0
      this.data.roleList.map((item,index)=>{
        if(item.keyId==content.roleId){
          roleIndex=index
        }
      })
      var salaryList = JSON.parse(content.salaryList)
      var salaryArr = {}
      salaryList.slice(1).map((item)=>{
        salaryArr[item.type] = util.getMoney(item.money)
      })
      this.setData({
        tel: content.mobile,
        name: content.name,
        idCard: content.idCard,
        password:content.password,
        date: util.formatDateAn(content.joinTime),
        roleIndex:roleIndex,
        money:util.getMoney(salaryList[0].money),
        salaryArr: salaryArr,
      })
      if(this.data.type=='leave'){
        this.setData({
          leaveReason:content.leaveReason,
          leaveTime: util.formatDateAn(content.leaveTime)
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.isGo = false
    this.getNowDate()
    this.getRoleList()
    // this.getDetail()
    if (options.id) {
      this.setData({
        keyId: options.id,
        type:options.type
      })
      if(options.type=='leave'){
        wx.setNavigationBarTitle({
          title: '详细信息',
        })
        this.setData({
          statusIndex:1
        })
      } else if (options.type == 'info'){
        wx.setNavigationBarTitle({
          title: '修改信息',
        })
      }
      setTimeout(()=>{
        this.getDetail()
      },100)
    }else{
      this.getSalaryType()
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
      isTap: false
    })
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