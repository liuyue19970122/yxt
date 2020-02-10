// components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width:{
      type:String,
      value:''
    },
    height:{
      type:String,
      value:''
    },
    padding: {
      type: String,
      value: ''
    },
    margin: {
      type: String,
      value: ''
    }, 
    radius: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    title:{
      type:String,
      value:''
    },
    num: {
      type: String,
      value: ''
    },
    info: {
      type: String,
      value: ''
    },
    titleHeight:{
    type: String,
    value: ''
    }, 
    color: {
      type: String,
      value: ''
    },
    detailHeight:{
      type: String,
      value: ''
    },
    dot:{
      type:Number,
      value:0
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
    dotFn:function(){
      this.triggerEvent('dotFn',{})
    }
  }
})
