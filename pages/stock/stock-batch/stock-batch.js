// pages/stock/stock-change/stock-change.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [{
      id: 1,
      name: '新鲜水果',
    }, {
      id: 2,
      name: '粮油副食',
    },],
    goodList: [{
      id: 1,
      name: '精品冬枣5KG/袋',
    },
    {
      id: 2,
      name: '精品冬枣10KG/袋',
    }
    ],
    range: 1,
    activeId: 0,
  },
  clickItem: function (e) {
    this.setData({
      activeId: e.currentTarget.dataset.id
    })
  },
  closeActive: function () {
    this.setData({
      activeId: 0
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})