// components/tab-sort/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      required:true,
      value:'排序'
    },
    up: {
      type: Boolean,
      required: true,
      value: false
    },
    down: {
      type: Boolean,
      required: true,
      value: false
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
    bindSort(e){
      this.triggerEvent('sort',e)
    }
  }
})
