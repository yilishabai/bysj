const app = getApp()
var data = require("../pages/data/data.js");

var post = function(url,datas){
  var p = new Promise((resolve, reject) => {
    wx.request({    //获取的userinfo上传到服务器
      url: url, //仅为示例，并非真实的接口地址
      data: datas,
      method: 'POST',
      success(res) {
        resolve(res.data);
      }
    })
  })
  return p
}
var put = function(url,datas){
  var p = new Promise((resolve, reject) => {
    wx.request({    //获取的userinfo上传到服务器
      url: url, //仅为示例，并非真实的接口地址
      data: datas,
      method: 'PUT',
      success(res) {
        resolve(res.data);
      }
    })
  })
  return p 
}
var myget = function(url,datas){
  var p = new Promise((resolve, reject) => {
    wx.request({    //获取的userinfo上传到服务器
      url: url, //仅为示例，并非真实的接口地址
      data: datas,
      method: 'GET',
      success(res) {
        resolve(res.data);
      }
    })
  })
  return p 
}

//发送用户信息
var postUserInfo = function () {
  console.log('send userInfo')
  var p = post('http://localhost:8080/user',app.globalData.userInfo).then(res => {
    return new Promise((resolve,reject) => {
      console.log(res)
      app.globalData.userInfo.id = res.id;
      app.globalData.userInfo.dayNum = res.dayNum;
      app.globalData.userInfo.bookNum = res.bookNumber;
      app.globalData.userInfo.learned = res.learned;
      app.globalData.userInfo.wordNum = res.wordNumber;
      console.log(app.globalData.userInfo);
      resolve();
    })
  })
  return p
}
//更新用户信息
var putUserDayNum = function() {
  return put('http://localhost:8080/user',app.globalData.userInfo)
}
var putUserWordModel = function () {
  return put('http://localhost:8080/user/changeModel', app.globalData.userInfo)
}

//获取单词
var getWords = function() {
  console.log("获取单词...")
  var promise = myget('http://localhost:8080/words/getDayWords',app.globalData.userInfo).then(res => {
      return new Promise((resolve, reject) => {
        console.log(res);
        if (res != "false")
        // that.setData({
        //   words:res.data
        // })
        resolve(res);
      })
    })
  return promise;
}

//发送已背单词到数据库
var sendLearnedWords = function() {
  var mydata = {
    word: data.learned,
    user: app.globalData.userInfo
  }
  put('http://localhost:8080/words/learned',mydata).then(res => {
      console.log(res)
      wx.showToast({
        title: '今日签到成功！',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
  })
}

var getSignInCount = function(){
  return post('http://localhost:8080/user/SignInCount',app.globalData.userInfo)
}

var sendSelected = function(data){
  return post('http://localhost:8080/words/selectedBooks',data)
}

var getDictionaries = function(){
  return myget('http://localhost:8080/words/getBooks', app.globalData.userInfo)
}

var getWordsBybook = function(bookid){
  return myget('http://localhost:8080/words/getWordsBybook', {id: bookid})
}
var getUserWords = function(userid){
  return myget('http://localhost:8080/words/getSelectWords', {id: userid})
}
module.exports = {
  postUserInfo: postUserInfo,
  putUserDayNum: putUserDayNum,
  putUserWordModel: putUserWordModel,
  getWords: getWords,
  getUserWords: getUserWords,
  getSignInCount: getSignInCount,
  getDictionaries: getDictionaries,
  getWordsBybook: getWordsBybook,
  sendLearnedWords: sendLearnedWords,
  sendSelected: sendSelected,
}