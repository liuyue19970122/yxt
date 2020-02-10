// components/cart/cart.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    empty:{
      type:Boolean,
      required:false,
      value:false
    },
    hideCart:{
      type: Boolean,
      required: false,
      value: true
    },
    count:{
      type:Number,
      required:true,
      value:0
    },
    totalMoney:{
      type:String,
      required:true,
      value:'0'
    },
    favMoney: {
      type: String,
      required: true,
      value: '0'
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
    //结算click事件
    bindToSubmit(e){
      this.triggerEvent('submit', e);
    },
    bindShowCard(e){
      this.triggerEvent('cartClick', e);
    }
  }
})
