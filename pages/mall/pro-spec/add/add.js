// pages/pro_manage/pro_spec_edit/spec.js
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
let util = require('../../../../utils/util.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    proName:'',
    switchChecked:true,
    proActType: 'add',
    specInfo:{
      goodsId: '',//商品ID
      attrName: '',//规格名称
      upCount:'',//上架数量
      normalPrice:'',//原件
      attrPrice:'',//促销价格（两位小数）
      status: 1,//是否上下架(0下架/1上架)
      matInfo:'[]'
    },
    specInfoRules:{
      attrName: {required:true,msg:'请输入规格名称'},//规格名称
      normalPrice: { required: true, msg: '请输入销售原价' },//原件
      attrPrice: { required: true, msg: '请输入促销价' },//促销价格（两位小数）
      upCount: { required: true, msg: '请输入上架数量' },//上架数量
      status: { required: true, msg: '请输入选择规格' }//是否上下架(0下架/1上架)
    },
    mtlList:[]
  },
  bindinputName(e){
    let name ='specInfo.attrName'
    this.setData({
      [name]:e.detail.value
    })
  },
  bindinputAttrPrice(e) {
    let name = 'specInfo.attrPrice'
    let price = e.detail.value
    let val = util.clearNoNum(price)
    this.setData({
      [name]: val
    })
  },
  bindinputNormalPrice(e) {
    let name = 'specInfo.normalPrice'
    let price = e.detail.value
    let val=util.clearNoNum(price)
    this.setData({
      [name]: val
    })
  },
  bindinputCount(e) {
    let name = 'specInfo.upCount'
    this.setData({
      [name]: e.detail.value
    })
  },
  bindinputMulti(e) {
    let name = 'specInfo.stockMulti'
    this.setData({
      [name]: e.detail.value
    })
  },
  handleMtlEdit(e){
    let index=e.currentTarget.dataset.index
    let ml=this.data.mtlList
  },
  //是否上架
  switchChange(e){
    let status ='specInfo.status'
    if(e.detail){
      this.setData({
        [status]:1
      })
    }else{
      this.setData({
        [status]: 0
      })
    }
  },
  //添加原材料配比
  handleAddAtl(){
    let sn=this.data.specInfo.attrName
    let pn=this.data.proName
    if(!sn){
      this.warnInfo('请填写规格名称')
      return
    }
    wx.navigateTo({
      url: '/pages/mall/pro-spec/spec-mtl/mtl?proActType=add&specName='+sn+'&proName='+pn,
    })
  },
  //删除数据
  delOneMtl(){
    let ml=this.data.mtlList
    let index=this.data.mtlIndex
    ml.splice(index,1)
    this.setData({mtlList:ml})
    wx.showToast({
      title: '删除成功',
      mask:true
    })
  },
  //删除材料规格
  handleMtlDel(e){
    let index=parseInt(e.currentTarget.dataset.index)
    this.setData({mtlIndex:index})
    let _this=this
    wx.showModal({
      title: '提示',
      content: '确认是否删除该材料？',
      success(res) {
        if (res.confirm) {
          _this.delOneMtl()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //提示信息
  warnInfo(msg){
    Notify({ type: 'warning', message: msg });
  },
  //提交规格数据/store/inst/newGoodsAttr
  // 为某个商品增加规格
  submitAddSpecInfo(){
    let data=this.data.specInfo
    let rules=this.data.specInfoRules
    let mtlList=this.data.mtlList
    let mtlArr=[]
    for(let key in rules){
      if(rules[key].required){
        if(!data[key]&&data[key]===''){
          this.warnInfo(rules[key].msg)
          return;
        }
      }
    }
    if(mtlList.length===0){
      this.warnInfo('请添加原材料配比')
      return;
    }
    mtlList.forEach(item => {
      let obj={
        goodsName:item.goodsName,
        stockId:item.stockId,
        count:item.count
      }
      mtlArr.push(obj)
    });
    let proActType = this.data.proActType
    let prevPage = util.getPrevPage()  //上一个页面
    if (proActType === 'add') {
      let obj = {}
      for (let key in this.data.specInfo) {
        if (key !== 'goodsId') {
          obj[key] = this.data.specInfo[key]
        }
      }
      obj.attrPrice = this.data.specInfo.attrPrice
      obj.matInfo=JSON.stringify(mtlArr)
      let arr = prevPage.data.specList
      arr.push(obj)
      console.log(obj)
      let specSelArr = prevPage.data.specSelArr
      if(obj.status===1){
        let len = arr.length-1
        specSelArr.push(len.toString())
      }
      prevPage.setData({
        specList: arr,
        specSelArr: specSelArr
      });
      wx.navigateBack({
        delta: -1
      })
    }
    if (proActType === 'edit') {
      let specInfo=this.data.specInfo
      specInfo.matInfo=JSON.stringify(mtlArr)
      this.editProAddSpec(specInfo)
    }
  },
  
  //编辑商品增加规格//store/inst/newGoodsAttr
  editProAddSpec(data){
     //Notify({ type: 'danger', message: '通知内容' });
    let url = app.globalData.baseUrl + 'apiMall/store/inst/newGoodsAttr'
    console.log(data)
    let actType=false
    util.postRequestList(url, data, actType, this.addSpecInfoRes)
    // callBack(res, actType) //请求结果处理
  },
  addSpecInfoRes(res, actType){
    if(res.data.code==='200'){
      let result=res.data.content
      result.status=parseInt(result.status)
      result.attrPrice=util.getMoney(result.attrPrice).toString()
      result.attrId = result.keyId
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];   //当前页面
      let prevPage = pages[pages.length - 2];  //上一个页面
      let list=prevPage.data.specList
      list.push(result)
      let specSelArr = prevPage.data.specSelArr
      if(result.status===1){
        let len = list.length-1
        specSelArr.push(len.toString())
      }
      prevPage.setData({
        specList:list,
        specSelArr: specSelArr
      })
      wx.navigateBack({
        delta: -1
      })
    }else{
      wx.showToast({
        title: res.data.content,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let proActType = options.proActType
    let pn=options.proName
    console.log(options)
    this.setData({
      proActType: proActType,
      proName:pn
    })
    console.log(this.data.proActType)
    if (proActType === 'edit') {
      let goodsId = options.proId
      this.setData({
        ['specInfo.goodsId']: goodsId
      })
      console.log(this.data.specInfo)
    }
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