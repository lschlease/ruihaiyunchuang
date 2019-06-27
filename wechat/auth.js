//验证服务器有效性
//引入sha1加密模块
const sha1=require("sha1");
//引入config模块
const config=require("../config");
//引入XML拼接模块
const template=require("./template");
//引入返回微信服务器的消息模块
const replay=require("./replay")
//引入工具模块中的各种方法
const {getUserDataAsync,parseXMLAsync,formatMessage}=require("../utils/tool");

module.exports= ()=> {
    return async (req, res, next) => {
        const {signature, echostr, timestamp, nonce} = req.query;
        const {token} = config;
        const sha1Str = sha1([timestamp, nonce, token].sort().join(""));

        if (req.method === "GET") {
            if (sha1Str === signature) {
                res.send(echostr)
            } else {
                res.end("error")
            }
        }
        else if (req.method === "POST") {
            if (sha1Str === signature) {
                /* 接受请求体中的流数据*/
                const xmlData =await getUserDataAsync(req);
                const  jsData =await parseXMLAsync(xmlData);
                /*格式化数据*/
                const message = formatMessage(jsData);
                /*简单的回复消息*/
                const options=replay(message);
                const replayMessage=template(options);
                console.log(replayMessage)
                res.send(replayMessage)
                res.end("");
            } else {
                res.end("error")
            }
        }
        else {
            res.send("error")
        }
    };
};

