// components/tab-view/tab-view.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabList:{
      type:Array,
      value:[]
    },
    type:{
      type:String,
      value:''
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
    changeTab:function(e){
      var type=e.currentTarget.dataset.type
      this.triggerEvent('change', {type:type})
    }
  }
})
