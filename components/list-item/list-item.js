// components/list-item/list-item.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    height:{
      type:String,
      value:'140rpx'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    bingRightTap:function(e){
      this.triggerEvent('tap',{value:e.detail})
    }
  }
})
