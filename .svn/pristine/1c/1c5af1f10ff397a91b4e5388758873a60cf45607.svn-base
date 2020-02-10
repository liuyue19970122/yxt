// components/tab-block/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    key:{
      type:String,
      require:true,
      value:'name'
    },
    list:{
      type: Array,
      require: true,
      value: []
    },
    active:{
      type: Number,
      require: true,
      value: 0
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
    onClick(e){
      let index=e.currentTarget.dataset.index
      this.triggerEvent('click',index)
    }
  }
})
