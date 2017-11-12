//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  changeText: function () {
    // this.data.text = 'changed data'  // bad, it can not work
    wx.startRecord({
      success: function (res) {
        console.log(33)
        console.log(res)
      },
      cancel: function () {
        alert('用户拒绝授权录音');
      }
    });
  },
  changeNum: function(){
    wx.stopRecord({
      success: function (res) {
        localId = res.localId;
        // 上传到服务器
        uploadVoice();
      },
      fail: function (res) {
        alert(JSON.stringify(res));
      }
    });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
function uploadVoice() {
  //调用微信的上传录音接口把本地录音先上传到微信的服务器
  //不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
  wx.uploadVoice({
    localId: voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
    isShowProgressTips: 1, // 默认为1，显示进度提示
    success: function (res) {
      //把录音在微信服务器上的id（res.serverId）发送到自己的服务器供下载。
      $.ajax({
        url: '后端处理上传录音的接口',
        type: 'post',
        data: JSON.stringify(res),
        dataType: "json",
        success: function (data) {
          alert('文件已经保存到自己的服务器');
        },
        error: function (xhr, errorType, error) {
          console.log(error);
        }
      });
    }
  });
}