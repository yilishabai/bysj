// pages/select/select.js
// 当页面跳转时把已选择的词库写入数据库
// 然后跳一个提示框1秒提示数据已写入
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dictionaries: [
      { name: '大学英语四级词汇1', size: '5000' },
      { name: '大学英语四级词汇2', size: '5000' },
      { name: '大学英语四级词汇3', size: '5000' },
      { name: '大学英语四级词汇4', size: '5000' },
      { name: '大学英语四级词汇5', size: '5000' },
      { name: '大学英语四级词汇6', size: '5000' },
      { name: '大学英语四级词汇7', size: '5000' },
      { name: '大学英语四级词汇8', size: '5000' },
      { name: '大学英语四级词汇9', size: '5000' },
      { name: '大学英语四级词汇10', size: '5000' },
      { name: '大学英语四级词汇11', size: '5000' },
      { name: '大学英语四级词汇12', size: '5000' },
      { name: '大学英语四级词汇13', size: '5000' },
      { name: '大学英语四级词汇14', size: '5000' },
      { name: '大学英语四级词汇15', size: '5000' },
    ],
    selected: []
  },
  checkboxChange: function(e){
    this.setData({
      selected:e.detail.value
    })
    console.log('你选择了:'+e.detail.value)
  },
  changetoIndex: function(e){
    var length=this.data.selected.length
    console.log('你点击了复习')
    wx.redirectTo({
      url: '../myindex/myindex?selected=' + length
    })
  },
  changetoSetting: function (e) {
    console.log('你点击了用户设置')
    wx.redirectTo({
      url: "../setting/setting"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('你打开了词库选择')
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
    wx.showToast({
      title: '存入数据库成功！',
      icon: 'succes',
      duration: 1000,
      mask: true
    }) 
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.showToast({
      title: '存入数据库成功！',
      icon: 'succes',
      duration: 1000,
      mask: true
    }) 
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