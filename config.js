/**
 * Created by Administrator on 2018/7/24.
 */
var util=require('./libs/util');
var path=require('path');
var wechat_file=path.join(__dirname,"./config/wechat.txt");

var config={
    wechat:{
        appID:'wxa912daa5a5fb07bd',
        appSecret:'b75b648c6f661ed7e171a3660bee89e2',
        token:'4792126116',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file);
        },
        saveAccessToken: function (data) {
            data=JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data);
        }
    }
}

module.exports=config;