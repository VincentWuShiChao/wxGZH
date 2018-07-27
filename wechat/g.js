/**
 * Created by Administrator on 2018/7/24.
 */
/**
 * Created by Administrator on 2018/7/24.
 */
var sha1=require("sha1");
var Promise=require('bluebird');
var request=Promise.promisify(require('request'));
var Wechat=require('./wechat');
var getRawBody=require('raw-body');
var util=require('./util');
var weixin=require('../weixin');
module.exports= function (opts) {
    var wechat=new Wechat(opts);
    return function *(next) {
        var that=this;
        console.log("g.js-15:",this.query);
        var token=opts.token;
        var signature=this.query.signature;
        var nonce=this.query.nonce;
        var timestamp=this.query.timestamp;
        var echostr=this.query.echostr;
        var str=[token,timestamp,nonce].sort().join('');
        var sha=sha1(str);
        if(this.method==='GET'){
            if(sha===signature){
                this.body=echostr+"";
            }else {
                this.body="wrong"
            }
        }else if(this.method==="POST"){
            if(sha!==signature){
                this.body="wrong";
                return false;
            }
            var data=yield getRawBody(this.req,{
                length:this.length,
                limit:'1mb',
                encoding:this.charset
            });
            console.log("g.js 40--:",data.toString());
            var content=yield util.parseXMLAsync(data);
            console.log("g.js 43:",content);
            var message=util.formatMessage(content.xml);
            console.log("45--message:",message.MsgType);
            this.weixin=message;
            weixin.reply.call(this,wechat);
        }

    }

};

