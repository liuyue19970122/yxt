// components/shadow-list/shadow-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shadowList:{
      type:Array,
      value:[]
    },
    cusStyle:{
      type: String,
      value: ""
    },
    itemStyle:{
      type: String,
      value: ""
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
    goTap:function(e){
      // console.log(e)
      var value={
        id: e.currentTarget.dataset.id,
        status: e.currentTarget.dataset.status,
      }
      this.triggerEvent("get", {value:value})
    }
  }
})
