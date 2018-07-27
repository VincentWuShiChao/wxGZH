/**
 * Created by Administrator on 2018/7/24.
 */

var Promise=require('bluebird');
var request=Promise.promisify(require('request'));
var util=require('./util');
var prefix='https://api.weixin.qq.com/cgi-bin/';
var fs=require('fs');
var api={
    accessToken:prefix+'token?grant_type=client_credential',
    upload:prefix+"media/upload?",
    yuyilijie:"https://api.weixin.qq.com/semantic/semproxy/search?",
    menu:" https://api.weixin.qq.com/cgi-bin/menu/create?"
}

function Wechat(opts){
    var that=this;
    this.appID=opts.appID;
    this.appSecret=opts.appSecret;
    this.getAccessToken=opts.getAccessToken;
    this.saveAccessToken=opts.saveAccessToken;
    this.fetchAccessToken();
    this.getAccessToken().then(function (data) {
        try {
            data=JSON.parse(data);
        }catch (e){
            console.log("没有数据");
            return that.updateAccessToken();
        }
        if(that.isValidAccessToken(data)){
            console.log("27--:",data);
            return Promise.resolve(data);
        }else{
            return that.updateAccessToken();
        }
    }).then(function (data) {
        that.access_token=data.access_token;
        that.expires_in=data.expires_in;
        that.saveAccessToken(data);
    })
}
Wechat.prototype.isValidAccessToken= function (data) {
    if(!data||!data.access_token||!data.expires_in){
        return false;
    }
    var access_token=data.access_token;
    var expires_in=data.expires_in;
    var now=(new Date().getTime());
    if(now <expires_in){
        return true;
    }else{
        return false;
    }
};
Wechat.prototype.updateAccessToken= function () {
    console.log("进入了updateAccessToken方法");
    var appID=this.appID;
    var appSecret=this.appSecret;
    var url=api.accessToken+"&appid="+appID+"&secret="+appSecret;
    console.log("58--url:",url);
    return new Promise(function (resolve,reject){
        request({
            url:url,
            json:true

        }).then(function (response) {
            console.log("65--response",response.body);
            var data=response.body;
            var now=(new Date().getTime());
            var expires_in=now+(data.expires_in-20)*1000;

            data.expires_in=expires_in;
            resolve(data);
        })
    })

};
Wechat.prototype.fetchAccessToken= function () {
    var that=this;
    if(this.access_token&&this.expires_in){
        if(this.isValidAccessToken(this)){
            return Promise.resolve(this);
        }
    }
    this.getAccessToken().then(function (data) {
        try {
            data=JSON.parse(data);
        }catch (e){
            console.log("没有数据");
            return that.updateAccessToken();
        }
        if(that.isValidAccessToken(data)){
            console.log("27--:",data);
            return Promise.resolve(data);
        }else{
            return that.updateAccessToken();
        }
    }).then(function (data) {
        that.access_token=data.access_token;
        that.expires_in=data.expires_in;
        that.saveAccessToken(data);

        return Promise.resolve(data);
    })

};
Wechat.prototype.reply= function () {
    var content=this.content;
    var message=this.weixin;
    console.log("wechat 109:",message);
    console.log("wechat 110:",content);
    var xml=util.tpl(content,message);
    this.status=200;
    this.type='application/xml';
    this.body=xml;
};
Wechat.prototype.uploadMaterial= function (type,filePath) {
    console.log("wechat 117:",filePath);
    var that=this;
    var form={
        media:fs.createReadStream(filePath)
    }
    var appID=this.appID;
    var appSecret=this.appSecret;
    return new Promise(function (resolve,reject){
        console.log("wechat 123:",that);
        that.fetchAccessToken().then(function (data) {
            var url=api.upload+"&access_token="+data.access_token+"&type="+type;
            request({
                url:url,
                json:true,
                method:"POST",
                formData:form
            }).then(function (response) {
                console.log("65--response",response.body);
                var _data=response.body;
                if(_data){
                    resolve(_data)
                }else {
                    throw new Error("upload material fails")
                }
            }).catch(function (err) {
                reject(err);
            })
        });

    })
}
Wechat.prototype.yuyilijie= function () {
    var that=this;
    var form={
        "query":"查一下明天从北京到上海的南航机票",
        "city":"北京",
        "category": "flight,hotel",
        "appid":"wxaaaaaaaaaaaaaaaa",
        "uid":"123456"
    }
    var appID=this.appID;
    var appSecret=this.appSecret;
    return new Promise(function (resolve,reject){
        that.fetchAccessToken().then(function (data) {
            var url=api.yuyilijie+"access_token="+data.access_token;
            request({
                url:url,
                json:true,
                method:"POST",
                formData:form
            }).then(function (response) {
                console.log("65--response",response.body);
                var _data=response.body;
                if(_data){
                    resolve(_data)
                }else {
                    throw new Error("upload material fails")
                }
            }).catch(function (err) {
                reject(err);
            })
        });

    })
}
Wechat.prototype.menu= function () {
    var that=this;
    var form= {
        "button":[
            {
                "type":"click",
                "name":"今日歌曲",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "name":"菜单",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"搜索",
                        "url":"http://www.soso.com/"
                    },
                    {
                        "type":"miniprogram",
                        "name":"wxa",
                        "url":"http://mp.weixin.qq.com",
                        "appid":"wx286b93c14bbf93aa",
                        "pagepath":"pages/lunar/index"
                    },
                    {
                        "type":"click",
                        "name":"赞一下我们",
                        "key":"V1001_GOOD"
                    }]
            }]
    }
    return new Promise(function (resolve,reject){
        that.fetchAccessToken().then(function (data) {
            var url=api.menu+"access_token="+data.access_token;
            request({
                url:url,
                json:true,
                method:"POST",
                formData:form
            }).then(function (response) {
                console.log("65--response",response.body);
                var _data=response.body;
                if(_data){
                    resolve(_data)
                }else {
                    throw new Error("upload material fails")
                }
            }).catch(function (err) {
                reject(err);
            })
        });

    })
}
module.exports=Wechat;