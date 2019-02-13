
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
    // appKey: 'dingxix9d6v2yta5ioql',
    // appSecret: '8kgYJEnKnUWJJOwP0EQE90L7qpSxhW5ps9sm00pqWCcxtvEVc1fdeomuLx7gnJrL'
    //101 正式
     appKey:'dingdcefcez2bzedczuv',
     appSecret:'EF6fdt26VZFAzVE2FfeRLVatlBvDunBgYhHdaHueECRlOTZ11MIKQVJmLz4RyKln'
 
  },


});
