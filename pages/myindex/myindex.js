//index.js
//获取应用实例
const app = getApp()
// pages/myindex/myindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: {},
    //单词信息（伪）
    word:{
      name:"hello",
      IPA:"英 [hə'ləʊ] 美 [həˈloʊ]",
      means: "int.打招呼;哈喽，喂;你好，您好;表示问候\n\
      n.“喂”的招呼声或问候声\nvi.喊“喂”",
      uses: "Hello John, how are you?\n哈罗，约翰，你好吗？",
    },
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
    } else if (!this.data.clicked){
      // 已选择词库点击->显示单词信息
      this.setData({
        clicked: true
      })
    }
  },
  changetoSetting: function(e){
    //跳转到设置页面
    console.log('你点击了用户设置')
    wx.redirectTo({
      url: "../setting/setting"
    })  
  },
  btnHandle: function(e){
    //认识/不认识按钮处理
    if (e.currentTarget.dataset.know){
      console.log('你点了认识')
    } else {
      console.log('你点了不认识')
    }
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('你打开了小程序首页')
    //打开小程序
    if (options.selected > 0) {
      //如果有选择词库
      console.log('获得的参数：' + options.selected)
      this.setData({
        haslexicon: true
      })
    }

    if(!this.data.haslexicon){
      //如果未获取登录信息
      var content = this;
      if (app.globalData.userInfo) {
        this.setData({
          user: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            user: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              user: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
      console.log(this.data.user)
    }
  },
  getUserInfo: function (e) {
    //获取登录信息
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      user: e.detail.userInfo,
      hasUserInfo: true
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