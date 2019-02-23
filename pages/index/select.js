//获取应用实例
const app = getApp()
var data = require("../data/data.js");
var interaction = require("../../utils/interaction.js");

var changeModel = function(content){
  console.log('你点击了词库选择')
  wx.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#36b69d',
  })
  content.setData({
    NowModel: 3,
    motto: '选择词库',
    footer_left: '背单词',
    iconName: {
      r: 'shezhi',
      l: 'fuxi',
    },
    footer_right: '设置',
  })
  if (data.dictionaries.length == 0) {
    interaction.getDictionaries().then(res => {
      console.log(res)
      data.dictionaries = res;
      content.setData({
        dictionaries: res
      })
    })
  } else {
    content.setData({
      dictionaries: data.dictionaries
    })
  }
}

var sendSelected = function (content) {
  var data = {
    user: app.globalData.userInfo,
    book: content.data.selected
  }
  var p = interaction.sendSelected(data)
  return p;
}

var checkboxChange = function(e,content) {
  var id = e.target.dataset.index;
  var selected = e.target.dataset.checks ? false : true;
  console.log(id);
  console.log(selected)
  data.dictionaries[id].selected = selected;
  if (selected) {
    content.setData({
      dictionaries: data.dictionaries,
      selected: data.dictionaries[id]
    })
    sendSelected(content).then(res => {
      wx.showToast({
        title: '存入数据库成功！',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    })
  } else {
    content.setData({
      selected: {}
    })
  }

}

module.exports = {
  changeModel: changeModel,
  checkboxChange: checkboxChange,
}