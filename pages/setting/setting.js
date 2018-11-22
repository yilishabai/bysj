// pages/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayNum: 0,
    dictionarys:2,
    learnedNum:215,
    changeDayNum:false,
  },
  inputHandle: function(e){
    console.log('你修改了每日词汇量')
    app.globalData.userInfo.dayNum = e.detail.value;
    this.setData({
      changeDaynum:true
    })
  },
  changetoSelect: function(e){
    console.log('你点击了选择词库')
    wx.redirectTo({
      url: '../select/select',
    })
  },
  changetoIndex: function (e) {
    console.log('你点击了复习')
    wx.redirectTo({
      url: '../myindex/myindex',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('你打开了用户设置')
    console.log(app.globalData)
    this.setData({
      dayNum: app.globalData.userInfo.dayNum
    })
    if(options.selected){
      console.log('传入的参数为：')
      console.log(options.selected)
      this.setData({
        dictionarys: options.selected,
      })
    }
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
    if(this.data.changeDaynum){
      wx.request({
        url: 'http://localhost:8080/user', //仅为示例，并非真实的接口地址
        data: app.globalData.userInfo,
        method: 'PUT',
        success(res) {
          console.log(res.data)
        }
      })
    }
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