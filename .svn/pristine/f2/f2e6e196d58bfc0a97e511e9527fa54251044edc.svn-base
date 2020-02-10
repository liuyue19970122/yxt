// components/card/fin-card/index.js
Component({
  externalClasses: ['gradient'],
  /**
   * 组件的属性列表
   */
  properties: {
    name:{
      type: String,
      required: true,
      value: ''
    },
    dotColor:{
      type: String,
      required: true,
      value: '#fd9140'
    },
    width:{
      type:String,
      required:true,
      value:''
    },
    rightText: {
      type: String,
      required: true,
      value: '60%'
    }, 
    leftText: {
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
    clickTap(e){
      let name = e.currentTarget.dataset.name
      this.triggerEvent('click', name);
    }
  }
})
