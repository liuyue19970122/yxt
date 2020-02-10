// components/cate-picker/cate-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    range:{
      type:String,
      value:''
    },
    cateList:{
      type:Array,
      value:[]
    },
    name:{
      type:String,
      value:''
    },
    isReadon:{
      type:Boolean,
      value:false
    },
    mode:{
      type:String,
      value:'selector'
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
    bindPickerChange:function(e){
      this.triggerEvent('change',e)
    },
    bindColumnChange:function(e){
      this.triggerEvent('columnChange', e)
    }
  }
})
