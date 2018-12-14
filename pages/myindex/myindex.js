//index.js
//获取应用实例
const app = getApp()
var data = require("../data/data.js");
var USER = require("../../utils/user.js");
var interaction = require("../../utils/interaction.js");
// pages/myindex/myindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: null,
    //单词信息（伪）
    word:null,
    //是否选择词库
    haslexicon:false,
    //是否点击显示答案
    clicked:false,
    //剩余单词数
    lastnum:40,
    //中间的提示
    msg:"请把英文发音和中文意思说出口\n（点击屏幕显示答案）",
    msgtxt:"点击添加新的单词到你的词汇表"
  },
  //点击class=message块
  handleTap: function(event){
    console.log('你点击了message的块')
    if(!this.data.haslexicon){
      // 未选择词库点击->应跳转到词库
      wx.redirectTo({
        url: "../select/select"
      })
    } else if (!this.data.clicked && this.data.lastnum>0){
      // 已选择词库点击->显示单词信息
      this.setData({
        clicked: true
      })
    } else {
      console.log(data.learned);
    }
  },
  //跳转到设置
  changetoSetting: function(e){
    if (this.data.hasUserInfo || !this.data.canIUse){//如果已登录
      //跳转到设置页面
      console.log('你点击了用户设置')
      wx.redirectTo({
        url: "../setting/setting"
      }) 
    } else {//未登录
      wx.showToast({
        title: '请先登录！',
        icon: 'none',
        duration: 1000,
        mask: true
      }) 
    }
 
  },
  //处理认识/不认识按钮
  btnHandle: function(e){
    //认识/不认识按钮处理
    if (e.currentTarget.dataset.know){
      console.log('你点了认识')
      data.learned.push(this.data.word)
    } else {
      console.log('你点了不认识')
      data.words.push(this.data.word);
    }
    var myshiftword = data.words.shift();
    console.log(data.words);
    if (typeof (myshiftword) != "undefined"){//如果没有背完所有单词
      this.setData({
        word: myshiftword,//把取出来的单词存入word
        clicked: false,//遮盖答案
        lastnum: data.words.length+1//修改剩余单词值
      })
    } else {//背完所有单词
      this.setData({
        word:{
          name:app.globalData.userInfo.nickName,
          ipa: ""
        },//清空word
        clicked: false,//遮盖
        lastnum: 0,//清空剩余单词值
        msg: "恭喜你，已经背完今天的所有单词！"//提示
      })
      interaction.sendLearnedWords();
    }
    // console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('你打开了小程序首页')
    //打开小程序
    //第一次登陆显示授权按钮
    if (!this.data.hasUserInfo && !app.globalData.userInfo.id)//未登录
    {
      console.log('新打开')
      //获取用户所有信息
      USER.getUserAllInfo(this).then(res => {
        console.log(app.globalData.userInfo)
        return interaction.postUserInfo();//发送
      }).then(res => {
        if (app.globalData.userInfo.bookNum > 0) {//如果有选书
          return interaction.getWords()//获取单词
        }
        else {
          return null;
        }
      }).then(res => {
        console.log(data.words.length)
        if (data.words.length > 0) {//获取单词成功
          that.setData({
            haslexicon: true,
            word: data.words.shift(),
            lastnum: data.words.length + 1,
          })
        } else {
         data.signInFlg = true
          console.log("set signinFlg = true");
          this.setData({
            haslexicon: true,
            word: {
              name: app.globalData.userInfo.nickName,
              ipa: ""
            },//清空word
            clicked: false,//遮盖
            lastnum: 0,//清空剩余单词值
            msg: "恭喜你，已经背完今天的所有单词！"//提示
          })
        }
      })
    } else {//小程序内切换页面不重新获取发送
      console.log('页面内跳转')     
      this.setData({
        haslexicon: data.signInFlg,
        user: app.globalData.userInfo,
        hasUserInfo: USER.hasUserInfo()
      })//添加用户基本信息到本页面
    }
    // console.log(app.globalData.userInfo )
    if (options.selected > 0 && data.words.length == 0) {//如果有选择词库且未获取     
      console.log('获得的参数：' + options.selected)
      interaction.getWords().then(res =>{
        console.log("已获取单词？")
        that.setData({
          word:data.words.shift(),
          lastnum:data.words.length+1,
          haslexicon: true//同步页面数据
        })
      })
    } else if(data.words.length>0){//已获取词库在程序内跳转不重新请求
      that.setData({
        word: data.words.shift(),
        lastnum: data.words.length + 1,
        haslexicon: true//同步页面数据
      })
    } 
    console.log(data.signInFlg)
    if ((data.learned.length > 1 && data.words.length == 0 )|| data.signInFlg){//如果已背完今日所有单词
      this.setData({
        word: {
          name: app.globalData.userInfo.nickName,
          ipa: ""
        },//清空word
        clicked: false,//遮盖
        lastnum: 0,//清空剩余单词值
        msg: "恭喜你，已经背完今天的所有单词！"//提示
      })
      data.signInFlg = true
    }
  },
  //处理按钮获授权获取用户信息
  getUserInfo: function (e) {
    var that = this
    //按钮获取登录信息
    console.log("button get userInfo ok!")
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      user: e.detail.userInfo,
      hasUserInfo: true
    })
    USER.getUserOpenid().then(res => {
      interaction.postUserInfo();//发送
    })
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
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!data.signInFlg){
      data.words.unshift(this.data.word);
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