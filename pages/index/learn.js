//获取应用实例
const app = getApp()

var data = require("../data/data.js");
var interaction = require("../../utils/interaction.js");
var queue = require("../../utils/priorityQueue.js");

var changeModel = function (content) {
  console.log('你进入了学习模式')
  wx.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#3e88a1',
  })
  content.setData({
    NowModel: 2,
    motto: content.data.word.name + '\n 英 [' + content.data.word.ipa + ']',
    contentText: {
      ct1: "请把英文发音和中文解释说出口",
      ct2: "点击屏幕显示答案"
    },
    footer_left: '剩余单词 ' + content.data.lastnum,
    iconName: {
      r: 'shezhi',
      l: 'fuxi',
    },
    footer_right: '设置',
  })
  if (app.globalData.userInfo.bookNum > 0 || content.data.selected.size > 0) {//如果有选书
    new Promise((resolve, reject) => {
      if (!queue.isEmpty() || data.signInFlg) { //如果已获取单词或者已签到
          resolve();
      }
      else 
        interaction.getWords()//获取单词
        .then(res => {
          queue.create(res);
          resolve();
        })
    })
    .then(res => {
      if (!queue.isEmpty()) {//获取单词成功
        console.log(queue.size())
        if(typeof(queue.nowElement)=='undefined'){
          queue.nowElement = queue.dequeue();
          queue.nowElement.element.count ++ ;
        }
        content.setData({
          haslexicon: true,
          word: queue.nowElement.element,
          lastnum: queue.size() + 1,
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
          word: {
            name :app.globalData.userInfo.nickName
          },//清空word
          clicked: false,//遮盖
          lastnum: 0,//清空剩余单词值
          footer_left: '剩余单词 0',
          contentText:{
            ct1: "恭喜你，已经背完今天的所有单词！"
          }//提示
        })
      }
    })
  } else {
    console.log('你还没选词！')
  }
}

var showAnswer = function(content){
  if(!data.signInFlg)
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
    queue.nowElement.element.rightcount ++;
    if(queue.nowElement.priority < 3)
      queue.nowElement.priority=3;  //减少出现次数
    else 
      queue.nowElement.priority+=1;
  } else {
    console.log('你点了不认识')
    if(queue.nowElement.priority <=1)
      queue.nowElement.priority=1;  //增加出现次数
  }
  if (queue.nowElement.priority < 5 && queue.nowElement.element.count < 8) {//如果优先级小于4且出现次数小于8
    queue.enqueue(queue.nowElement.element, queue.nowElement.priority)//再入队
  } else {//出队
    var quality = 8-queue.nowElement.element.count;
    if(quality < 1)
     quality = 1;
    queue.nowElement.element.rightrate = queue.nowElement.element.rightcount / queue.nowElement.element.count
    queue.nowElement.element.quality = quality;
    data.learned.push(queue.nowElement.element);
  }  
  queue.print()
  queue.nowElement = queue.dequeue();

  var myshiftword;
  if (typeof (queue.nowElement) != "undefined"){
    queue.nowElement.element.count++;
    myshiftword = queue.nowElement.element;
  }
  if (typeof (myshiftword) != "undefined") {//如果没有背完所有单词
    content.setData({
      word: myshiftword,//把取出来的单词存入word
      clicked: false,//遮盖答案
      lastnum: queue.size() + 1//修改剩余单词值
    })
    content.setData({
      motto: content.data.word.name + '\n 英 [' + content.data.word.ipa + ']',
      footer_left: '剩余单词 ' + content.data.lastnum,
    })
  } else {//背完所有单词
    console.log('leaned！')
    content.setData({
      word: {
        name: app.globalData.userInfo.nickName
      },//清空word
      clicked: false,//遮盖
      lastnum: 0,//清空剩余单词值
      footer_left: '剩余单词 0',
      contentText: {
        ct1: "恭喜你，已经背完今天的所有单词！"
      }//提示
    })
    console.log(data.learned);
    interaction.sendLearnedWords();
    data.signInFlg = true;
  }
  // console.log(e)
}

var saveLearned = function(content){
  // if (!data.signInFlg) {
  //   // queue.enqueue(queueElement.element,queueElement.priority);
  // }
}

module.exports = {
  changeModel: changeModel,
  showAnswer: showAnswer,
  btnHandle: btnHandle,
  saveLearned: saveLearned,
}