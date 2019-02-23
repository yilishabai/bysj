//index.js
//获取应用实例
const app = getApp()
//通用
var data = require("../data/data.js");
var USER = require("../../utils/user.js");
var interaction = require("../../utils/interaction.js");
//选择模式
var selectModel = require("select.js");
//设置模式
var settingModel = require("setting.js");
//学习模式
var learningModel = require("learn.js");
Page({
  data: {
  //通用变量
    //模式选择标志 1-4
    NowModel: 1,
    //顶上的
    motto: '吃瓜背单词',
    //中间的字    
    contentText: "点击添加新的单词到你的词汇表",
    //底部的
    footer_left: '词库',
    iconName: {
      r: 'shezhi',
      l: 'fuxi',
    },
    footer_right: '设置',
    // 用户信息
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    user: null,
  //学习模式相关
    //按钮
    btnleft: '认识',
    btnright: '不认识',
    //显示答案标志
    clicked: false,
    //剩余单词数
    lastnum: 40,
    //单词信息
    word: {},
  //选词模式相关
    //词典
    dictionaries:[],
    showSearch: false,
    toView: '',
    selected: {},
  //登录模式相关
    //签到标志
    signInFlg: false,
    //是否选择词库
    haslexicon: false,
    //中间的提示
    msg: "请把英文发音和中文意思说出口\n（点击屏幕显示答案）",
  //设置模式相关
    selectWordModel: '顺序模式',
    dayNum: 0,
    dictionarys: 2,
    learnedNum: 215,
    wordNum: 210,
    changeDayNum: false,
    signInDate: 10
  },
  //切换模式事件处理函数
  bindViewTap: function(e) {
    console.log(e);
    var that = this;
    var model = e.currentTarget.dataset.model
    var id = e.currentTarget.id
    switch (model){
      case 1:
        if (that.data.hasUserInfo){
          if (id === 'leftfoot') {
            that.modelChange(3)
          } else {
            that.modelChange(4)
          }
        } else {
          wx.showLoading({
            title: '请授权登录！',
            duration: 1000,
            mask: true
          })
        }
      break;
      case 2:
        learningModel.saveLearned(that);
        if (id === 'leftfoot') {
          //剩余单词
        } else {
          that.modelChange(4)
        }
      break;
      case 3:
        if (id === 'leftfoot') {
          that.modelChange(2)
        } else {
          that.modelChange(4)
        }
      break;
      case 4:
        settingModel.sendDayNum(that);
        if (id === 'leftfoot') {
          that.modelChange(1)
        } else {
          that.modelChange(3)
        }
      break;
    }
  },
  onLoad: function () {
    var that = this;
    //第一次登陆显示授权按钮
    if (!this.data.hasUserInfo && !app.globalData.userInfo.id)//未登录
    {
      console.log('新打开')
      //获取用户所有信息
      USER.getUserAllInfo(this).then(res => {
        console.log(that.data.user)
        that.modelChange(that.data.NowModel)
        console.log(app.globalData.userInfo)
        return interaction.postUserInfo();//发送
      }).then(res => {
        if (app.globalData.userInfo.bookNum > 0) {//如果有选书
          that.modelChange(2);
        }
      })
    }
  },
  modelChange: function (model) {
    var that = this;
    switch(model){
      case 1: 
        var name = '欢迎，' + that.data.user.nickName
        if (app.globalData.userInfo.bookNum > 0 || that.data.selected.size > 0) {//如果有选书
          that.modelChange(2);
        } else {
          that.setData({
            NowModel: 1,
            motto: name,
            contentText: "点击添加新的单词到你的词汇表",
            footer_left: '词库',
            iconName: {
              r: 'shezhi',
              l: 'xuanci',
            },
            footer_right: '设置',
          })
        }
      break;
      case 2:
        learningModel.changeModel(that);
      break;
      case 3:
        selectModel.changeModel(that);
      break;
      case 4:
        settingModel.changeModel(that);
      break;
    }
  },
  getUserInfo: function(e) {
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
  //选词模式相关
  scrollfindwords: function(e) {
    if (e.detail.scrollTop!=0){
      this.setData({
        showSearch: true,
      })
    }
  },
  scrollTotop: function(e) {
    console.log('to top')
    for(var item of data.dictionaries){
      item.cansee = false;
    }
    this.setData({
      showSearch: false,
      dictionaries: data.dictionaries
    })
  },
  searchTo: function(e) {
    var find = e.detail.value;
    this.setData({
      toView: find
    })
  },
  checkboxChange: function(e){
    // console.log(e)
   selectModel.checkboxChange(e,this);
  },
  shwords: function(e){
    var that = this;
    var id = e.target.dataset.index;
    var canshow = data.dictionaries[id].cansee ? false : true;
    if (canshow && data.dictionaries[id].list==null){
      interaction.getWordsBybook(id + 1).then(res => {
        console.log(res)
        data.dictionaries[id].list = res
        data.dictionaries[id].cansee = canshow
        this.setData({
          dictionaries: data.dictionaries,
        })
      })
    } else {
      data.dictionaries[id].cansee = canshow
      this.setData({
        dictionaries: data.dictionaries
      })
    }   

  },
  //设置模式相关
  inputHandle: function(e){
    settingModel.inputHandle(e,this);
  },
  changetoSelect: function(){
    settingModel.sendDayNum(this);
    this.modelChange(3);
  },
  changeSelectModel: function(e){
    var nowModel = this.data.selectWordModel==='顺序模式'?'随机模式':'顺序模式'
    var flg = nowModel==='顺序模式'?false:true;
    settingModel.sendChangeModel(this,flg);
  },
  gotoTable: function(e){
    wx.navigateTo({
      url: '../logs/logs',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //学习模式相关
  answerHandle: function(e){
    learningModel.showAnswer(this);
  },
  btnHandle: function(e){
    learningModel.btnHandle(e,this);
  }

})
