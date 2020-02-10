// components/fin-pie/index.js
Component({
  externalClasses: ['line'],
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String,
      required: true,
      value: ''
    },
    price:{
      type: String,
      required: true,
      value: ''
    },
    subPrice:{
      type: String,
      required: true,
      value: ''
    },
    bgColor:{
      type: String,
      required: false,
      value: '#FFAC03'
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

  }
})
