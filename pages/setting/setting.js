// pages/setting/setting.js
const app = getApp()

var interaction = require("../../utils/interaction.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayNum: 0,
    dictionarys:2,
    learnedNum:215,
    wordNum:210,
    changeDayNum:false,
    signInDate: 10
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

    this.setData({
      learnedNum: app.globalData.userInfo.learned,
      dayNum: app.globalData.userInfo.dayNum,
      wordNum: app.globalData.userInfo.wordNum,
      dictionarys: app.globalData.userInfo.bookNum,
    })
    interaction.getSignInCount().then(res => {
      this.setData({
        signInDate: res
      })
    })
    if(options.selected){
      console.log('传入的参数为：')
      console.log(options.selected)
      this.setData({
        dictionarys: app.globalData.userInfo.bookNum,
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
      interaction.putUserDayNum();
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