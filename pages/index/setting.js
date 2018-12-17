//获取应用实例
const app = getApp()
var interaction = require("../../utils/interaction.js");

var changeModel = function(content){
  console.log('你打开了用户设置')
  content.setData({
    NowModel: 4,
    motto: content.data.user.nickName,
    footer_left: '背单词',
    footer_right: '词库',
  })
  content.setData({
    learnedNum: app.globalData.userInfo.learned,
    dayNum: app.globalData.userInfo.dayNum,
    wordNum: app.globalData.userInfo.wordNum,
    dictionarys: app.globalData.userInfo.bookNum,
  })
  interaction.getSignInCount().then(res => {
    content.setData({
      signInDate: res
    })
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
  }
}

module.exports = {
  changeModel: changeModel,
  inputHandle: inputHandle,
  sendDayNum: sendDayNum,
}