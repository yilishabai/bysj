const app = getApp()

var hasUserInfo = () => {
  return !(Object.keys(app.globalData.userInfo).length == 0);
}

var getUserLoginInfo = function (container) {
  return new Promise((resolve, reject) => {
    if (app.globalData.userInfo.nickName) {
      container.setData({
        user: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("app has userInfo!")
      resolve();
    } else if (container.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        container.setData({
          user: res.userInfo,
          hasUserInfo: true
        })
        resolve();
      }
      console.log("use userInfoReadyCallback get userInfo!")
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          container.setData({
            user: res.userInfo,
            hasUserInfo: true
          })
          console.log("use wx.getuserinfo ok!")
          resolve();
        }
      })
    }
    if (container.data.hasUserInfo) {
      console.log("get login info ok!")
      console.log(container.data.user)
    }
  })
}
var getUserOpenid = function () {
  var promise = () => {
    return new Promise((resovle, reject) => {
      wx.login({
        //获取code
        success: function (res) {
          var code = res.code; //返回code
          resovle(code);
        }
      })
    })
  }
  var promise1 = (code) => {
    return new Promise((resovle, reject) => {
      var appId = 'wxee05247bc3763d94';
      var secret = 'edc926f5bf46b7dec470ed3d787061c0';
      wx.request({
        url: 'http://localhost:8080/user/Login?code=' + code,
        data: {},
        success: function (res) {
          var openid = res.data.openid //返回openid
          app.globalData.userInfo.openid = openid
          console.log('get openid ok!openid为' + openid);
          console.log(res)
          resovle();
        }
      })
      
    })
  }
  var p = promise().then(res => {
    console.log(res);
    return promise1(res);
  })
  return p
}
var getUserAllInfo = function (container) {
  var p = getUserLoginInfo(container).then(res => {
    return getUserOpenid();
  })
  return p
}

module.exports = {
  hasUserInfo: hasUserInfo,
  getUserOpenid: getUserOpenid,
  getUserAllInfo: getUserAllInfo,
}