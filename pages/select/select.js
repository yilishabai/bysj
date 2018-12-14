// pages/select/select.js
// 当页面跳转时把已选择的词库写入数据库
// 然后跳一个提示框1秒提示数据已写入
const app = getApp()
var data = require("../data/data.js");
var interaction = require("../../utils/interaction.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dictionaries: [],
    selected: {}
  },
  checkboxChange: function(e){
    var id = e.target.dataset.index;
    var selected = e.target.dataset.checks ? false : true;
    console.log(id);
    console.log(selected)
    data.dictionaries[id].selected=selected;
    if(selected){
      this.setData({
        dictionaries: data.dictionaries,
        selected: data.dictionaries[id]
      })
      this.sendSelected().then(res => {
        wx.showToast({
          title: '存入数据库成功！',
          icon: 'succes',
          duration: 1000,
          mask: true
        })
      })
    } else {
      this.setData({
        selected: {}
      })    
    }

  },
  changetoIndex: function(e){
    var length = 0;
    var value;
    for (value of data.dictionaries) {
      if (value.selected) {
        length++
      }
    }
    console.log('你点击了复习')
    wx.redirectTo({
      url: '../myindex/myindex?selected=' + length
    })
  },
  changetoSetting: function (e) {
    var selected =0;
    var value;
    for(value of data.dictionaries){
      if(value.selected){
        selected++
      }
    }
    console.log('你点击了用户设置')
    wx.redirectTo({
      url: "../setting/setting?selected=" + selected
    })
  },
  sendSelected: function(){
    var that = this
    var data = {
      user: app.globalData.userInfo,
      book: that.data.selected
    }
    var p = interaction.sendSelected(data)
    return p;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('你打开了词库选择')
    if(data.dictionaries.length==0){
      //需要请求已选词库
      wx.request({
        url: 'http://localhost:8080/words/getBooks',
        data: app.globalData.userInfo,
        // header:{
        //   "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
        // },
        method: 'GET',
        success(res) {
          console.log(res.data)
          data.dictionaries = res.data;
          that.setData({
            dictionaries: res.data
          })
        }
      })
    } else {
      this.setData({
        dictionaries: data.dictionaries
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
    var that = this
    if(this.data.selected.id){//如果选择
      app.globalData.userInfo.bookNum = selected;
    }
    else {
      console.log("您未选择")
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