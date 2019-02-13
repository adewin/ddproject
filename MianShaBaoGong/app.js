
App({
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
    this.globalData.corpId = options.query.corpId;
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },

  globalData: {
    corpId: '',
    //47  测试
    // appKey: 'dingbwodlbjht6ipcxkf',
    // appSecret: 'wivLuIEoP6mk4Vc_mIsjqlMgjGe8MQPp1zhL2sR1fcNoH8FrSbYHY7lWg7ox1TSH'
    //101 正式
    appKey:'dingvpnfdymb0b5yekh1',
    appSecret:'EJ-oDAWmRbPkwKnwUMTKQKZUTBSXKoQJ15XwaNnN_1sEupJctZdCYEFStcU2ovch'
  },


});
