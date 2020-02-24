// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:String,
      value:''
    },
    searchClass:{
      type: String,
      value: ''
    },
    isMsg:{
      type:Boolean,
      value:false
    },
    placeholder:{
      type:String,
      value:'请输入您想要搜索的商品'
    },
    customStyle:{
      type: String,
      value: ''
    },
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
    onSearch: function () {
      this.triggerEvent('search', {})
    },
    onCancel: function () {
      this.triggerEvent('cancel', {})
    },
    bindConfirm:function () {
      this.triggerEvent('search', {})
    },
    bindInput:function(e){
      console.log(e)
      this.triggerEvent('input', {value:e.detail})
    }
  }
})
