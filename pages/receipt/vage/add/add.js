// pages/receipt/vage/add/add.js
var util = require('../../../../utils/util.js');
const app = getApp()
var times = (new Date()).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIcon: '/utils/img/receipt/check.png',
    inactiveIcon: '/utils/img/receipt/no-check.png',
    select: [],
    checked: true,
    specList: [],
    name: '',
    typeName: '',
    sort: '',
    isMore: true,
    num: '',
    isOpen: false,
    mainImg: '',
    description: '',
    detail: '',
    imgList: [],
    list: '',
    upload_picture_list: [],
    selectFirstIndex: 0,
    selectSecondIndex: 0,
    cateList: [],
    cateId: '',
    foodId: '',
    type: 'add',
    imgIndex: '',
    specIndex: 0,
    changeList: [],
    multiCateName: '请选择菜品分类',
    multiProArray: [], //类别数组
    multiProIndex: [0, 0],
    oldMultiProIndex: '[0,0]',
    isNewPage: true,
    isSubmit: false,
    showSetDialog: false,
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
  },
  bindCloseSet() {
    this.setData({
      showSetDialog: false
    })
  },
  goAddCate() {
    wx.navigateTo({
      url: '/pages/receipt/vege-add-category/add-cate',
    })
  },
  openDialog(e) {
    this.setData({
      specIndex: e.currentTarget.dataset.index,
      showSetDialog: true,
    })
  },
  onSelect(e) {
    var that = this
    var index = e.detail.index
    this.setData({
      showSetDialog: false
    })
    if (index == 1) {
      wx.showModal({
        title: '提示',
        content: '确定删除该规格么',
        success: function(res) {
          if (res.confirm) {
            if (that.data.type == 'update') {
              var url = app.globalData.baseUrl + 'apiMall/food/admin/deleteAttr'
              var data = {
                attrId: that.data.specList[that.data.specIndex].keyId,
                foodId: that.data.foodId
              }
              util.postRequestList(url, data, false, that.delSpecRes)
            } else {
              var list = that.data.specList
              list.splice(that.data.specIndex, 1)
              that.setData({
                specList: list
              })
            }
          }
        }
      })
    } else {
      this.goDetail()
    }
  },
  //商品分类改变
  bindCateChange(e) {
    let val = e.detail.value
    let fi = val[0]
    let si = val[1]
    let multiProArray = this.data.multiProArray
    let cateId = multiProArray[1][si].keyId
    let multiCateName = multiProArray[0][fi].cateName + '/' + multiProArray[1][si].cateName
    // let proInfo = this.data.proInfo
    // proInfo.cateId = cateId
    let oldMultiProIndex = JSON.stringify(val)
    this.setData({
      multiCateName,
      cateId,
      oldMultiProIndex
    })
  },
  bindCateCancel(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let arr = JSON.parse(this.data.oldMultiProIndex)
    data.multiProIndex[0] = arr[0]
    data.multiProIndex[1] = arr[1]
    let index = arr[0]
    let si = arr[1]
    let cateId = this.data.multiProArray[0][index].keyId
    let obj = ''
    cateList.forEach(item => {
      if (item.keyId === cateId) {
        obj = item.nextList
      }
    })
    let nextList = obj
    data.multiProArray[1] = nextList
    let multiCateName = data.multiProArray[0][index].cateName + '/' + data.multiProArray[1][si].cateName
    this.setData({
      multiCateName
    })
    this.setData(data)
  },
  bindCateColumnChange(e) {
    let data = {
      multiProArray: this.data.multiProArray,
      multiProIndex: this.data.multiProIndex
    };
    let cateList = this.data.proCateList
    let multiCateName = ''
    let columnIndex = e.detail.column
    data.multiProIndex[columnIndex] = e.detail.value;
    switch (columnIndex) {
      case 0:
        let fi_0 = e.detail.value
        let cateId = data.multiProArray[columnIndex][fi_0].keyId
        let obj = ''
        cateList.forEach(item => {
          if (item.keyId === cateId) {
            obj = item.nextList
          }
        })
        let nextList = obj
        data.multiProArray[1] = nextList
        data.multiProIndex[1] = 0;
        multiCateName = data.multiProArray[0][fi_0].cateName + '/' + data.multiProArray[1][0].cateName
        break;
      case 1:
        data.multiProIndex[1] = e.detail.value;
        let fi_1 = data.multiProIndex[0]
        let si_1 = data.multiProIndex[1]
        multiCateName = data.multiProArray[0][fi_1].cateName + '/' + data.multiProArray[1][si_1].cateName
        break;
    }
    this.setData(data);
    this.setData({
      multiCateName
    })
  },

  //获取分类列表
  getCateList() {
    var url = app.globalData.baseUrl + 'apiMall/food/cate/list?t=' + times
    util.getRequestList(url, false, this.cateListRes)
  },
  cateListRes(res, type) {
    if (res.data.code === '200') {
      let cateList = res.data.content
      let twoArr = []
      let multiProIndex = [0, 0]
      let multiCateName = '请选择货品类别'
      if (cateList.length) {
        cateList.map((item) => {
          var jtem = {
            keyId: item.keyId,
            cateName: item.cateName
          }
          item.nextList = JSON.parse(item.nextList)
          item.nextList.unshift(jtem)
        })
        if (this.data.isNewPage) {
          let nextList = cateList[0].nextList
          twoArr[0] = cateList
          twoArr[1] = nextList
          let cateId = nextList[0].keyId
          multiCateName = twoArr[0][0].cateName + '/' + twoArr[1][0].cateName
          this.setData({
            cateId
          })
        } else {
          let cateId = this.data.cateId
          twoArr[0] = cateList
          cateList.forEach((item, fi) => {
            let nl = item.nextList
            nl.forEach((val, si) => {
              if (cateId == val.keyId) {
                twoArr[1] = nl
                multiProIndex[0] = fi
                multiProIndex[1] = si
                multiCateName = item.cateName + '/' + val.cateName
              }
            })
          })
        }
        let oldMultiProIndex = JSON.stringify(multiProIndex)
        this.setData({
          multiCateName,
          multiProIndex,
          oldMultiProIndex,
          multiProArray: twoArr,
          proCateList: cateList
        })
      } else {
        this.setData({
          multiCateName,
          multiProIndex,
        })
      }
    }
  },
  chooseMainImg: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        const width = 300
        const height = 300
        if (that.data.type != 'update') {
          wx.navigateTo({
            url: '/pages/common/cut-image/cut-image?imgSrc=' + tempFilePaths[0] + '&width=' + width + '&height=' + height + '&key=mainImg&&type=String'
          })
        }
        if (that.data.type == 'update') {
          wx.navigateTo({
            url: '/pages/common/cut-image/cut-image?imgSrc=' + tempFilePaths[0] + '&width=' + width + '&height=' + height + '&key=updateMainImg&&type=method'
          })
        }
      }
    })
  },
  updateMainImg(img) {
    var url = app.globalData.baseUrl + 'apiMall/food/admin/newPic'
    var data = {
      foodId: this.data.foodId,
      picUrl: img,
      isMain: 1
    }
    util.postRequestList(url, data, false, this.mainRes)
  },
  mainRes(res) {
    var that = this
    if (res.data.code == 200) {
      var content = res.data.content.imgUrl
      that.setData({
        mainImg: content
      })
    } else {
      wx.showModal({
        icon: 'none',
        content: res.data.message,
      })
    }
  },
  //选择图片方法
  uploadpic: function(e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        const width = 375
        const height = 250
        if (that.data.type!='update') {
          wx.navigateTo({
            url: '/pages/common/cut-image/cut-image?imgSrc=' + tempFilePaths[0] + '&width=' + width + '&height=' + height + '&key=addBannerImg&&type=method'
          })
        }
        if (that.data.type == 'update') {
          wx.navigateTo({
            url: '/pages/common/cut-image/cut-image?imgSrc=' + tempFilePaths[0] + '&width=' + width + '&height=' + height + '&key=uploadBannerImg&&type=method'
          })
        }
    
      }
    })
  },
  uploadBannerImg(img){
    var url = app.globalData.baseUrl + 'apiMall/food/admin/newPic'
    var data = {
      foodId: this.data.foodId,
      picUrl: img,
      isMain: 0
    }
    util.postRequestList(url, data, false, this.uploadRes)
  },
  addBannerImg(img){
    var upload_picture_list = this.data.upload_picture_list
    var item={
      upload_percent:100,
      path_server:img,
      path:img,
    }
    upload_picture_list.push(item)
    this.setData({
      upload_picture_list: upload_picture_list
    });
  },
  //上传方法
  upload_file_server: function(upload_picture_list, j) {
    var that = this
    //上传返回值
    const upload_task = wx.uploadFile({
      // 模拟https
      url: app.globalData.fileUploadUrl + '/apiUser/file/upload', //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
      filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
      name: 'file',
      header: {
        Authorization: wx.getStorageSync("localToken").token
      },
      //附近数据，这里为路径     
      success: function(res) {
        var data = JSON.parse(res.data);
        // //字符串转化为JSON  
        if (JSON.parse(res.data).code == 200) {
          var filename = data.content //存储地址 显示
          if (that.data.type == 'update') {
            var url = app.globalData.baseUrl + 'apiMall/food/admin/newPic'
            var data = {
              foodId: that.data.foodId,
              picUrl: filename,
              isMain: 0
            }
            util.postRequestList(url, data, false, that.uploadRes)
          } else {
            upload_picture_list[j]['path_server'] = filename
            that.setData({
              upload_picture_list: upload_picture_list
            });
          }
        }
      }
    })
    //上传 进度方法
    upload_task.onProgressUpdate((res) => {
      upload_picture_list[j]['upload_percent'] = res.progress
      that.setData({
        upload_picture_list: upload_picture_list
      });
    });
  },
  uploadRes: function(res) {
    var that = this
    if (res.data.code != 200) {
      wx.showToast({
        icon:'none',
        title: res.data.message,
      })
      // wx.showModal({
      //   title: '提示',
      //   content: res.data.message,
      //   showCancel: false,
      //   success: function(res) {
      //     var list = that.data.upload_picture_list
      //     list.splice(list.length - 1, 1)
      //     that.setData({
      //       upload_picture_list: list
      //     })
      //   }
      // })
    } else {
      var content = res.data.content
      var list = that.data.upload_picture_list
      // list.splice(list.length - 1, 1)
      var item = {
        foodId: content.foodId,
        keyId: content.keyId,
        path_server: content.imgUrl,
        upload_percent: 100
      }
      list.push(item)
      that.setData({
        upload_picture_list: list
      })
    }
  },
  // 删除图片
  deleteImg: function(e) {
    var that = this
    let index = e.currentTarget.dataset.index;
    this.setData({
      imgIndex: index
    })
    wx.showModal({
      title: '提示',
      content: '确定删除么',
      success: function(res) {
        if (res.confirm) {
          if (that.data.type == 'update') {
            var url = app.globalData.baseUrl + 'apiMall/food/admin/deletePic'
            var data = {
              foodId: that.data.foodId,
              picId: that.data.upload_picture_list[index].keyId
            }
            util.postRequestList(url, data, false, that.delRes)
          } else {
            let upload_picture_list = that.data.upload_picture_list;
            upload_picture_list.splice(index, 1);
            that.setData({
              upload_picture_list: upload_picture_list
            });
          }
        }
      }
    })
  },
  delRes(res) {
    var that = this
    if (res.data.code == 200) {
      let upload_picture_list = that.data.upload_picture_list;
      upload_picture_list.splice(that.data.imgIndex, 1);
      that.setData({
        upload_picture_list: upload_picture_list
      });
    } else {
      wx.showToast({
        icon: 'none',
        title: res.data.content,
      })
    }
  },
  getDes: function(e) {
    this.setData({
      description: e.detail.value,
    })
  },
  getDetail: function(e) {
    this.setData({
      detail: e.detail.value,
    })
  },
  isMoreFn({
    detail
  }) {
    this.setData({
      isMore: detail
    })
  },
  isOpenFn({
    detail
  }) {
    this.setData({
      isOpen: detail
    })
  },
  getSort(e) {
    this.setData({
      sort: e.detail
    })
  },
  getNum(e) {
    this.setData({
      num: e.detail
    })
  },
  selectSpec(e) {
    var result = e.currentTarget.dataset.index
    // this.setData({
    //   select:result
    // })
    var list = this.data.specList
    var that = this
    if (this.data.type == 'update') {
      var url = app.globalData.baseUrl + 'apiMall/food/admin/updateAttr'
      // for (var item of result) {
      list.map((jtem, index) => {
        if (result == index) {
          jtem.status = jtem.status == 1 ? 0 : 1
          var data = {
            attrId: jtem.keyId,
            attrName: jtem.attrName,
            sellPrice: jtem.attrPrice,
            status: jtem.status
          }
          util.postRequestList(url, data, false, that.updateSpecRes)
        }
      })
      // }
      this.setData({
        changeList: list
      })
    } else {
      for (var item of result) {
        list.map((jtem, index) => {
          if (item == index) {
            jtem.status = jtem.status == 1 ? 0 : 1
          }
        })
      }
      this.setData({
        specList: list
      });
    }
  },
  updateSpecRes(res) {
    var that = this
    if (res.data.code == 200) {
      that.setData({
        specList: that.data.changeList
      })
    } else {
      wx.showModal({
        title: '提示',
        content: res.data.message,
        showCancel: false,
      })
    }
  },
  goAdd: function() {
    wx.navigateTo({
      url: '../spec/detail?type="renew"',
    })
  },
  goDetail() {
    wx.navigateTo({
      url: '../spec/detail?index=' + this.data.specIndex,
    })
  },
  getName(e) {
    this.setData({
      name: e.detail
    })
  },
  delSpec(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      specIndex: index
    })
    if (this.data.type == 'update') {
      var url = app.globalData.baseUrl + 'apiMall/food/admin/deleteAttr'
      var data = {
        attrId: this.data.specList[index].keyId,
        foodId: this.data.foodId
      }
      util.postRequestList(url, data, false, this.delSpecRes)
    } else {
      var list = this.data.specList
      list.splice(index, 1)
      this.setData({
        specList: list
      })
    }
  },
  delSpecRes(res) {
    var that = this
    if (res.data.code == 200) {
      var list = that.data.specList
      list.splice(that.data.specIndex, 1)
      that.setData({
        specList: list
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: res.data.message,
      })
    }
  },
  onSubmit() {
    if (this.data.isSubmit) {
      return false
    }
    this.setData({
      isSubmit: true
    })
    var list = this.data.upload_picture_list
    var imgList = []
    if (this.data.type != 'update') {
      for (var item of list) {
        imgList.push(item.path_server)
      }
      var url = app.globalData.baseUrl + 'apiMall/food/admin/add'
      var data = {
        cateId: this.data.cateId,
        foodName: this.data.name,
        mainPic: this.data.mainImg,
        noCountLimit: this.data.isMore ? 1 : 0,
        description: this.data.description,
        sortNum: this.data.sort,
        status: this.data.isOpen ? 1 : 0,
        attrsDetail: JSON.stringify(this.data.specList),
        detail: this.data.detail,
        imgList: imgList
      }
      if (!this.data.isMore) {
        data.limitCount = this.data.num
      }
      util.postRequestList(url, data, false, this.addRes)
    } else {
      var url = app.globalData.baseUrl + 'apiMall/food/admin/update'
      var data = {
        foodId: this.data.foodId,
        cateId: this.data.cateId,
        foodName: this.data.name,
        mainPic: this.data.mainImg,
        noCountLimit: this.data.isMore ? 1 : 0,
        description: this.data.description,
        status: this.data.isOpen ? 1 : 0,
        detail: this.data.detail,
        sortNum: this.data.sort,
      }
      if (!this.data.isMore) {
        data.limitCount = this.data.num
      }
      util.postRequestList(url, data, false, this.updateRes)
    }
  },
  addRes(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: res.data.message,
        duration: 2000
      })
    }
    this.setData({
      isSubmit: false
    })
  },
  updateRes(res) {
    if (res.data.code == 200) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: res.data.message,
        duration: 2000
      })
    }
    this.setData({
      isSubmit: false
    })
  },
  getFoodDetail() {
    var url = app.globalData.baseUrl + 'apiMall/food/admin/detail'
    var data = {
      foodId: this.data.foodId
    }
    util.getRequestListData(url, data, false, this.detailRes)
  },
  detailRes(res) {
    var detail = res.data.content
    var imgList = []
    detail.imgList.map((item) => {
      var jtem = {}
      if(item.isMain!=1){
        jtem.upload_percent = 100
        jtem.path_server = item.imgUrl
        jtem.keyId = item.keyId
        imgList.push(jtem)
      }
    })
    var select = []
    var specList = detail.attrList.map((item, index) => {
      item.attrPrice = util.getMoney(item.sellPrice)
      if (item.useFlag) {
        select.push(index)
      }
      item.status = item.useFlag == true ? 1 : 0
      return item
    })
    this.setData({
      select: select,
      isNewPage: false,
      cateId: detail.foodInfo.cateId,
      name: detail.foodInfo.foodName,
      mainImg: detail.foodInfo.mainPic,
      isMore: detail.foodInfo.noCountLimit == "1",
      num: detail.foodInfo.limitCount,
      typeName: detail.foodInfo.cateName,
      cateId: detail.foodInfo.cateId,
      isOpen: detail.foodInfo.useFlag,
      detail: detail.foodDetail.detail,
      description: detail.foodInfo.desctiption,
      upload_picture_list: imgList,
      specList: specList
    })
    this.getCateList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      this.setData({
        foodId: options.id,
        type: 'update'
      })
      if (options.cateId) {
        this.setData({
          isNewPage: false,
          cateId: options.cateId
        })
      }
      wx.setNavigationBarTitle({
        title: '修改菜品',
      })
      this.getFoodDetail()
    } else {
      if (options.cateId) {
        this.setData({
          cateId: options.cateId,
          isNewPage: false
        })
      }
      // this.getCateList()
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
    this.getCateList()
    this.setData({
      isSubmit: false
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