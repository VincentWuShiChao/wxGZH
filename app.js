var Koa=require('koa');
var wechat=require('./wechat/g');
var config=require('./config.js');
var util=require('./libs/util');
var path=require('path');
var wechat_file=path.join(__dirname,"./config/wechat.txt");



var app=new Koa();
app.use(wechat(config.wechat));
app.listen(6060);
console.log("Listening:6060");