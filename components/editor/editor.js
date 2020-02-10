const app=getApp()
Component({
  properties:{
    html:{
      type:String,
      required:false,
      default:''
    }
  },
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      const platform = wx.getSystemInfoSync().platform
      const isIOS = platform === 'ios'
      this.setData({ isIOS })
      const that = this
      this.updatePosition(0)
      let keyboardHeight = 0
      wx.onKeyboardHeightChange(res => {
        if (res.height === keyboardHeight) return
        const duration = res.height > 0 ? res.duration * 1000 : 0
        keyboardHeight = res.height
        setTimeout(() => {
        //   wx.pageScrollTo({
        //     scrollTop: 0,
        //     success() {
              console.log(that.editorCtx)
              that.updatePosition(keyboardHeight)
              that.editorCtx.scrollIntoView()
            // }
        //   })
        }, duration)

      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods:{
    updatePosition(keyboardHeight) {
      const toolbarHeight = 50
      const { windowHeight, platform } = wx.getSystemInfoSync()
      let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
      this.setData({ editorHeight, keyboardHeight })
    },
    calNavigationBarAndStatusBar() {
      const systemInfo = wx.getSystemInfoSync()
      const { statusBarHeight, platform } = systemInfo
      const isIOS = platform === 'ios'
      const navigationBarHeight = isIOS ? 44 : 48
      return statusBarHeight + navigationBarHeight
    },
    onEditorReady() {
      const that = this
      this.createSelectorQuery().select('#editor').context(function (res) {
        console.log(res.context)
        that.editorCtx = res.context
        that.editorCtx.setContents({
          html:that.data.html,
          success: function (res) {
            console.log(res)
          },
          fail: function (ree) {
            console.log(err)
          }
        })
      }).exec(res=>{
        console.log(res)
      })
    },
    editorSetContent(html){
      if(this.editorCtx){
        this.editorCtx.setContents({
          html: html,
          success: function (res) {
            console.log(res)
          },
          fail: function (ree) {
            console.log(err)
          }
        })
      }
    },
    blur() {
      this.editorCtx.blur()
    },
    format(e) {
      console.log(e)
      let { name, value } = e.target.dataset
      if (!name) return
      // console.log('format', name, value)
      
      this.editorCtx.format(name, value)

    },
    onStatusChange(e) {
      console.log(e)
      const formats = e.detail
      this.setData({ formats })
    },
    onInput(e){
      this.triggerEvent('input', e.detail);
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
    },
    removeFormat() {
      this.editorCtx.removeFormat()
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    insertImage() {
      const that = this
      wx.chooseImage({
        count: 1,
        success: function (res) {
          wx.showLoading({
            title: '上传中...',
            mask:true
          })
          let imgSrc = res.tempFilePaths[0]
          wx.uploadFile({
            url: app.globalData.fileUploadUrl+'/apiUser/file/upload',
            filePath: imgSrc,
            name: 'file',
            header: {
              Authorization: wx.getStorageSync('localToken').token
            },
            success: function (res) {
              console.log(res)
              wx.hideLoading()
              if (res.statusCode===200){
                let result = res.data
                let imgUrl = JSON.parse(result).content
                that.editorCtx.insertImage({
                  src: imgUrl,
                  data: {
                    id: 'abcd',
                    role: 'god'
                  },
                  width: '100%',
                  success: function () {
                    console.log('insert image success')
                  }
                })
              }else{
                that.blur()
              }
            },
            fail: function (err) {
              console.log(err)
              wx.showToast({
                title: '网络故障！',
                icon:'none'
              })
              wx.hideLoading()
            }
          })
         
        }
      })
    }
  },
  observers:{
    html(newHtml){
      this.editorSetContent(newHtml)
    }
  }
})
