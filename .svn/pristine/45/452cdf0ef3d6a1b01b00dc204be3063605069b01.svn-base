// pages/mall/chat-detail/chat-detail.js
var util = require('../../../../utils/util.js');
const app = getApp()
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 200;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [], // 聊天记录
    msg: '', // 当前输入
    scrollTop: 0, // 页面的滚动值
    socketOpen: true, // websocket是否打开
    lastId: 3, // 最后一条消息的ID
    isFirstSend: true, // 是否第一次发送消息(区分历史和新加)
    scrollHeight: 'calc(100vh - 100rpx)',
    inputBottom: 0,
    userInfo:{},
    message:'',
    orgId:''
  },
  chooseImage() {
    var that = this
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;

        var list = that.data.messages
        for (var i = 0; i < tempFilePaths.length; i++) {
          var item;
          var width = 0;
          var height = 0
          var src = tempFilePaths[i]
          wx.getImageInfo({
            src: src,
            success: function(res) {
              width = res.width > 251 ? 251 : res.width
              if (res.width > 251) {
                height = (251 * res.height) / res.width
              } else {
                height = res.height
              }
              item = {
                id: list.length + 1,
                userId: 1,
                avator: '/utils/img/del.png',
                img: res.path,
                width: width + 'px',
                height: height + 'px'
              }
              list.push(item)
              that.setData({
                messages: list
              })
              that.delayPageScroll()
            }
          })
        }

        //启动上传等待中...  
        // wx.showToast({
        //   title: '正在上传...',
        //   icon: 'loading',
        //   mask: true,
        //   duration: 10000
        // })
        // var uploadImgCount = 0;
        // for (var i = 0, h = tempFilePaths.length; i < h; i++) {
        //   wx.uploadFile({
        //     url: util.getClientSetting().domainName + '/home/uploadfilenew',
        //     filePath: tempFilePaths[i],
        //     name: 'uploadfile_ant',
        //     formData: {
        //       'imgIndex': i
        //     },
        //     header: {
        //       "Content-Type": "multipart/form-data"
        //     },
        //     success: function(res) {
        //       uploadImgCount++;
        //       var data = JSON.parse(res.data);
        //       //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }  
        //       var productInfo = that.data.productInfo;
        //       if (productInfo.bannerInfo == null) {
        //         productInfo.bannerInfo = [];
        //       }
        //       productInfo.bannerInfo.push({
        //         "catalog": data.Catalog,
        //         "fileName": data.FileName,
        //         "url": data.Url
        //       });
        //       that.setData({
        //         productInfo: productInfo
        //       });

        //       //如果是最后一张,则隐藏等待中  
        //       if (uploadImgCount == tempFilePaths.length) {
        //         // wx.hideToast();
        //       }
        //     },
        //     fail: function(res) {
        //       wx.hideToast();
        //       wx.showModal({
        //         title: '错误提示',
        //         content: '上传图片失败',
        //         showCancel: false,
        //         success: function(res) {}
        //       })
        //     }
        //   });
        // }
      },
    })
  },
  previewImg(url) {
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [] // 需要预览的图片http链接列表
    })
  },
  sendMsg: function() {
    var list = this.data.messages
    var item = {
      id: list.length + 1,
      userId: 1,
      avator: '/utils/img/del.png',
      msg: this.data.msg
    }
    // var orgId=this.data.orgId==''?3:this.data.orgId
    const data = {
      toOrgId: this.data.orgId == '' ? 3 : this.data.orgId,
      toUser: '',
      fromUser: this.data.token,
      msgType: 'text',
      content: this.data.msg
    };
    console.log(JSON.stringify(data))
    list.push(item)
    this.setData({
      msg: "",
      // lastId: list.length + 1,
      messages: list
    })
    if (this.data.socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      })
    }
    this.delayPageScroll()
    var that = this
    // setTimeout(()=>{
    //   that.setData({
    //     msg: 'hh'
    //   })
    // },1000)
  },
  inputContent: function(e) {
    this.setData({
      msg: e.detail.value
      // msg: "332",
    })
  },
  // 聚焦
  // onFocus() {
  focus: function(e) {
    keyHeight = e.detail.height;
    console.log(keyHeight)
    this.setData({
      scrollHeight: (windowHeight - keyHeight-70) + 'px'
    });
    this.delayPageScroll()
    this.setData({
      // toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
    // // 计算msg高度
    // calScrollHeight(this, keyHeight);

    // },
    // this.setData({
    //   scrollTop: 9999999
    // });
  },
  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: 'calc(100vh - 100rpx)',
      inputBottom: 0
    })
    this.delayPageScroll()

    // this.setData({
    //   toView: 'msg-' + (msgList.length - 1)
    // })

  },
  connect() {
    // var token = wx.getStorageSync("localToken").token
    // wx.connectSocket({
    //   url: 'ws://192.168.124.101:8704/websocket/' + token
    // });
    // wx.onSocketOpen(res => {
    //   this.setData({
    //     socketOpen: true
    //   });
    //   var data = {
    //     toOrgId:3,
    //     toUser:'',
    //     fromUser:token,
    //     msgType:'text',
    //     content:'你吃饭了么'
    //   }
    //   console.log(JSON.stringify(data))
    //   // 模拟历史消息的发送
    //   wx.sendSocketMessage({
    //     data: JSON.stringify(data),
    //   })
    // });
    // wx.onSocketClose(res => {
    //   console.log('WebSocket 已关闭！')
    // });
    wx.onSocketMessage(res => {
      console.log(res)
      const isFirstSend = this.data.isFirstSend;
      const data = JSON.parse(res.data);
      let messages = this.data.messages;
      let lastId = '';

      // 第一次为接收历史消息，
      // 之后的为新加的消息
      if (isFirstSend) {
        messages = messages.concat(data);
        lastId = messages.length;
        console.log(messages)
        this.setData({
          messages,
          lastId,
          orgId: messages[0].fromOrg,
          isFirstSend: false
        });
      } else {
        messages.push(data);
        console.log(messages)
        const length = messages.length;
        console.log()
        lastId = messages.length;
        this.setData({
          messages,
          lastId
        });
      }
      // 延迟页面向顶部滑动
      this.delayPageScroll();
    });
    
  },
  // 设置昵称
  setNickName(option) {
    const nickname = option.nickname || 'Marry';
    wx.setNavigationBarTitle({
      title: nickname
    });
  },
  // 发送消息
  send() {
    const socketOpen = this.data.socketOpen;
    let messages = this.data.messages;
    let nums = messages.length;
    let msg = this.data.msg;

    if (msg === '') {
      return false;
    }

    const data = {
      toOrgId: 3,
      toUser: '',
      fromUser: this.data.token,
      msgType: 'text',
      content: msg
    };
    this.setData({
      msg: ''
    });

    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify(data)
      })
    }
  },
  // 延迟页面向顶部滑动
  delayPageScroll() {
    const messages = this.data.messages;
    const length = messages.length;
    const lastId = messages.length > 0 ? messages[length - 1].id :0;
    setTimeout(() => {
      this.setData({
        lastId
      });
      // console.log(this.data.lastId)
    }, 100);
    // console.log(this.data.lastId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var windowHeight = wx.getSystemInfoSync().windowHeight
    this.setNickName(options);
    // this.delayPageScroll()
    var token=wx.getStorageSync("localToken").token
    this.connect()
    var userInfo = wx.getStorageSync("localToken").userInfo
    this.setData({
      userInfo:userInfo,
      token:token
    })
    var url = app.globalData.baseUrl +'apiUser/user/info'
    util.getRequestList(url,false,this.getUser)
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
    // console.log("999")
    // const socketOpen = this.data.socketOpen;
    // if (socketOpen) {
    //   const data = {
    //     toOrgId: '',
    //     toUser: '',
    //     fromUser: this.data.token,
    //     msgType: 'close',
    //     content: ''
    //   };
    //   console.log(JSON.stringify(data))
    //   wx.sendSocketMessage({
    //     data: JSON.stringify(data),
    //     success:function(res){
    //       console.log(res)
    //     },
    //     fail:function(res){
    //       console.log(res)
    //     }
    //   })
    //   wx.closeSocket({});
    //   wx.onSocketClose(res => {
    //     console.log('WebSocket 已关闭！')
    //   });
    // }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // console.log("888")
    // const socketOpen = this.data.socketOpen;
    // if (socketOpen) {
    //   const data = {
    //     toOrgId: '',
    //     toUser: '',
    //     fromUser: this.data.token,
    //     msgType: 'close',
    //     content: ''
    //   };
    //   console.log(JSON.stringify(data))
    //   wx.sendSocketMessage({
    //     data: JSON.stringify(data),
    //     success: function (res) {
    //       console.log(res)
    //     },
    //     fail: function (res) {
    //       console.log(res)
    //     }
    //   })
    //   wx.closeSocket({});
      
    // }
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