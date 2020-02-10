// components/page-title/page-title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon:{
      type:String,
      value:''
    },
    title:{
      type:String,
      value:''
    },
    isAdd:{
      type:Boolean,
      value:true
    },
    picker:{
      type: Boolean,
      value: true
    },
    name:{
      type: String,
      value: ''
    },
    array:{
      type:Array,
      value:[]
    },
    range:{
      type:Number,
      value:0
    },
    isEdit:{
      type: Boolean,
      value: false
    },
    editIcon:{
      type: String,
      value: ''
    },
    op:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // range: ''
  },
  onload:function(){
    // this.setData({
    //   range:this.properties.array[0].id
    // })
    // console.log(this.data.range)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindPickerChange(e){
      this.triggerEvent("change", {value:e.detail.value})
    },
    onAdd(){
      this.triggerEvent("add",{})
    },
    onEdit() {
      this.triggerEvent("edit", {})
    },
    onOp(){
      this.triggerEvent('opFn',{})
    }
  }
})
