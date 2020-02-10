// components/panel/panel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    menuList:{
      type:Array,
      value:[]
    },
    noReadCount:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    timestamp:Date.parse(new Date())
  },
  /**
   * 组件的方法列表
   */
  methods: {
    tiggle:function(e){
      var id = e.currentTarget.dataset.id
      var menuList = this.data.menuList
      menuList.map((item)=>{
        if(item.id==id){
          item.isClose=!item.isClose
        }else{
          item.isClose = true
        }
      })
      this.setData({
        menuList: menuList
      })
    },
    goPage:function(e){
      var page=e.currentTarget.dataset.page
      wx.navigateTo({
        url: page,
      })
    }
  }
})
