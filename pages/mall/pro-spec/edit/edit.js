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
    specIndex:0,
    specInfo:{
      goodsId: '',//商品ID
      attrId:'',//规格ID
      attrName: '',//规格名称
      count:'',//上架数量
      normalPrice:'',//原件
      attrPrice:'',//促销价格（两位小数）
      status: 1,//是否上下架(0下架/1上架)
      matInfo:'[]'
    },
    specInfoRules:{
      attrName: {required:true,msg:'请输入规格名称'},//规格名称
      normalPrice: { required: true, msg: '请输入销售原价' },//原件
      attrPrice: { required: true, msg: '请输入促销价格' },//促销价格（两位小数）
      count:  {required:true,msg:'请输入数量'},//上架数量
      status: { required: true, msg: '请选择是否上架' }//是否上下架(0下架/1上架)
    },
    mtlList:[]
  },
  bindinputName(e){
    let name ='specInfo.attrName'
    this.setData({
      [name]:e.detail.value
    })
  },
  bindinputNormalPrice(e) {
    let name = 'specInfo.normalPrice'
    let price = e.detail.value
    let val = util.clearNoNum(price)
    this.setData({
      [name]: val
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
  bindinputCount(e) {
    let name = 'specInfo.count'
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
  //添加规格材料
  handleAddAtl(){
    let actType=this.data.proActType
    let sn=this.data.specInfo.attrName
    let pn=this.data.proName
    if(!sn){
      this.warnInfo('请填写规格名称')
      return
    }
    if(actType==='add'){
      wx.navigateTo({
        url: '/pages/mall/pro-spec/spec-mtl/mtl?proActType=add&specName='+sn+'&proName='+pn,
      })
    }
    if(actType==='edit'){
      let spi=this.data.specInfo
      let attrId=spi.attrId
      let goodsId=spi.goodsId
      wx.navigateTo({
        url: '/pages/mall/pro-spec/spec-mtl/mtl?proActType=edit&attrId='+attrId+'&goodsId='+goodsId+'&specName='+sn+'&proName='+pn,
      })
    }
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
    let ml=this.data.mtlList
    let id=ml[index].keyId 
    this.setData({mtlIndex:index})
    let _this=this
    let actType=this.data.proActType
    if(actType==='add'){
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
    }else if(actType==='edit'){
      if(ml.length===1){
        wx.showModal({
          title: '提示',
          content: '原料配比必须有一项，否则请返回上一页删除该规格',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({delta:1})
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else if(ml.length>1){
        wx.showModal({
          title: '提示',
          content: '确认是否删除该材料？',
          success(res) {
            if (res.confirm) {
              _this.delMat(id)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  //提示信息
  warnInfo(msg){
    Notify({ type: 'warning', message: msg });
  },
  //提交规格数据/store/inst/newGoodsAttr
  // 为某个商品增加规格
  submitAddSpecInfo(){
    let specInfo=this.data.specInfo
    let rules=this.data.specInfoRules
    let mtlList=this.data.mtlList
    let mtlArr=[]
    for(let key in rules){
      if(rules[key].required){
        if(!specInfo[key]&&specInfo[key]===''){
          Notify({ type: 'warning', message: rules[key].msg });
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
        stockId:item.stockId,
        count:item.count,
        goodsName:item.goodsName
      }
      mtlArr.push(obj)
    });
    console.log(mtlList)
    let proActType = this.data.proActType
    let prevPage = util.getPrevPage();  //上一个页面
    if (proActType === 'add') {
      let obj = {}
      for (let key in specInfo) {
        if (key === 'count') {
          obj['upCount'] = specInfo[key]
        }else if(key!=='goodsId'&&key!=='attrId'&key!=='count'){
          obj[key] = specInfo[key]
        }
      }
      obj.matInfo=JSON.stringify(mtlArr)
      let index=this.data.specIndex
      let arr = prevPage.data.specList
      arr[index]=obj
      prevPage.setData({
        ['specList']: arr
      });
      wx.navigateBack({
        delta: -1
      })
    }
    if (proActType === 'edit') {
      //goodsId,attrId,attrName,balanceCount,attrPrice,status
      let obj={}
      let objInfo={}
      console.log(specInfo)
      obj.goodsId = specInfo.goodsId
      obj.attrId = specInfo.attrId
      obj.attrName = specInfo.attrName
      obj.balanceCount = specInfo.count
      obj.attrNormalPrice = specInfo.normalPrice
      obj.attrPrice = specInfo.attrPrice
      obj.status = specInfo.status
      for (let key in specInfo) {
        if (key === 'count') {
          objInfo['balanceCount'] = specInfo[key]
        } if (key ==='normalPrice'){
          objInfo['attrNormalPrice'] = specInfo[key]
        } else {
          objInfo[key] = specInfo[key]
        }
      }
      let mtlList=this.data.mtlList
      objInfo.cusSaleMoney = specInfo.attrPrice
      objInfo.matList=JSON.stringify(mtlList)
      let specIndex=this.data.specIndex
      let arr = prevPage.data.specList
      arr[specIndex] = objInfo
      prevPage.setData({
        ['specList']: arr
      });
      console.log(arr)
      this.editProEditSpec(obj)
    }
  },
  //编辑商品修改规则//store/inst/updateAttr
  //goodsId,attrId,attrName,balanceCount,attrPrice,status
  editProEditSpec(data){
    let url = app.globalData.baseUrl + 'apiMall/store/inst/updateAttr'
    let actType = false
    util.postRequestList(url, data, actType, this.editProEditSpecRes)
  },
  editProEditSpecRes(res,actType){
    console.log(res)
    wx.navigateBack({
      delta: -1
    })
  },
  //删除某个材料配比/store/inst/deleteAttrMat
  //matKeyId
  delMat(id){
    let url = app.globalData.baseUrl + 'apiMall/store/inst/deleteAttrMat'
    let actType = false
    util.postRequestList(url, {matKeyId:id}, actType, this.delMatRes)
  },
  delMatRes(res,type){
    if(res.data.code==='200'){
      this.delOneMtl()
      let prevPage=util.getPrevPage()
      let mtl=this.data.mtlList
      let specIndex=this.data.specIndex
      let specList=prevPage.data.specList
      let speObj=specList[specIndex]
      speObj.matList=JSON.stringify(mtl)
      prevPage.setData({specList})
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
    let proActType = options.actType
    let pn=options.proName
    let data = JSON.parse(options.data) 
    console.log(options)
    console.log(data)
    let specIndex=options.specIndex
    this.setData({
      proActType: proActType,
      specIndex: specIndex,
      proName:pn
    })
    if (proActType === 'edit') {
      //goodsId,attrId,attrName,balanceCount,attrPrice,status
      //let goodsId = options.porId
      let specInfo=this.data.specInfo
      specInfo.goodsId = data.goodsId
      specInfo.attrId = data.attrId
      specInfo.attrName = data.attrName
      specInfo.count = data.balanceCount
      specInfo.normalPrice =data.attrNormalPrice
      specInfo.attrPrice = data.attrPrice
      specInfo.status = data.status
      specInfo.matList = data.matList
      let mtlList=JSON.parse(data.matList)
      console.log(specInfo)
      this.setData({
        specInfo: specInfo,
        mtlList:mtlList
      })
    }
    if (proActType === 'add') {
      let specInfo = this.data.specInfo
      let mtlList=JSON.parse(data.matInfo)
      for (let key in specInfo) {
        if(key==='count'){
          specInfo[key] = data.upCount
        }else{
          specInfo[key] = data[key]
        }
      }
      this.setData({
        specInfo: specInfo,
        mtlList:mtlList
      })
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