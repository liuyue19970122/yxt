// pages/oa/role-list/role-list.js
var util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleList:[],
    actions: [{
      name: '修改',
      color: '07c160',
      index: 0
    },
    {
      name: '删除',
      color: 'fe2200',
      index: 1
    }
    ],
    showSetDialog:false,
    selectIndex:0,
  },
  bindShowSet(e) {
    this.setData({
      showSetDialog: true,
      selectIndex: e.currentTarget.dataset.index
    })
  },
  bindCloseSet() {
    this.setData({
      showSetDialog: false
    })
  },
  onSelect(e) {
    var index = e.detail.index
    var that=this
    if (index == 1) {
      wx.showModal({
        title: '提示',
        content: '确定删除该角色么',
        success: function (res) {
          if (res.confirm) {
            var url=app.globalData.baseUrl+'apiUser/role/deleteRole'
            var data={
              roleId:that.data.roleList[that.data.selectIndex].keyId
            }
            util.postRequestList(url,data,false,that.delRes)
          }
        }
      })
    } else {
      this.goDetail()
    }
  },
  delRes(res){
    var that=this
    if(res.data.code==200){
      wx.showToast({
        title: '删除成功',
      })
      var list=that.data.roleList
      list.splice(that.data.selectIndex,1)
      that.setData({
        roleList:list
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  getRoleList() {
    wx.showLoading({
      title: '获取中...',
    })
    var url = app.globalData.baseUrl + 'apiUser/role/list'
    util.getRequestList(url, false, this.roleRes)
  },
  roleRes(res) {
    setTimeout(() => {
      wx.hideLoading()
    }, 100)
    if (res.data.code == 200) {
      this.setData({
        roleList: res.data.content
      })
    }
  },
  goAdd(){
    wx.navigateTo({
      url: '../add-role/add-role'
    })
  },
  goDetail(e){
    this.setData({
      showSetDialog:false
    })
    wx.navigateTo({
      url: '../add-role/add-role?item='+JSON.stringify(this.data.roleList[this.data.selectIndex]),
    })
  },
  onClose(event){
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {
          instance.close();
        });
        break;
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