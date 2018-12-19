//获取应用实例
const app = getApp()
var interaction = require("../../utils/interaction.js");
var data = require("../data/data.js");

var changeModel = function(content){
  console.log('你打开了用户设置')
  content.setData({
    NowModel: 4,
    motto: content.data.user.nickName,
    footer_left: '背单词',
    footer_right: '词库',
  })
  var wordnum = 0;
  if(data.dictionaries.length > 0){
    wordnum = selectedWords();
  } else {
    wordnum = app.globalData.userInfo.wordNum;
  }
  content.setData({
    learnedNum: app.globalData.userInfo.learned,
    dayNum: app.globalData.userInfo.dayNum,
    wordNum: wordnum,
    dictionarys: app.globalData.userInfo.bookNum,
  })
  interaction.getSignInCount().then(res => {
    if (typeof (res) !== 'object'){
      content.setData({
        signInDate: res +1
      })
    } else {
      content.setData({
        signInDate: 0
      })      
    }
  })
}

var inputHandle = function(e,content) {
  console.log('你修改了每日词汇量')
  app.globalData.userInfo.dayNum = e.detail.value;
  content.setData({
    changeDaynum: true
  })
}

var sendDayNum = function (content){
  if (content.data.changeDaynum) {
    interaction.putUserDayNum().then(res => {
      wx.showToast({
        title: '修改单词量成功！',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    })
    content.setData({
      changeDaynum: false
    })
  }
}

var selectedWords = function (){
  var count = 0;
  for (var book of data.dictionaries){
    if(book.selected){
      count += book.size;
    }
  }
  return count;
}

module.exports = {
  changeModel: changeModel,
  inputHandle: inputHandle,
  sendDayNum: sendDayNum,
}