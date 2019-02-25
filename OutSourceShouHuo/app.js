
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
    appKey: 'dinglcwandqg8yxdunjy',
    appSecret: 'NZHlxYY6jtyyDsalXhdWjIAyz8Gu6ql_GtbzScjHc8NJCiZKNtuGPcVvxR5N-5Ag'
    //101 正式
    // appKey:'dingm6xyn2lfebqp7c7i',
    // appSecret:'FLVpAhmMl_GbLbsbGCNCYjWx1IT1ppylZmYJT5PA56H7xJWWN5ihzRZJ0wJ-hPkf'
 
  },


});
