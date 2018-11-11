// pages/myindex/myindex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      name:"123"
    },
    word:{
      name:"hello",
      IPA:"英 [hə'ləʊ] 美 [həˈloʊ]",
      means: "int.打招呼;哈喽，喂;你好，您好;表示问候\n\
      n.“喂”的招呼声或问候声\nvi.喊“喂”",
      uses: "Hello John, how are you?\n哈罗，约翰，你好吗？",
    },
    haslexicon:false,
    clicked:false,
    lastnum:40,
    msg:"请把英文发音和中文意思说出口\n（点击屏幕显示答案）",
    msgtxt:"点击添加新的单词到你的词汇表"
  },
  handleTap: function(event){
    // this.setData({
    //   msgtxt:"你点击了！"
    // })
    console.log('你点击了message的块')
    if(!this.data.haslexicon){
      wx.redirectTo({
        url: "../select/select"
      })
    } else if (!this.data.clicked){
      this.setData({
        clicked: true
      })
    }
  },
  changetoSetting: function(e){
    console.log('你点击了用户设置')
    wx.redirectTo({
      url: "../setting/setting"
    })  
  },
  btnHandle: function(e){
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
    if(options.selected>0){
      console.log('获得的参数：'+options.selected)
      this.setData({
        haslexicon: true
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