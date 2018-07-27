/**
 * Created by Administrator on 2018/7/24.
 */
var config=require('./config.js');
var WeChat=require('./wechat/wechat');
var wechatApi=new WeChat(config.wechat);
var util=require('./wechat/util');
var request=require('request');
exports.reply= function (wechat) {
    var message=this.weixin;
    if(message.MsgType==="event"){
        if(message.Event==="subscribe"){
            let content_1={
                type: 'text',
                content: '欢迎关注吴世超的公众号'};
            this.content=content_1;
            wechat.reply.call(this);
        }else if(message.Event==="unsubscribe"){
            console.log("无情取消了关注");
            this.body='';
        }else if(message.Event==="LOCATION"){
            let content_1={
                type: 'text',
                content: '您上报的位置是：'+message.Latitude+"/"+message.Longitude+"-"+message.Precision};
            this.content=content_1;
            wechat.reply.call(this);
        }else if(message.Event==="CLICK"){
            let content_1={
                type: 'text',
                content: '您点击了菜单'+message.EventKey};
            this.content=content_1;
            wechat.reply.call(this);
        }else if(message.Event==="SCAN"){
            console.log("关注后扫描二维码"+message.EventKey+' '+message.Ticket);
            let content_1={
                type: 'text',
                content: '看到你扫了一下'};
            this.content=content_1;
            wechat.reply.call(this);
        }else if(message.Event==="VIEW"){
            let content_1={
                type: 'text',
                content: '您点击了菜单中的链接'+message.EventKey};
            this.content=content_1;
            wechat.reply.call(this);
        }
    }else if(message.MsgType==="text"){
        let user_content=message.Content;
        let content_1={
            type: 'text',
            content: '额，您说的'+message.Content+'太复杂了'};
        if(user_content==="1"){
            content_1.content="天下第一吃大米";
            this.content=content_1;
            wechat.reply.call(this);
        }else if(user_content==="2"){
            content_1.content='天下第二吃豆腐';
            this.content=content_1;
            wechat.reply.call(this);
        }else if(user_content==="3"){
            content_1.content="天下第三仙丹";
            this.content=content_1;
            wechat.reply.call(this);
        }else if(user_content==="新闻"){
            content_1.type="news";
            content_1.content=[{
                title:"技术改变世界",
                description:"只是个描述而已",
                picUrl:"http://thirdwx.qlogo.cn/mmopen/vi_32/YvLWVkRKGt8KFhnria0pTrKzCu4Kz2kBuUgia1upoa3HOgWs1ejLMZ5RTmTjqEvsBbrra2kHMla0Dyug1rWOzhrg/132",
                url:"http://47.92.126.116/AdminLogin"
            },{
                title:"Nodejs改变世界",
                description:"爽到爆",
                picUrl:"http://thirdwx.qlogo.cn/mmopen/vi_32/YvLWVkRKGt8KFhnria0pTrKzCu4Kz2kBuUgia1upoa3HOgWs1ejLMZ5RTmTjqEvsBbrra2kHMla0Dyug1rWOzhrg/132",
                url:"https://github.com/"
            }];
            this.content=content_1;
            wechat.reply.call(this);
        }else if(user_content==="图片"){
            let that_1=this;
            wechatApi.uploadMaterial("image",__dirname+"\\2.jpg").then(function (data) {
                console.log("weixin 70:",data);
                content_1.type="image";
                content_1.content={
                    mediaId:data.media_id
                }
                console.log("wexin 77:",content_1);
                that_1.content=content_1;
                wechat.reply.call(that_1);
            });
        }else if(user_content==="6"){
            let that_1=this;
            wechatApi.uploadMaterial("video",__dirname+"\\6.mp4").then(function (data) {
                content_1.type="video";
                content_1.content={
                    mediaId:data.media_id,
                    title:'回复视频',
                    description:"大哥篮球"
                }
                that_1.content=content_1;
                wechat.reply.call(that_1);
            });
        }else if(user_content==='7'){
            content_1.type='music';
            content_1.content={
                title:"回复音乐内容",
                description:"放松一下",
                musicUrl:'http://www.1ting.com/api/audio?/2018/07/23X/23e_Zhiwen/01.mp3'
            }
            this.content=content_1;
            wechat.reply.call(this);
        }else if(user_content==="天气"){
           wechatApi.yuyilijie().then(function (data) {
               console.log("语义理解的内容：",data);
           });
        }else if(user_content==="菜单"){
            wechatApi.menu().then(function (data) {
                console.log("菜单：",data);
            })
        }else {
            this.content=content_1;
            wechat.reply.call(this);
        }

    }
}