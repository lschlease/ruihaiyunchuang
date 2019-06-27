//引入express服务器
const express=require("express");

const sha1=require("sha1")
//引入auth模块
const auth=require("./wechat/auth");
//引入wechat ,好使用ticket
const Wechat =require("./wechat/wechat")

const {url}=require("./config")

//创建实例
const app=express();

//配置摸板资源目录
app.set("views","./views")
//配置摸板引擎
app.set("view engine", "ejs");

const wechataApi=new Wechat();
//页面路由
app.get("/search",async (req,res)=> {
    /*
     生成 js-sdk使用的签名
     1.参与组合的四个参数：
     2.排序
     3.sha1加密
     */
    //随机字符串
    const  noncestr=Math.random().split(".")[1];
    //时间戳
    const timestamp=Date.now();
    //获取票据
    const {ticket}=await wechataApi.fetchTicket();

    //组合

    const arr=[
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ];

    const  str=arr.sort().join("&");

     const signature =sha1(str);



    //渲染页面，将渲染好的页面返回给用户
    res.render("search",{
        signature,
        noncestr,
        timestamp
    })

});

//接受处理所有的消息
app.use(auth());

//监听端口号
app.listen(3000,()=>{console.log("服务器启动成功")});
