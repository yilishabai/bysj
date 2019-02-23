//logs.js
const app = getApp()
const util = require('../../utils/util.js')
const interaction = require('../../utils/interaction.js')
Page({
  data: {
    logs: [],
    signInDate: 10,
    learnedNum: 215,
    wordNum: 210,
  },
  onLoad: function () { //
    var that = this;
    interaction.getSignInCount().then(res => {
      if (typeof (res) !== 'object') {
        that.setData({
          signInDate: res + 1
        })
      } else {
        that.setData({
          signInDate: 0
        })
      }
    })
    interaction.getUserWords(app.globalData.userInfo.id)
    .then(res => {
      that.setData({
        learnedNum: app.globalData.userInfo.learned,
        dayNum: app.globalData.userInfo.dayNum,
        wordNum: app.globalData.userInfo.wordNum,
        logs: res,
      })
    }
    );
  }
})
