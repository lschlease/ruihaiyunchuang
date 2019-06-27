/*
*  处理用户发送的消息类型和内容，决定返回不同的内容给用户
* */
module.exports=(message)=> {

    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now(),
        msgType: message.MsgType
    }
    let content = "什么也没有"
    if (message.MsgType === "text") {

        if (message.Content === "123") {
            content = "我是123的回复"
        } else if (message.Content === "321") {
            content = "我是321的回复"
        } else if (message.Content.match("1")) {
            content = "我是包含1的回复"
        }

    }
    else if (message.MsgType === "image") {
        options.msgType = "image";
        options.mediaId = message.MediaId;
    }
    else if (message.MsgType === "voive") {
        options.msgType = "voice";
        options.mediaId = message.MedidId;
    }
    else if (message.MsgType === "location") {

    }
    else if (message.MsgType === "event") {

        if (message.Event === "subscribe") {
            content = "欢迎您的关注，我是睿海云创"
        }
        else if (message.Event === "unsubscribe") {
            console.log("有人取消关注")
        }
        else if (message.Event === "subscribe") {
            //扫描带参数的二维码事件，用户未关注时，进行关注后的事件推送
        }
        else if (message.Event === "SCAN") {
            //扫描带参数的二维码事件，用户已关注时的事件推送
        }
        else if (message.Event === "LOCATION") {
            //上报地理位置事件
        }
        else if (message.Event === "CLICK") {
            //自定义菜单事件，点击菜单拉取消息时的事件推送
        }
        else if (message.Event === "VIEW") {
            //自定义菜单事件，
        }

        options.content = content;
        return options;
    }
};