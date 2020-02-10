// pages/mall/pro_add/add.js
import Notify from '../../../miniprogram_npm/vant-weapp/notify/notify';
let util = require('../../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proId:'',
    proCateList:[],
    sliderId:'',
    tabId:'',
    multiProArray:[],//类别数组
    multiProIndex:[],
    oldMultiProIndex:[],
    selCateName:'请选择商品类别',
    cateDisabled:false,
    stockProList:[],//分类库存商品
    stockProIndex:[],
    stockName:'请选择库存商品',
    oldStockProIndex:[],
    stockDisabled:false,
    themeImageList: [],
    tilLen:0,
    proInfo: {
      cateId: '',
      goodsName: '',
      description: '',
      goodsPics: [],
      status: 0,
      detail: '',//图文详情
      attrsList: []//规格列表
    },
    proInfoRules:{
      cateId: { required: true, msg: '请选择所属类别'} ,
      goodsName: { required: true, msg: '请填写商品名称' },
      themeImg: { required: true, msg: '至少上传一张封面图'},
      detail: { required: true, msg: '请编辑商品图文详情' },//图文详情
      attrList: { required: true, msg: '至少添加一种规格'},
      description: { required: false, msg: '请填写商品描述' },
      status: { required: true, msg: '请选择是否上架' },
    },
    specList: [],
    specSelArr:[],
    selSpecIndex:0,
    actType:'add',//新增或修改商品判断/add新增/edit修改
    editorObj:null,
    editorHtml:'',
    specActType:'edit',//获取规格操作动作类型
    delSpecIndex:0,//获取删除下标
    editShow:false,
    isNewPage:true,
  },
  //去设置分类
  toSetCate(e) {
    wx.navigateTo({
      url: '/pages/stock/stock-system-category/stock-system-category?pageInType=proAdd&methodKey=refreshCateData',
    })
  },
  //设置分类数据刷新
  refreshCateData(){
    let actType=this.data.actType
    let url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, actType, this.refreshCateRes)
  },
  refreshCateRes(res,type){
    if(res.data.code==='200'){
      let cateList = res.data.content
      let ntl = []
      let cateId = this.data.proInfo.cateId
      let twoArr = []
      let multiProIndex = [0, 0]
      let selCateName='请选择商品类别'
      cateList.forEach((item, fi) => {
        nextList = JSON.parse(item.nextList)
        nextList.forEach((val, si) => {
          if (val.keyId === cateId) {
            ntl=nextList
            let fn=cateList[fi].cateName
            let sn=nextList[si].cateName
            multiProIndex[1] = si
            multiProIndex[0] = fi
            selCateName=fn+'/'+sn
          }
        })
      })
      twoArr[0] = cateList
      twoArr[1] = ntl
      let multiProIndexStr = JSON.stringify(multiProIndex)
      this.setData({
        proCateList: cateList,
        multiProArray: twoArr,
        multiProIndex: multiProIndex,
        oldMultiProIndex: multiProIndexStr,
        selCateName
      })
    }else{
      wx.showToast({
        title: res.data.message,
      })
    }
  },
  //去设置仓库货品
  toSetCatePro() {
    this.setData({
      isNewPage: false
    })
    wx.navigateTo({
      url: '/pages/stock/stock-in/stock-in',
    })
  },
  //商品分类改变
  bindCateChange(e){
    let val=e.detail.value
    let cateId=this.data.multiProArray[1][val[1]].keyId
    let actType=false
    this.setData({
      ['proInfo.cateId']:cateId,
    })
    let oldMultiProIndex=JSON.stringify(this.data.multiProIndex)
    let fi=val[0]
    let si=val[1]
    let selCateName=this.data.multiProArray[0][fi].cateName+'/'+this.data.multiProArray[1][si].cateName
    this.setData({oldMultiProIndex,selCateName})
    // this.getStorageProList(cateId, actType)
  },
  bindCateCancel(e){
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let arr=JSON.parse(this.data.oldMultiProIndex)
    data.multiProIndex[0] = arr[0]
    data.multiProIndex[1]=arr[1]
    let index=arr[0]
    let cateId = this.data.multiProArray[0][index].keyId
    let obj = ''
    cateList.forEach(item => {
      if (item.keyId === cateId) {
        obj = item.nextList
      }
    })
    let nextList = JSON.parse(obj)
    data.multiProArray[1] = nextList
    let fi=data.multiProIndex[0]
    let si=data.multiProIndex[1]
    let selCateName=data.multiProArray[0][fi].cateName+'/'+data.multiProArray[1][si].cateName
    this.setData({selCateName})
    this.setData(data)
  },
  bindCateColumnChange(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let columnIndex = e.detail.column
    data.multiProIndex[columnIndex] = e.detail.value;
    switch (columnIndex) {
      case 0:
        let cateId = data.multiProArray[columnIndex][e.detail.value].keyId
        let obj = ''
        cateList.forEach(item => {
          if (item.keyId === cateId) {
            obj = item.nextList
          }
        })
        let nextList = JSON.parse(obj)
        data.multiProArray[1] = nextList
        data.multiProIndex[1] = 0;
        break;
      case 1:
        data.multiProIndex[1] = e.detail.value;
        break;
    }
    let fi=data.multiProIndex[0]
    let si=data.multiProIndex[1]
    let selCateName=data.multiProArray[0][fi].cateName+'/'+data.multiProArray[1][si].cateName
    this.setData({selCateName})
    this.setData(data);
  },
 
  //自定义名称
  bindProNameInput(e){
    let goodsName ='proInfo.goodsName'
    let val=e.detail.value
    this.setData({
      [goodsName]:val
    })
    //console.log(this.data.proInfo)
  },
  //新建商品添加图片
  addProImg(url){
    let imgList=this.data.themeImageList
    let obj={
      url:url,
      keyId:'null'
    }
    imgList.push(obj)
    let tilLen=imgList.length-1
    this.setData({themeImageList:imgList,tilLen})
  },
  
  //封面展示
  bindUploadThemeImg(){
    let actType=this.data.actType
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        const width=375
        const height=250
        //console.log(tempFilePaths)
        if(actType==='add'){
          wx.navigateTo({
            url: '/pages/common/cut-image/cut-image?imgSrc=' + tempFilePaths[0] + '&width=' + width + '&height=' + height + '&key=addProImg&&type=method'
          })
        }
        if (actType === 'edit') {
          wx.navigateTo({
            url: '/pages/common/cut-image/cut-image?imgSrc=' + tempFilePaths[0] + '&width=' + width + '&height=' + height + '&key=addImgRequest&&type=method'
          })
        }
      }
    })
  },
  //删除图片
  deleteCurImg(e){
    let actType=this.data.actType
    let that=this
    wx.showModal({
      title: '提示',
      content: '确认是否删除该图片？',
      success(res) {
        if (res.confirm) {
          let index = parseInt(e.currentTarget.dataset.index)
          let imgList = that.data.themeImageList
          if (actType === 'add') { 
            imgList.splice(index, 1)
            let tilLen=imgList.length-1
            that.setData({
              themeImageList: imgList,
              tilLen
            })
          }
          if(actType==='edit'){
            //let url=imgList[index]
            //let arr=url.split('?')
            let id=imgList[index].keyId
            that.deletImgRequest(id)
            imgList.splice(index, 1)
            let tilLen=imgList.length-1
            that.setData({
              themeImageList: imgList,
              tilLen
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //移动图片
  moveImg(e){
    console.log(e)
    let index=parseInt(e.target.dataset.index) 
    let ty=e.target.dataset.text
    let til=this.data.themeImageList
    if(ty==='qy'){
      console.log(index)
      let index2=index-1
      let ca=this.swapArray(til,index,index2)
      this.setData({themeImageList:ca})
    }
    if(ty==='hy'){
      console.log(index)
      let index2=index+1
      let ca=this.swapArray(til,index,index2)
      this.setData({themeImageList:ca})
    }
  },
  /**
  * 数组元素交换位置
  * @param {array} arr 数组
  * @param {number} index1 添加项目的位置
  * @param {number} index2 删除项目的位置
  * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
  */
  swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },
  //修改商品删除图片//store/inst/deletePic
  //goodsId,picId
  deletImgRequest(picId){
    let url = app.globalData.baseUrl + 'apiMall/store/inst/deletePic'
    let data = {
      goodsId:this.data.proId,
      picId:picId
    }
    util.postRequestList(url, data, false, this.delImgRes)
  },
  delImgRes(res,actType){},
  //修改商品删除图片/store/inst/upPic
  //goodsId,picUrl,isMain
  addImgRequest(picUrl) { 
    //console.log(picUrl)
    let url = app.globalData.baseUrl + 'apiMall/store/inst/upPic'
    let data = {
      goodsId:this.data.proId, 
      picUrl: picUrl, 
      isMain:0
    }
    let actType=false
    util.postRequestList(url, data, actType, this.addImgRes)
  },
  addImgRes(res, actType) {
    if(res.data.code==='200'){
      let info=res.data.content
      let obj={
        url:info.imgUrl,
        keyId:info.keyId
      }
      let list=this.data.themeImageList
      list.push(obj)
      let tilLen=list.length-1
      this.setData({
        themeImageList:list,
        tilLen
      })
    }else{
      wx.showToast({
        title: res.data.message,
        icon:'none'
      })
    }
  },
  //获取editor内容，图文详情
  getEditorContent(e){
    let html=e.detail.html
    let htmlContent='proInfo.detail'
    this.setData({
      [htmlContent]:html
    })
  },
  
  //添加商品规格
  handleAddspec() {
    let act = this.data.actType
    let pn=this.data.proInfo.goodsName
    if(!pn){
      this.warnInfo('请填写商品名称')
      return
    }
    let nav ='/pages/mall/pro-spec/add/add'
    if (act==='edit'){
      nav +='?proActType='+act+'&proId='+this.data.proId +'&proName='+pn
    }
    if(act==='add'){
      nav += '?proActType=' + act +'&proName='+pn
    }
    wx.navigateTo({
      url: nav
    })
  },
  //规格选择
  bindSpecCheck(e){
    let actType=this.data.actType
    let curSelArr=e.detail.value
    let list=this.data.specList
    let specSelArr=this.data.specSelArr
    let difArr=this.getArrDifference(curSelArr,specSelArr)
    console.log(difArr)
    let index=parseInt(difArr[0])
    let status = list[index].status ? 0 : 1
    list[index].status = status
    this.setData({
      specList:list,
      specSelArr: curSelArr
    })
    if(actType==='edit'){
      let attrId=list[index].keyId
      this.changeSpecStatus(attrId, status)
    }
  },
  //控制编辑弹出显示
  handleSpecEdit(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      selSpecIndex:index,
      editShow:true
    })
  },
  //关闭弹窗
  bindClose(e) {
    this.setData({
      editShow: false
    })
  },
  //获取两个数组中不中的值
  getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    });
  },
  //编辑商品修改规格上下架/store/inst/upOrDown
  //goodsId,attrId,status
  changeSpecStatus(attrId,status){
    let url = app.globalData.baseUrl + 'apiMall/store/inst/upOrDown'
    let data={
      goodsId:'',
      attrId: attrId,
      status: status
    }
    util.postRequestList(url, data, false, this.changeSpecStatusRes)
  },
  changeSpecStatusRes(res,actType){
    if(res.statusCode===200&&res.data.code!=='200'){

    }
  },
  //修改规格
  bindEditSpec(e) {
    let specActType = e.currentTarget.dataset.text
    this.setData({specActType})
    let index = this.data.selSpecIndex
    let specList=this.data.specList
    let actType=this.data.actType
    let data = specList[index]
    let pn=this.data.proInfo.goodsName
    if(!pn){
      this.warnInfo('请填写商品名称')
      return
    }
    if(actType==='edit'){
      data.goodsId = this.data.proId
    }
    let dataStr=JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/mall/pro-spec/edit/edit?data=' + dataStr + '&actType=' + actType+'&specIndex='+index+'&proName='+pn
    })
    this.bindClose()
  },
  //删除某个规格
  bindDeleteSpec(e) { 
    let _this=this
    let specActType = e.currentTarget.dataset.text
    let delSpecIndex =parseInt(this.data.selSpecIndex)
    this.setData({
      specActType,
      delSpecIndex
    })
    this.bindClose()
    wx.showModal({
      title: '提示',
      content: '确认是否删除？',
      success(res) {
        if (res.confirm) {
          if (_this.data.actType === 'add') {
            let curIndex = _this.data.delSpecIndex
            let list = _this.data.specList
            list.splice(curIndex, 1)
            let sels = []
            list.forEach((item, index) => {
              if (item.status === 1) {
                sels.push(index.toString())
              }
            })
            _this.setData({
              specList: list,
              specSelArr: sels
            })
          }
          if (_this.data.actType === 'edit') {
            _this.deleteProAttr()
          }
        }
      }
    })
  }, 
  //删除某个商品的规格/store/inst/deleteAttr
  //goodsId,attrId
  deleteProAttr(){
    let sels = this.data.specSelArr
    let list=this.data.specList
    let index=this.data.delSpecIndex
    console.log(list)
    console.log(sels)
    let url = app.globalData.baseUrl + 'apiMall/store/inst/deleteAttr'
    let data={
      goodsId: this.data.proId,
      attrId: list[index].attrId
    }
    util.postRequestList(url, data, false, this.deleteProAttrRes)
  },
  deleteProAttrRes(res,type){
    let curIndex = this.data.delSpecIndex
    let list = this.data.specList
    let sels = []
    list.splice(curIndex, 1)
    list.forEach((item,index)=>{
      if(item.status===1){
        sels.push(index.toString())
      }
    })
    this.setData({
      specList: list,
      specSelArr: sels
    })
  },
  //商品描述
  bindinputDes(e){
    let des='proInfo.description'
    this.setData({
      [des]:e.detail.value
    })
  },
  //是否上架
  switchChange(e){
    let status = 'proInfo.status'
    if (e.detail) {
      this.setData({
        [status]: 1
      })
    } else {
      this.setData({
        [status]: 0
      })
    }
    console.log(this.data.proInfo.status)
  },
  //预览详情
  handleToPreview(){
    let proInfo = JSON.stringify(this.data.proInfo)
    let proInfoStr1 = proInfo.replace(/=/g, '**')
    let proInfoStr2 = proInfoStr1.replace(/&/g, '*')
    let specList = JSON.stringify(this.data.specList)
    let til=this.data.themeImageList
    let imgs=[]
    til.forEach(item=>{
      imgs.push(item.url)
    })
    let imgList = JSON.stringify(imgs)
    let imgListStr = imgList.replace(/\?/g, '*')
    let imgListStr2 = imgListStr.replace(/=/g, '**')
    // let html = this.data.editorHtml
    // let htmlStr=html.replace(/=/g,'**')
    // let htmlStr2 = htmlStr.replace(/&/g,'*')
    wx.navigateTo({
      url: '/pages/mall/pro-details/preview/preview?actType=preview&proInfo=' + proInfoStr2 + '&specLsit=' + specList + '&imgList=' + imgListStr2 
      //+ '&html=' + htmlStr2
    })
  },
  //提醒信息
  warnInfo(msg){
    Notify({ type: 'warning', message: msg });
  },
  //新增商品数据提交///store/inst/add
  submitAddProInfo() {
    let proInfo = this.data.proInfo
    let proInfoRules=this.data.proInfoRules
    for(let key in proInfoRules){
      if(key==='themeImg'){
        if (!this.data.themeImageList.length && proInfoRules[key].required){
          this.warnInfo(proInfoRules[key].msg)
          return;
        }
      }else if(key==='attrList'){
        if (!this.data.specList.length && proInfoRules[key].required){
          this.warnInfo(proInfoRules[key].msg)
          return;
        }
      }else{
        if (proInfoRules[key].required) {
          if (proInfo[key] === '' && !proInfo[key]) {
            console.log(key)
            console.log(proInfo[key])
            Notify({ type: 'warning', message: proInfoRules[key].msg });
            return;
          }
        }
      }
    }
    let actType=this.data.actType
    let goodsPics=[]
    let til=this.data.themeImageList
    til.forEach(item=>{
      goodsPics.push(item.url)
    })
    if(actType==='add'){
      console.log(proInfo)
      proInfo.goodsPics = JSON.stringify(goodsPics)
      proInfo.attrsList = JSON.stringify(this.data.specList)
      let url = app.globalData.baseUrl + 'apiMall/store/inst/add'
      util.postRequestList(url, proInfo, actType, this.addProInfoRes)
    }
    if(actType==='edit'){
      ///store/inst/updateInfo
      //goodsId,goodsName,description,status,detail
      let goodsId=this.data.proId
      let updateData={
        goodsId: goodsId,
        cateId:proInfo.cateId,
        goodsPics:JSON.stringify(goodsPics),
        goodsName:proInfo.goodsName,
        description: proInfo.description,
        detail: proInfo.detail,
        status: proInfo.status,
      }
      let url = app.globalData.baseUrl + 'apiMall/store/inst/updateInfo'
      util.postRequestList(url, updateData, actType, this.updateProInfoRes)
    }
  },
  addProInfoRes(res, actType) {
    if(res.data.code==='200'){
      let prevPage = util.getPrevPage(); //上一个页面
      let fd=prevPage.data.filterData
      fd.pageNum=1
      prevPage.setData({filterData:fd})
      prevPage.getProInfoList(fd, 'refresh') 
      wx.showToast({
        title:'添加成功',
        mask:true,
        duration:2000,
        success:function(){
          wx.navigateBack({
            delta: -1
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
  updateProInfoRes(res, actType){
    if(res.statusCode===200&&res.data.code==='200'){
      let prevPage = util.getPrevPage(); //上一个页面
      let fd=prevPage.data.filterData
      fd.pageSize=fd.pageSize*fd.pageNum
      prevPage.getProInfoList(fd, 'refresh') 
      wx.showToast({
        title: '更新成功',
        mask:true,
        duration:2000,
        success:function(){
          wx.navigateBack({
            delta: -1
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
  //获取商品分类列表//apiStock/stock/cate/list
  getProCateList(actType) {
    let url = app.globalData.baseUrl + 'apiStock/stock/cate/list'
    util.getRequestList(url, actType, this.proCateListRes)
  },
  proCateListRes(res, actType) {
    console.log(res)
    if(res.data.code==='200'){
      let cateList = res.data.content
      let nextList = []
      let sliderId = parseInt(this.data.sliderId)
      let tabId = parseInt(this.data.tabId)
      let twoArr = []
      let multiProIndex = [0, 0]
      let selCateName='请选择商品类别'
      if(sliderId===-1){
        nextList = JSON.parse(cateList[0].nextList)
      }else{
        let fn='',sn='';
        cateList.forEach((item, index) => {
          if (item.keyId === sliderId) {
            multiProIndex[0] = index
            fn=item.cateName
            nextList = JSON.parse(item.nextList)
          }
        })
        nextList.forEach((item, index) => {
          if (item.keyId === tabId) {
            multiProIndex[1] = index
            sn=item.cateName
          }
        })
        this.setData({
          ['proInfo.cateId']: tabId
        })
        selCateName=fn+'/'+sn
        // this.getStorageProList(tabId,'add')
      }
      twoArr[0] = cateList
      twoArr[1] = nextList
      let multiProIndexStr = JSON.stringify(multiProIndex)
      this.setData({
        proCateList: cateList,
        multiProArray: twoArr,
        multiProIndex: multiProIndex,
        oldMultiProIndex: multiProIndexStr,
        selCateName
      })
      if (actType === 'edit') {
        let id = this.data.proId
        let actType = 'edit'
        this.getProDetail(id, actType)
      }
    }
  },
  //获取商品实例详情///store/inst/detail
  //goodsId
  getProDetail(id,actType){
    let url = app.globalData.baseUrl + 'apiMall/store/inst/detail'
    let data = { goodsId:id}
    util.getRequestListData(url, data, actType,this.proDetailRes)
    //getRequestListData = function (url, data,actType, callBack)
  },
  proDetailRes(res,actType){
    let data=res.data.content
    if(actType==='edit'){
      let goodsInfo = data.goodsInfo
      let detailInfo = data.detailInfo
      let imgList = data.imgList
      let tilLen=imgList.length-1
      // let themeImageList = this.data.themeImageList
      // imgList.forEach(item=>{
      //   //let url=item.url+'?'+item.keyId
      //   let url=item.url
      //   themeImageList.push(url)
      // })
      let attrList = data.attrList
      let specSelArr=[]
      attrList.forEach((item,index)=>{
        item.attrId=item.keyId
        item.attrPrice = util.getMoney(item.attrPrice).toString()
        item.attrNormalPrice = util.getMoney(item.attrNormalPrice).toString()
        if(item.status===1){
          specSelArr.push(index.toString())
        }
      })
      this.setData({
        ['proInfo.cateId']: goodsInfo.cateId,
        ['proInfo.goodsName']: goodsInfo.goodsName,
        ['proInfo.detail']: detailInfo.detail,
        ['proInfo.description']: goodsInfo.description,
        ['proInfo.stockId']: goodsInfo.stockId,
        ['proInfo.status']: goodsInfo.status,
        specList: attrList,
        themeImageList: imgList,
        tilLen,
        editorHtml: detailInfo.detail,
        specSelArr: specSelArr
      })
      // this.getStorageProList(this.data.tabId,actType)
      //this.data.editorObj.editorSetContent(detailInfo.detail)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let actType=options.actType
    let proId = options.id
    this.setData({
      actType:actType,
      proId:proId,
      sliderId:options.sliderId,
      tabId:options.tabId
    })
    this.getProCateList(actType)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取editor组件对象
    this.setData({
      editorObj: this.selectComponent('#proEditor')
    })
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