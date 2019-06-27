//引入express服务器
const express=require("express");
//引入auth模块
const auth=require("./wechat/auth");

//创建实例
const app=express();

//接受处理所有的消息
app.use(auth());

//监听端口号
app.listen(3000,()=>{console.log("服务器启动成功")});
