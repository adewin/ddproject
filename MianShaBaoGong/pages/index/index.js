
const app = getApp();


//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
// let domain = "http://192.198.1.111:19433";
// let domain = "http://47.92.34.191:8888";
let domain = "http://101.37.27.118:6060";
let url = domain + '/login/GetUserInfo';




Page({

  data: {
    corpId: '',
    authCode: '',
    userId: '',//钉订userid
    userName: '',
    hideList: true,
    systemId: '',//系统人员Id
    qtyValue: '',

    swipeIndex: null,
    right: [{ type: 'delete', text: '删除' }],
    list: [
      // { right: [{ type: 'delete', text: '删除' }], content: 'AAA' },
      // { right: [{ type: 'edit', text: '取消收藏' }, { type: 'delete', text: '删除' }], content: 'BBB' },
      // { right: [{ type: 'delete', text: '删除' }], content: 'CCC' },
    ],

    items: [
      // {
      //   title: '双行列表',
      //   brief: '描述信息',
      //   arrow: true,
      // },

    ],

    categoryArray: [],//分类数组
    goodsArray: [],//品名数组
    categoryIndex: 0,
    goodsIndex: 0

  },

  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    let _this = this;
    this.loginSystem();
    this.setData({
      corpId: app.globalData.corpId
    });



  },



  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },

  handleTap() {
    console.log('yo! view tap!')
  },

  changeText() {
    this.setData({
      title: 'DingDing'
    })
  },


  loginSystem() {
    dd.showLoading();
    dd.getAuthCode({
      success: (res) => {
        this.setData({
          authCode: res.authCode
        })
        //dd.alert({content: "step1"});
        dd.httpRequest({
          url: url,
          method: 'get',
          dataType: 'jsonp',
          jsonpCallback: "callback",
          data: {
            authCode: res.authCode,
            appKey:app.globalData.appKey,
            appSecret:app.globalData.appSecret
          },
          success: (res) => {
            // dd.alert({content: "step2"});
            console.log('success1----', res);
            let resdata = JSON.parse(res.data);
            console.log('success2----', resdata);
            let userId = resdata.userid;
            let userName = resdata.name;
            let systemId = resdata.systemId;
            // if(userId!=""){
            this.getCategory(resdata.userid);
            // };
            this.setData({
              userId: userId,
              userName: userName,
              hideList: false,
              systemId: systemId
            });

          },
          fail: (res) => {
            console.log("loginSystem_httpRequestFail---", res)
            dd.alert({ content: JSON.stringify(res) });
          },
          complete: (res) => {
            dd.hideLoading();
          }

        });
      },
      fail: (err) => {
        // dd.alert({content: "step3"});
        dd.alert({
          content: JSON.stringify(err)
        })
      }
    })

  },

  //类别点击事件
  getCategory(userId) {
    console.log("getCategory_userId---", JSON.stringify(userId));
    dd.httpRequest({
      url: domain + "/DingTalkManage/CottonYarn/GetCategoryList",
      method: 'get',
      data: {
        "queryJson": JSON.stringify({ "dingId": userId })
      },
      dataType: 'jsonp',
      success: (res) => {
        // dd.alert({content: "step2"});
        let resdata = JSON.parse(res.data);
        //  console.log('success1----', res);
        //  console.log('success2----', resdata);
        if (resdata.type == 3) {
          dd.alert({ content: JSON.stringify(resdata.message) });
        }
        var obj = {};
        obj.Id = 0;
        obj.CategoryName = "常用";
        let objData = this.data.categoryArray;
        objData.push(obj);
        for (var i = 0; i < resdata.length; i++) {
          var obj = {};
          obj.Id = resdata[i].Id;
          obj.CategoryName = resdata[i].CategoryName;
          let objData = this.data.categoryArray;
          objData.push(obj);

        }
      
        this.setData({
          // categoryArray: res.data
          categoryArray: objData
        });
      },
      fail: (res) => {
        console.log("getCategory_httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
      },
      complete: (res) => {
        dd.hideLoading();
      }

    });
 
  },

  //品名点击事件
  getGoods() {
    dd.httpRequest({
      url: domain + "/DingTalkManage/CottonYarn/GetGoodsList",
      method: 'get',
      data: {
        "queryJson": JSON.stringify({ "dingId": this.data.userId, "categoryId": this.data.categoryArray[this.data.categoryIndex].Id })
      },
      dataType: 'jsonp',
      success: (res) => {
        // dd.alert({content: "step2"});
        console.log('success----', res)
        let resdata = JSON.parse(res.data);
        this.setData({
          goodsArray: resdata
        })
      },
      fail: (res) => {
        console.log("httpRequestFail---", res)
        dd.alert({ content: JSON.stringify(res) });
      },
      complete: (res) => {
        dd.hideLoading();
      }

    });


  },
  //类别选中事件
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);

    this.setData({
      categoryIndex: e.detail.value,
    });
    this.getGoods();
  },
  //品名选中事件
  bindObjPickerChange(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      goodsIndex: e.detail.value,
    });
  },

  //数量输入事件
  bindQtyKeyInput(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      qtyValue: e.detail.value,
    });
  },

  //按钮添加事件
  addList() {
    var obj = {};
   
    obj.right = this.data.right;
    obj.content = {
      GoodsName: this.data.goodsArray[this.data.goodsIndex].FullName,
      Qty: this.data.qtyValue,
      CategoryId: this.data.categoryArray[this.data.categoryIndex].Id,
      GoodsId: this.data.goodsArray[this.data.goodsIndex].ID
    };
    if (obj.content.Qty == '') {
      dd.alert({ content: "请输入件数" });
      return;
    }
    let objData = this.data.list;
    objData.push(obj);
    this.setData({
      list: objData
    });

  },


  //按钮提交事件
  submitList() {
    var entityJson = {};
    entityJson.MakerId = this.data.userId;
      let items = [];
      let childEntryJson = [];
      this.data.list.forEach(function (item) {
        childEntryJson.push(item.content);
      });
      if(childEntryJson.length==0){
            dd.alert({ content: '请添加提报数据'});
            return;
      }
    my.confirm({
      title: '温馨提示',
      // content: `${e.index}-${e.extra}-${JSON.stringify(e.detail)}`,
      content: `确定提交吗？`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        const { list } = this.data;
        if (result.confirm) {
          // let items = [];
          // let childEntryJson = [];
          // list.forEach(function (item) {
          //   childEntryJson.push(item.content);
          // });
          // if(childEntryJson.length==0){
          //      dd.alert({ content: '请添加提报数据'});
          //      return;
          // }
          dd.httpRequest({
            url: domain + "/DingTalkManage/CottonYarn/SaveForm",
            method: 'post',
            data: {
              "strEntity": JSON.stringify(entityJson), "childEntryJson": JSON.stringify(childEntryJson)
            },
            dataType: 'json',
            success: (res) => {
              // console.log('success----', res)
              dd.alert({ content: JSON.stringify(res.data.message) });
              let objData = this.data.items;
               this.setData({
                      list: objData
                    });
            },
            fail: (res) => {
              // console.log("httpRequestFail---", res)
              dd.alert({ content: JSON.stringify(res) });
            },
            complete: (res) => {
              dd.hideLoading();
            }

          });
        } else {
          my.showToast({
            // content: '取消 => 滑动删除状态保持不变',
          });
        }
      },
    });


  },

  onRightItemClick(e) {
    const { type } = e.detail;
    my.confirm({
      title: '温馨提示',
      // content: `${e.index}-${e.extra}-${JSON.stringify(e.detail)}`,
      content: `确定删除吗？`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        const { list } = this.data;
        if (result.confirm) {
          if (type === 'delete') {
            list.splice(this.data.swipeIndex, 1);
            this.setData({
              list: [...list],
            });
          }

          my.showToast({
             content: '已删除',
          });
          // e.done();
        } else {
          my.showToast({
            // content: '取消 => 滑动删除状态保持不变',
          });
        }
      },
    });
  },


  onItemClick(e) {
    my.alert({
      content: `dada${e.index}`,
    });
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index,
    });
  },


});
