//index.js
//获取应用实例
const app = getApp()
var data = require("../data/data.js");
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
        word:{},//清空word
        clicked: false,//遮盖
        lastnum: 0,//清空剩余单词值
        msg: "恭喜你，已经背完今天的所有单词！"//提示
      })
      this.sendLearnedWords();
    }
    // console.log(e)
  },
  //发送已背单词到数据库
  sendLearnedWords: function(){
    wx.request({
      url: 'http://localhost:8080/words/learned', //仅为示例，并非真实的接口地址
      data: {
        word: data.learned,
        user: app.globalData.userInfo
      },
      // header:{
      //   "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      // },
      method: 'PUT',
      success(res) {
        console.log(res.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('你打开了小程序首页')
    //打开小程序
    //第一次登陆显示授权按钮
    if(!this.data.hasUserInfo && !app.globalData.hasUserInfo)//未登录
    {
      console.log('新打开')
      //获取用户所有信息
      that.getUserAllInfo().then(res => {
        that.sendUserinfo();//发送
      })

      app.globalData.hasUserInfo = true;
    } else {//小程序内切换页面不重新获取发送
      console.log('页面内跳转')     
      this.setData({
        user: app.globalData.userInfo,
        hasUserInfo: true
      })//添加用户基本信息到本页面
    }
    if (options.selected > 0 && data.words.length <= 0) {//如果有选择词库且未获取      
      console.log('获得的参数：' + options.selected)  
      that.getWords().then(res =>{
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
    this.getUserOpenid().then(res => {
      that.sendUserinfo();//发送
    })
  },
  //获取用户openid
  getUserOpenid: function() {
    var content = this;
    var promise = () => {
      return new Promise((resovle, reject) => {
        wx.login({
          //获取code
          success: function (res) {
            var code = res.code; //返回code
            resovle(code);
          }
        })
      })
    }
    var promise1 = (code) => {
      return new Promise((resovle, reject) => {
        var appId = 'wxee05247bc3763d94';
        var secret = 'edc926f5bf46b7dec470ed3d787061c0';
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            var openid = res.data.openid //返回openid
            app.globalData.userInfo.openid = openid
            console.log('get openid ok!openid为' + openid);
            // console.log(content.data.user)
            resovle();
          }
        })
      })
    }
    var p = promise().then(res => {
      console.log(res);
      return promise1(res);
    })
    return p
  },
  //获取用户登录基本信息
  getUserLoginInfo: function() {
      return new Promise((resolve,reject) => {
        if (app.globalData.userInfo.nickName) {
          this.setData({
            user: app.globalData.userInfo,
            hasUserInfo: true
          })
          console.log("app has userInfo!")
          resolve();
        } else if (this.data.canIUse) {
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            this.setData({
              user: res.userInfo,
              hasUserInfo: true
            })
            resolve();
          }
          console.log("use userInfoReadyCallback get userInfo!")
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              app.globalData.userInfo = res.userInfo
              this.setData({
                user: res.userInfo,
                hasUserInfo: true
              })
              console.log("use wx.getuserinfo ok!")
              resolve();
            }
          })
        }
        if (this.data.hasUserInfo) {
          console.log("get login info ok!")
          console.log(this.data.user)
          
        }
      })

  },
  //获取用户所有信息
  getUserAllInfo: function() {
    var that = this;
    var p = that.getUserLoginInfo().then(res => {
      return that.getUserOpenid();
    })
    return p
  },
  //发送用户信息
  sendUserinfo: function(){
    console.log('send userInfo')
    //获取的userinfo上传到服务器
    wx.request({
      url: 'http://localhost:8080/user', //仅为示例，并非真实的接口地址
      data: app.globalData.userInfo,
      // header:{
      //   "Content-Type": 'application/x-www-form-urlencoded;charset=utf-8'
      // },
      method: 'POST',
      success(res) {
        console.log(res.data)
        app.globalData.userInfo.id = res.data.id;
        app.globalData.userInfo.dayNum = res.data.dayNum;
        console.log(app.globalData);
      }
    })
  },
  //获取单词
  getWords: function(){
    var that = this
    var promise = new Promise((resolve,reject)=>{
        wx.request({
          url: "http://localhost:8080/words/getDayWords",
          data: app.globalData.userInfo,
          method: 'GET',
          success(res) {
            console.log(res.data);
            data.words = res.data;
            // that.setData({
            //   words:res.data
            // })
            resolve();
          }
        })
      })
   return promise;
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
    if(this.data.haslexicon){
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