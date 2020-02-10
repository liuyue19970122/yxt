// components/card/pro-card/index.js
Component({
  options:{
    multipleSlots: true,
  },
  externalClasses: ['imgsize'],
  /**
   * 组件的属性列表
   */
  properties: {
    index: {//标识符
      type: String || Number,
      required: true,
      value: ''
    },
    title: {
      type: String,
      required: true,
      value: ''
    },
    subTitle: {
      type: String,
      required: false,
      value: ''
    },
    specTitle:{
      type: String,
      required: false,
      value: ''
    },
    oriPrice: {
      type: String,
      required: false,
      value: ''
    },
    salePrice: {
      type: String,
      required: false,
      value: ''
    },
    imgSrc: {
      type: String,
      required: true,
      value: ''
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
    bindClick(e) {
      let index=e.currentTarget.dataset.index
      this.triggerEvent('click', index);
    }
  }
})
