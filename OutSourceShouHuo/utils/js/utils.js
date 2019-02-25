
function GetUrl() {
    // return 'http://101.37.27.118:6060'
     return 'http://192.168.1.111:19433'
    // return 'http://47.92.34.191:8888/'
}

function GetAccessToken(callback) {
    //获取access_token
    var access_tokenStr = api.getPrefs({
        sync: true,
        key: 'access_token'
    });
    //if (!access_tokenStr) {
    //console.log('1111');
        return GetAccessTokenFromServer(callback);
    //}
    var access_token = JSON.parse(access_tokenStr);
    if (!access_token.access_token || new Date(access_token.expiredate) < new Date()) {
        api.removePrefs({
            key: 'access_token'

        });
        // console.log('2222');
        return GetAccessTokenFromServer(callback);
    } else {
        callback(access_token.access_token);
    }
}


function GetAccessTokenFromServer(callback) {
    var clientId = "hzsoftApp";
    var clientSecret = "D4136zpODMa9xvVtBmtcxH5iKMJLTS7s"
    var signature = api.require("signature");
    var access_token='';
    signature.base64({
        data: clientId + ':' + clientSecret
    }, function(ret, err) {
        if (ret.status) {
            var auth = ret.value;
            api.ajax({
                url: GetUrl() + '/token',
                method: 'post',
                headers: {
                    Authorization: 'Basic ' + auth
                },
                data: {
                    values: {
                        grant_type: 'client_credentials'
                    }
                }
            }, function(ret, err) {
                if (ret) {
                    //alert( JSON.stringify( ret ) );
                    var now = new Date();
                    var expiredate = now.setSeconds(now.getSeconds() + ret.expires_in);
                    ret.expiredate = expiredate;
                    var access_tokenStr = JSON.stringify(ret);
                    //alert(access_tokenStr);
                    api.setPrefs({
                        key: 'access_token',
                        value: access_tokenStr
                    });
                    callback(ret.access_token);
                } else {
                    HidePro();
                    alert(JSON.stringify(err));
                }
            });

        } else {
            alert(JSON.stringify(err));
        }
    });
    return access_token;
}

function ShowPro(){
  api.showProgress({
    style: 'default',
    animationType: 'fade',
    title: '努力加载中...',
    text: '先喝杯茶...',
    modal: true
  });
}
function HidePro(){
  api.hideProgress();
}

function GetNow(){
  var now = new Date();
  var month = now.getMonth() + 1;
  return now.getFullYear() + "-" + month + "-" + now.getDate();
}
// function addDate(date, days) {
//     if (days == undefined || days == '') {
//         days = 1;
//     }
//     var date = new Date(date);
//     date.setDate(date.getDate() + days);
//     var month = date.getMonth() + 1;
//     var day = date.getDate();
//     return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
// }

function checkUpdate() {
  var mam = api.require('mam');
  mam.checkUpdate(function(ret, err) {
      if (ret) {
          var result = ret.result;
          if (result.update == true && result.closed == false) {
              var str = '新版本型号:' + result.version + ';发布时间:' + result.time;
              api.confirm({
                  title : '有新的版本,请下载并安装 ',
                  msg : str,
                  buttons : ['确定', '取消']
              }, function(ret, err) {
                  if (ret.buttonIndex == 1) {
                      if (api.systemType == "android") {
                          api.download({
                              url : result.source,
                              report : true
                          }, function(ret, err) {
                              if (ret && 0 == ret.state) {/* 下载进度 */
                                  api.toast({
                                      msg : "正在下载应用" + ret.percent + "%",
                                      duration : 2000
                                  });
                              }
                              if (ret && 1 == ret.state) {/* 下载完成 */
                                  var savePath = ret.savePath;
                                  api.installApp({
                                      appUri : savePath
                                  });
                              }
                          });
                      }
                      if (api.systemType == "ios") {
                          api.installApp({
                              appUri : result.source
                          });
                      }
                  }
              });
          } else {
              // api.alert({
              //     msg : "暂无更新"
              // });
          }
      } else {
          api.alert({
              msg : '版本检查失败：'+err.msg
          });
      }
  });
}
