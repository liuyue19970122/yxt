// components/form-item/form-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isBorder:{
      type:Boolean,
      value:true
    },
    label:{
      type:String,
      value:''
    },
    isRequired:{
      type: Boolean,
      value: false
    },
    value:{
      type: String,
      value: ''
    },
    isReadon:{
      type: Boolean,
      value: false
    },
    type:{
      type:String,
      value:'text'
    },
    placeholder:{
      type: String,
      value: ''
    },
    labelStyle:{
      type: String,
      value: ''
    },
    inputStyle:{
      type: String,
      value: ''
    },
    itemStyle:{
      type: String,
      value: ''
    },
    isPicker:{
      type:Boolean,
      value:false
    },
    key:{
      type:String,
      value:""
    },
    array:{
      type:Array,
      value:[]
    },
    index:{
      type:Number,
      value:0
    },
    isTimePicker:{
      type:Boolean,
      value:false
    },
    date:{
      type:String,
      value:''
    },
    endDate:{
      type: String,
      value: ''
    },
    startDate:{
      type: String,
      value: ''
    },
    dateType:{
      type:String,
      value:'date'
    },
    placeStyle:{
      type: String,
      value: ""
    },
    fields:{
      type: String,
      value: 'day'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index:0,
    date:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      const { value = '' } = event.detail || {};
      this.setData({ value }, () => {
        this.emitChange(value);
      });
    },
    onBlur(e){
      this.triggerEvent('blur', e.detail);
    },
    onFocus(e) {
      this.triggerEvent('focus', e.detail);
    },
    onTap(e){
      this.triggerEvent('tap', e.detail);
    },
    change(e){
      console.log(e)
      this.setData({
        index:e.detail.value
      })
      this.triggerEvent('change', e.detail);
    },
    changeTime(e){
      this.setData({
        date: e.detail.value
      })
      this.triggerEvent('change', e.detail);
    },
    emitChange(value) {
      this.triggerEvent('input', value);
      this.triggerEvent('change', value);
    }
  }
})
