/**
 * Created by Administrator on 2018/7/24.
 */
'use strict'

var xml2js=require('xml2js');
var Promise=require('bluebird');
var tpl=require('./tpl');
exports.parseXMLAsync= function (xml) {
    return new Promise(function (resolve,reject) {
        xml2js.parseString(xml,{trim:true}, function (err,content) {
            if(err)reject(err);
            else resolve(content);
        })
    })
}
function formatMessage(result){
    var message={};
    if(typeof result==='object'){
        var keys=Object.keys(result);
        for(var i=0;i<keys.length;i++){
            var item=result[keys[i]];
            var key=keys[i];
            if(!(item instanceof Array)||item.length===0){
                continue;
            }
            if(item.length===1){
                var val=item[0];
                if(typeof  val==="object"){
                    message[key]=formatMessage(val);
                }else {
                    message[key]=(val||"").trim();
                }
            }else {
                message[key]=[];
                for(var j=0,k=item.length;j<k;j++){
                    message[key].push(formatMessage(item[j]));
                }
            }
        }
    }
    return message;
}
exports.formatMessage= formatMessage;
exports.tpl= function (content,message) {
    console.log("wechat util 46:",content);
    var info={};
    var type="";
    var fromUserName=message.FromUserName;
    var toUserName=message.ToUserName;

    if(Array.isArray(content.content)){
        type="news"
    }
    type=content.type;
    info.content=content.content;
    info.createTime=new Date().getTime();
    info.toUserName=fromUserName;
    info.fromUserName=toUserName;
    info.msgType=type;
    console.log("wechat/util 59:",info);
    return tpl.compiled(info);
}