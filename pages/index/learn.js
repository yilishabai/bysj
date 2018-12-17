//获取应用实例
const app = getApp()

var data = require("../data/data.js");
var interaction = require("../../utils/interaction.js");

var changeModel = function (content) {
  console.log('你进入了学习模式')
  content.setData({
    NowModel: 2,
    motto: content.data.word.name + '\n' + content.data.word.ipa,
    contentText: "请把英文发音和中文意思说出口\n（点击屏幕显示答案）",
    footer_left: '剩余单词 ' + content.data.lastnum,
    footer_right: '设置',
  })
  if (app.globalData.userInfo.bookNum > 0) {//如果有选书
    new Promise((resolve, reject) => {
      if (data.words.length > 0 || content.data.signInFlg) { //如果已获取单词或者已签到
          resolve();
      }
      else 
        interaction.getWords()//获取单词
        .then(res => {
          resolve();
        })
    })
    .then(res => {
      console.log(data.words.length)
      if (data.words.length > 0) {//获取单词成功
        content.setData({
          haslexicon: true,
          word: data.words.shift(),
          lastnum: data.words.length + 1,
        })
        content.setData({
          motto: content.data.word.name + '\n' + content.data.word.ipa,
          footer_left: '剩余单词 ' + content.data.lastnum,
        })
        console.log(content.data.word)
      } else {
        data.signInFlg = true
        console.log("set signinFlg = true");
        content.setData({
          haslexicon: true,
          motto: app.globalData.userInfo.nickName,//清空word
          clicked: false,//遮盖
          lastnum: 0,//清空剩余单词值
          footer_left: '剩余单词 0',
          contentText: "恭喜你，已经背完今天的所有单词！"//提示
        })
      }
    })
  } else {
    console.log('你还没选词！')
  }
}

var showAnswer = function(content){
  if(!content.data.signInFlg)
  {
    content.setData({
     clicked: !content.data.clicked,
    })
  }
}

//处理认识/不认识按钮
var btnHandle = function(e,content) {
  //认识/不认识按钮处理
  if (e.currentTarget.dataset.know) {
    console.log('你点了认识')
    data.learned.push(content.data.word)
  } else {
    console.log('你点了不认识')
    data.words.push(content.data.word);
  }
  var myshiftword = data.words.shift();
  console.log(data.words);
  if (typeof (myshiftword) != "undefined") {//如果没有背完所有单词
    content.setData({
      word: myshiftword,//把取出来的单词存入word
      clicked: false,//遮盖答案
      lastnum: data.words.length + 1//修改剩余单词值
    })
    content.setData({
      motto: content.data.word.name + '\n' + content.data.word.ipa,
      footer_left: '剩余单词 ' + content.data.lastnum,
    })
  } else {//背完所有单词
    content.setData({
      motto: app.globalData.userInfo.nickName,//清空word
      clicked: false,//遮盖
      lastnum: 0,//清空剩余单词值
      footer_left: '剩余单词 ' + content.data.lastnum,
      contentText: "恭喜你，已经背完今天的所有单词！"//提示
    })
    interaction.sendLearnedWords();
    data.signInFlg = true;
  }
  // console.log(e)
}

var saveLearned = function(content){
  if (!data.signInFlg) {
    data.words.unshift(content.data.word);
  }
}

module.exports = {
  changeModel: changeModel,
  showAnswer: showAnswer,
  btnHandle: btnHandle,
  saveLearned: saveLearned,
}