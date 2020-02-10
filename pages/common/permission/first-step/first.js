// pages/common/permission/first-step/first.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
import Notify from '../../../../miniprogram_npm/vant-weapp/notify/notify';
import Toast from '../../../../miniprogram_npm/vant-weapp/toast/toast';
var MCAP = require('../../../../utils/code.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'APYBZ-TKQ6X-GAJ4A-7CDCW-JHK4K-LFB2Q' // 必填
});
var util = require('../../../../utils/util.js');
// var cityObj = require('../../../../utils/city.js');
const app = getApp()
var timestamp = Date.parse(new Date())
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isReadon: false,
    isSendSms: false,
    status: 0,
    code:'',
    codeStr:0,
    steps: [{
        text: '手机验证',
      },
      {
        text: '基本信息',
      },
      {
        text: '选择地址',
      },
      {
        text: '提交结果',
      },
    ],
    step: 0,
    ifAgree: false,
    markers: [],
    poi: {},
    applyType: 1,
    userInfoRules: {
      mobile: {
        required: true,
        vali: '/^1[3456789]\d{9}$/',
        size: 11,
        value: ''
      },
      password: {
        required: true,
        vali: '',
        size: 6,
        value: ''
      },
      smsCode: {
        required: true,
        vali: '',
        size: 6,
        value: ''
      },
    },
    orgInfoRules: {
      orgName: {
        required: true,
        value: ''
      },
      linkName: {
        required: true,
        value: ''
      },
      scopeId: {
        reqired: true,
        value: -1
      },
      cardFromUrl: '',
      cardbackUrl: '',
      companyUrl: '/utils/img/upload.png',
      specialUrl: [],
      recommeder: ''
    },
    scopeList: [],
    selectScopeList: [],
    scopeIndex: [0, 0],
    addressRules: {
      province: {
        required: true,
        value: ''
      },
      city: {
        required: true,
        value: ''
      },
      district: {
        required: true,
        value: ''
      },
      address: {
        required: true,
        value: ''
      },
      remark: {
        required: true,
        value: ''
      }
    },
    pIndex: 0,
    cIndex: 0,
    aIndex: 0,
    provinceList: [],
    cityList: [],
    selectCityList: [],
    areaList: [],
    selectAreaList: [],
    scopeId: 0,
    scopeName: '',
    permitPic: "/utils/img/upload.png",
    upload_picture_list: [],
    replyContent: '',
    seconds: 0,
    timer: null,
    isDownFinish:true
  },
  timeCountDown() {
    var that = this
    this.data.timer = setInterval(() => {
      if (that.data.seconds == 0) {
        clearInterval(this.data.timer)
        that.setData({
          timer: null
        })
      } else {
        that.setData({
          seconds: --that.data.seconds
        })
        console.log(that.data.seconds)
      }
    }, 1000)
  },
  reviewImg(e) {
    var type = e.currentTarget.dataset.type
    var urls = []
    var index = 0
    if (type == 'company') {
      urls.push(this.data.orgInfoRules.companyUrl)
    } else if (type == 'cardFront') {
      urls.push(this.data.orgInfoRules.cardFromUrl)
      urls.push(this.data.orgInfoRules.cardbackUrl)
    } else if (type == 'cardBack') {
      urls.push(this.data.orgInfoRules.cardFromUrl)
      urls.push(this.data.orgInfoRules.cardbackUrl)
    } else {
      index = e.currentTarget.dataset.index
      urls = this.data.orgInfoRules.specialUrl
    }
    wx.previewImage({
      correct: urls[index],
      urls: urls,
    })
  },
  goLogin() {
    if (this.data.isReadon) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  // 第一步
  downFile() {
    var that=this
    this.setData({
      isDownFinish:false
    })
    if(!this.data.isDownFinish){
      wx.showLoading({
        title: '正在打开...',
      })
      wx.downloadFile({
        url: "https://www.cdhenren.com/yxt/file/xy00001.docx",
        success(res) {
          wx.openDocument({
            filePath: res.tempFilePath,
            success: function (res) {
              setTimeout(() => {
                wx.hideLoading()
              }, 200)
              that.setData({
                isDownFinish:true
              })
            },
            fail() {
              that.setData({
                isDownFinish: true
              })
              setTimeout(()=>{
                wx.hideLoading()
              },200)
            }
          })
        },
        fail() {
          that.setData({
            isDownFinish: true
          })
          setTimeout(() => {
            wx.hideLoading()
          }, 200)
        }
      })
    }else{
      return false
    }
    
  },
  onChangeAgree(e) {
    if (this.data.isReadon) {
      return false
    }
    var _this = this
    this.setData({
      ifAgree: !_this.data.ifAgree
    })
  },
  bindMobile(e) {
    var userinfo = this.data.userInfoRules
    userinfo.mobile.value = e.detail
    this.setData({
      userInfoRules: userinfo
    })
  },
  bindPassword(e) {
    var userinfo = this.data.userInfoRules
    userinfo.password.value = e.detail
    this.setData({
      userInfoRules: userinfo
    })
  },
  bindSmsCode(e) {
    var userinfo = this.data.userInfoRules
    userinfo.smsCode.value = e.detail.value
    this.setData({
      userInfoRules: userinfo
    })
  },
  sendSmsCode() {
    setTimeout(()=>{
      var userinfo = this.data.userInfoRules
      if (!(/^1[3456789]\d{9}$/.test(userinfo.mobile.value))) {
        Notify({
          type: 'warning',
          message: '手机号格式不正确'
        });
        return false
      }
      if (this.data.codeStr.toUpperCase() != this.data.code.toUpperCase()) {
        Notify({
          type: 'warning',
          message: '图形验证码不正确'
        });
        return false
      }
      var url = app.globalData.baseUrl + 'apiUser/org/supply/smscode'
      var data = {
        mobile: userinfo.mobile.value
      }
      this.postRequest(url, data, this.sendSmsRes)
    },200)
  },
  sendSmsRes(res) {
    if (res.data.code == 200) {
      Toast('验证码已发送')
      this.setData({
        isSendSms: true,
        seconds: 300
      })
      this.timeCountDown()
    } else {
      Toast(res.data.message)
      this.setData({
        isSendSms: false
      })
    }
  },
  bindApplyType(e) {
    if (this.data.isReadon) {
      return false
    }
    this.setData({
      applyType: parseInt(e.currentTarget.dataset.type)
    })
  },
  // 第二步
  bindOrgName(e) {
    var orgInfo = this.data.orgInfoRules
    orgInfo.orgName.value = e.detail
    this.setData({
      orgInfoRules: orgInfo
    })
  },
  bindLinkName(e) {
    var orgInfo = this.data.orgInfoRules
    orgInfo.linkName.value = e.detail
    this.setData({
      orgInfoRules: orgInfo
    })
  },
  getScopeList() {
    var url = app.globalData.baseUrl + 'apiUser/org/supply/busScope'
    var data = {
      orgTypeId: this.data.applyType
    }
    var that = this
    wx.request({
      url: url,
      data: data,
      method: 'get',
      success: function(res) {
        that.scopeRes(res)
      }
    })
  },
  scopeRes(res) {
    var resList = res.data.content
    for (var item of resList) {
      item.nextList = JSON.parse(item.nextList)
    }
    this.setData({
      scopeList: resList,
      scopeId: resList[0].nextList[0].keyId
    })
    var multiArr = resList.map(item => {
      return item.scope
    })
    var list = []
    list.push(multiArr)
    var nextArr = resList[0].nextList.map(item => {
      return item.scope
    })
    list.push(nextArr)
    this.setData({
      selectScopeList: list
    })
  },
  bindMultiPickerChange: function(e) {
    this.setData({
      scopeIndex: e.detail.value
    })
    var index = e.detail.value
    var that = this
    this.setData({
      scopeId: that.data.scopeList[index[0]].nextList[index[1]].keyId
    })
    console.log(this.data.scopeId)
  },
  bindMultiPickerColumnChange: function(e) {
    var data = {
      selectScopeList: this.data.selectScopeList,
      scopeIndex: this.data.scopeIndex
    };
    data.scopeIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      var nextArr = this.data.scopeList[e.detail.value].nextList.map(item => {
        return item.scope
      })
      var list = data.selectScopeList
      list.splice(1, 1)
      list.push(nextArr)
    }
    this.setData(data);
  },
  // 上传印业执照
  chooseImg: function(e) {
    if (this.data.isReadon) {
      this.reviewImg(e)
      return false
    }
    var that = this
    var type = e.currentTarget.dataset.type
    wx.chooseImage({
      count: 1,
      success: function(res) {
        wx.showLoading({
          title: '正在上传...',
        })
        var temp = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.fileUploadUrl + '/apiUser/file/upload',
          filePath: temp[0],
          name: 'file',
          // header: {
          //   Authorization: wx.getStorageSync('localToken').token
          // },
          success: function(res) {
            setTimeout(() => {
              wx.hideLoading()
            }, 200)
            console.log(res)
            Toast.success("上传成功")
            var content = JSON.parse(res.data).content
            var orgInfo = that.data.orgInfoRules
            if (type == 'company') {
              orgInfo.companyUrl = content
            } else if (type == 'cardFront') {
              orgInfo.cardFromUrl = content
            } else if (type == 'cardBack') {
              orgInfo.cardbackUrl = content
            }
            console.log(orgInfo)
            that.setData({
              orgInfoRules: orgInfo
            })
          },
          fail: function(res) {
            setTimeout(() => {
              wx.hideLoading()
              Toast.fail('上传失败')
            }, 200)
          }
        })
      },
    })
  },
  uploadImgList() {
    wx.chooseImage({
      count: 9,
      success: function(res) {
        wx.showLoading({
          title: '正在上传...',
        })
        var temp = res.tempFilePaths
        for (var item of temp) {
          wx.uploadFile({
            url: app.globalData.baseUrl + 'apiUser/file/upload',
            filePath: item,
            name: 'file',
            success: function(res) {
              setTimeout(() => {
                wx.hideLoading()
              }, 200)
            },
            fail: function(res) {
              setTimeout(() => {
                wx.hideLoading()
                wx.showToast({
                  title: '上传失败',
                })
              }, 200)
              
            }
          })
        }
      },
    })
  },
  //选择图片方法
  uploadpic: function(e) {
    if (this.data.isReadon) {
      return false
    }
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 9 - that.data.upload_picture_list.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
        });
        that.uploadimage()
      }
    })
  },
  //点击上传事件
  uploadimage: function() {
    var page = this
    var upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {　　　　　　 //调用函数
        page.upload_file_server(upload_picture_list, j)
      }
    }
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
        // console.log(res)
        if (JSON.parse(res.data).code == 200) {
          var filename = data.content //存储地址 显示
          upload_picture_list[j]['path_server'] = filename
          var orgInfo = that.data.orgInfoRules
          orgInfo.specialUrl = upload_picture_list.map((item) => {
            return item.path_server
          })
          that.setData({
            upload_picture_list: upload_picture_list,
            orgInfoRules: orgInfo
          });
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
  // 删除图片
  deleteImg: function(e) {
    var that = this
    let index = e.currentTarget.dataset.index;
    let upload_picture_list = that.data.upload_picture_list;
    upload_picture_list.splice(index, 1);
    var orgInfo = that.data.orgInfoRules
    orgInfo.specialUrl = upload_picture_list.map((item) => {
      return item.path_server
    })
    that.setData({
      upload_picture_list: upload_picture_list,
      orgInfoRules: orgInfo
    });
  },
  // 第三步
  bindInputRemark(e) {
    var addressRules=this.data.addressRules
    addressRules.remark.value=e.detail.value
    this.setData({
      addressRules
    })
  },
  getAddress() {
    var _this = this;
    var location
    if (_this.data.poi.hasOwnProperty('latitude')) {
      location = {
        latitude: _this.data.poi.latitude,
        longitude: _this.data.poi.longitude
      }
    }
    qqmapsdk.reverseGeocoder({
      location: location,
      success: function(res) { //成功后的回调
        var res = res.result;
        var addressRules = _this.data.addressRules
        addressRules.province.value = res.address_component.province
        addressRules.city.value = res.address_component.city
        addressRules.district.value = res.address_component.district
        addressRules.address.value = res.formatted_addresses.recommend
        var mks = [];
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
        mks.push({ // 获取返回结果，放到mks数组中
          title: res.address,
          id: 0,
          latitude: res.location.lat,
          longitude: res.location.lng,
          iconPath: '../../../../utils/img/map_mark.png', //图标路径
          width: 20,
          height: 20,
          callout: { //在markers上展示地址名称，根据需求是否需要
            color: '#000',
            display: 'ALWAYS'
          }
        });
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          },
          addressRules: addressRules
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
    // this.chooseLocation()
  },
  getPoi() {
    var _this = this;
    //调用地址解析接口
    var province = this.data.addressRules.province.value
    var city = this.data.addressRules.city.value
    var area = this.data.addressRules.district.value
    var address = this.data.addressRules.address.value
    var detail = province + city + area + address
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: detail, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function(res) { //成功后的回调
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
          poi: { //根据自己data数据设置相应的地图中心坐标变量名称
            latitude: latitude,
            longitude: longitude
          }
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  chooseLocation() {
    console.log(this.data.poi)
    var that = this
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.chooseLocation({
                latitude: that.data.poi.latitude,
                longitude: that.data.poi.longitude,
                success: function (res) {
                  console.log(res)
                  var addressRules = that.data.addressRules
                  addressRules.address.value = res.name
                  var poi = {
                    latitude: res.latitude,
                    longitude: res.longitude
                  }
                  that.setData({
                    poi,
                    addressRules
                  })
                  that.getAddress()
                },
              })
            }
          })
        }
      }
    }) 
  },
  // 切换步骤
  goNextStep(e) {
    var step = this.data.step
    console.log(step)
    switch (step) {
      case 0:
        this.firstStepNext();
        break;
      case 1:
        this.secondStepNext();
        break;
      case 2:
        this.thirdStepNext()
        break;
    }
  },
  firstStepNext() {
    var that = this
    if (this.data.isReadon) {
      this.setData({
        step: ++that.data.step
      })
      return false
    }
    var userinfo = this.data.userInfoRules
    if (!(/^1[3456789]\d{9}$/.test(userinfo.mobile.value))) {
      Notify({
        type: 'warning',
        message: '手机号格式不正确'
      });
      return false
    }
    if (userinfo.password.value.length < userinfo.password.size) {
      Notify({
        type: 'warning',
        message: '密码不能小于六位数'
      });
      return false
    }
    if (userinfo.smsCode.value.length != userinfo.smsCode.size) {
      Notify({
        type: 'warning',
        message: '验证码格式不正确'
      });
      return false
    }
    if (!this.data.isSendSms) {
      Notify({
        type: 'warning',
        message: '请先发送验证码'
      });
      return false
    }
    if (!this.data.ifAgree) {
      Notify({
        type: 'warning',
        message: '请同意用户协议！'
      });
      return false
    }

    var url = app.globalData.baseUrl + 'apiUser/org/supply/checkSmsCode'
    var data = {
      mobile: userinfo.mobile.value,
      code: userinfo.smsCode.value
    }
    this.postRequest(url, data, this.checkSmsRes)
  },
  postRequest(url, data, callback) {
    wx.request({
      url: url,
      data: data,
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function(res) {
        if (res.statusCode == 200) {
          callback(res)
        }
      }
    })
  },
  secondStepNext() {
    var _this = this
    if (this.data.isReadon) {
      this.setData({
        step: ++_this.data.step
      })
      return false
    }
    var orgInfo = this.data.orgInfoRules
    console.log(this.data.scopeId)
    if (orgInfo.orgName.value.length == 0) {
      Notify({
        type: 'warning',
        message: '请输入商家名称'
      });
      return false
    }
    if (orgInfo.linkName.value.length == 0) {
      Notify({
        type: 'warning',
        message: '请输入联系人'
      });
      return false
    }
    if (orgInfo.cardFromUrl.length == 0) {
      Notify({
        type: 'warning',
        message: '请上传正面身份证'
      });
      return false
    }
    if (orgInfo.cardbackUrl.length == 0) {
      Notify({
        type: 'warning',
        message: '请上传反面身份证'
      });
      return false
    }
    // if (orgInfo.companyUrl.indexOf('118') == -1) {
    //   Notify({
    //     type: 'warning',
    //     message: '请上传营业执照'
    //   });
    //   return false
    // }
    // if (orgInfo.specialUrl.length == 0) {
    //   Notify({
    //     type: 'warning',
    //     message: '请上传相关资质'
    //   });
    //   return false
    // }
    this.setData({
      step: 2
    })
  },
  submitRes(res) {
    if (res.data.code == 200) {
      this.setData({
        step: 3,
        status: 0,
        isReadon:true
      })
    } else {
      Toast.fail(res.data.message)
    }
  },
  thirdStepNext() {
    var _this = this
    if (this.data.isReadon) {
      this.setData({
        step: ++_this.data.step
      })
      return false
    }
    var address = this.data.addressRules
    if (address.address.length == 0) {
      Notify({
        type: 'warning',
        message: '请输入详细地址'
      });
      return false
    }
    var userInfo = this.data.userInfoRules
    var orgInfo = this.data.orgInfoRules
    console.log(JSON.stringify(orgInfo.specialUrl))
    var poi = this.data.poi
    var url = app.globalData.baseUrl + 'apiUser/org/supply/submit'
    var data = {
      typeId: this.data.applyType,
      scopeId: this.data.scopeId,
      orgName: orgInfo.orgName.value,
      linkName: orgInfo.linkName.value,
      cardFromUrl: orgInfo.cardFromUrl,
      cardbackUrl: orgInfo.cardbackUrl,
      companyUrl: orgInfo.companyUrl.indexOf('118') == -1 ? "" : orgInfo.companyUrl,
      specialUrl: JSON.stringify(orgInfo.specialUrl),
      recommeder: orgInfo.recommeder,
      mobile: userInfo.mobile.value,
      password: userInfo.password.value,
      province: address.province.value,
      city: address.city.value,
      area: address.district.value,
      address: address.address.value,
      longitude: poi.longitude,
      latitude: poi.latitude,
      
    }
    if (this.data.keyId > 0) {
      data.keyId = this.data.keyId
    }
    this.postRequest(url, data, this.submitRes)
  },
  checkSmsRes(res) {
    if (res.data.code == 200) {
      clearInterval(this.data.timer)
      this.setData({
        step: 1,
        timer: null,
        seconds:0,
      })
      this.getScopeList()
    } else {
      Toast(res.data.message)
    }
  },
  goLastStep(e) {
    var _this = this
    this.setData({
      step: --_this.data.step
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.supplyObj) {
      var obj = JSON.parse(options.supplyObj)
      var userInfo = this.data.userInfoRules
      var addressInfo = this.data.addressRules
      var orgInfo = this.data.orgInfoRules
      var poi = this.data.poi
      orgInfo.orgName.value = obj.orgName
      orgInfo.linkName.value = obj.linkName
      orgInfo.cardFromUrl = obj.cardFrontFile
      orgInfo.cardbackUrl = obj.cardBackFile
      orgInfo.companyUrl = obj.companyFile
      orgInfo.specialUrl = JSON.parse(obj.specialFile)
      var urls = JSON.parse(obj.specialFile)
      var uploadUrls = []
      urls.map((item) => {
        var jtem = {}
        jtem.upload_percent = 100
        jtem.path_server = item
        uploadUrls.push(jtem)
      })
      orgInfo.recommeder = obj.recommeder
      addressInfo.province.value = obj.province
      addressInfo.city.value = obj.city
      addressInfo.district.value = obj.area
      addressInfo.address.value = obj.address
      poi.longitude = obj.longitude
      poi.latitude = obj.latitude
      userInfo.mobile.value = obj.mobile
      this.setData({
        userInfoRules: userInfo,
        addressRules: addressInfo,
        poi: poi,
        orgInfoRules: orgInfo,
        scopeId: obj.scopeId,
        scopeName: obj.scopeName,
        applyType: obj.orgType,
        status: obj.status,
        isReadon: true,
        ifAgree: true,
        replyContent: obj.replyContent,
        step: 3,
        upload_picture_list: uploadUrls,
        keyId: obj.keyId
      })
    } else {
      this.getAddress()
      // this.setData({
      //   provinceList: cityObj.provinceList,
      //   cityList: cityObj.cityList,
      //   areaList: cityObj.areaList,
      //   selectCityList: cityObj.cityList,
      //   selectAreaList: cityObj.areaList,
      // })
      this.getScopeList()
      this.initDraw()
    }
  },
  /**
   * 制作验证码
   */
  initDraw() {
    var that = this;
    var codes = that.getRanNum();
    that.setData({
      codeStr: codes //生成的验证码
    })
    new MCAP({
      el: 'canvas',
      width: 120,
      height: 40,
      code: codes
    });
  },
  /**
   * 更换验证码
   */
  changeImg: function () {
    this.initDraw();
  },
  /**
   * 图片验证码绑定变量 
   */
  bindCode: function (e) {
    console.log('999')
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 获取随机数
   */
  getRanNum: function () {
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var pwd = '';
    for (var i = 0; i < 4; i++) {
      if (Math.random() < 48) {
        pwd += chars.charAt(Math.random() * 48 - 1);
      }
    }
    return pwd;
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
    // that.mapCtx = wx.createMapContext("ofoMap");
    // //this.movetoPosition();
    // that.mapCtx.getCenterLocation({
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     that.getLocal(latitude, longitude)
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timer)
    this.setData({
      timer: null
    })
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