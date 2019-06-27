//获取access_Token ,
/*  特点：
  1. 唯一的
  2. 有效期两小时
  3. 每天只能用2000次

  请求地址: https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
  请求方式：get请求

  设计思路
    1.首次本地没有，发送请求获取access_Token,保存下来(文件)
    2.第二次以后：
       - 先去本地读取，判断它是否过期
          -过期了
             -重新请求 ，保存覆盖
          -没有过期
              -直接使用

    整理思路：
       读取本地文件(readAccessToken)
          -本地有文件
            -判断它是否过期(isValidAccessToken)
               -过期了
                   -重新请求(getAccessToken) ，保存覆盖(saveAccessToken  )
                -没有过期
                   -直接使用
          -本地没有文件
              -发送请求获取access_Token,保存下来(文件),直接使用

        */
const rp = require("request-promise-native");
const {writeFile, readFile} = require("fs");
const {AppID, AppSecret} = require("../config");
const menu=require("./menu")

class Wechat {
    constructor() {

    }

    getAccessToken() {
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${AppID}&secret=${AppSecret}`;
        return new Promise((resolve, reject) => {
            rp({method: "get", url, json: true})
                .then(res => {
                    //设置access_token的过期时间
                    res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                    //将Promise对象改成成功的状态
                    resolve(res)
                })
                .catch(err => {
                    rejcet("getAccessToken方法出了问题" + err)
                })
        })
    }

    saveAccessToken(accessToken) {
        accessToken = JSON.stringify(accessToken);

        return new Promise((resolve, reject) => {

            writeFile("./accessToken.txt", accessToken, err => {

                if (!err) {
                    resolve();
                } else {
                    reject("saveAccessToken方法出了问题" + err);
                }

            })


        })


    }

    readAccessToken() {

        return new Promise((resolve, reject) => {

            readFile("./accessToken.txt", (err, data) => {

                if (!err) {
                    data = JSON.parse(data);
                    resolve(data);
                } else {
                    reject("readAccessToken方法出了问题" + err);
                }

            })
        })
    }

    isValidAccessToken(data) {
        //检测传入的参数是否是有效的

        if (!data && !data.access_token && !data.expires_in) {
            return false
        }
        return data.expires_in > Date.now() //返回布尔值

    }

    //用来获取一个没有过期的 access_token
    fetchAccessToken() {
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in
            })
        }
        return this.readAccessToken()
            .then(async res => {
                // 本地有文件
                //判断是否过期
                if (this.isValidAccessToken(res)) {
                    //有效的
                    return Promise.resolve(res)
                } else {
                    const res = await this.getAccessToken()
                    await this.saveAccessToken(res)
                    return Promise.resolve(res)
                }
            })
            .catch(async err => {
                //本地没有文件
                //发送请求获取accesstoken
                const res = await this.getAccessToken()
                await this.saveAccessToken(res)
                return Promise.resolve(res)
            })
            .then(res => {
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;
                return Promise.resolve(res)
            })
    }
     //创建自定义菜单
    createMenu(menu) {
        try {
            return new Promise(async (resolve, reject) => {
                //获取accessToken
                const data = await this.fetchAccessToken();
                //定义请求地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
                const result = await rp({method: "POST", url, json: true, body: menu})
                resolve(result);
            })
        } catch (e) {
             reject("createMenu方法出了问题"+e)
        }
    }
     //删除初始化自定义菜单
    deleteMenue(){
        try{
            return new Promise(async (resolve, reject) => {
                const data=await this.fetchAccessToken()
                //定义请求地址
                const url=`https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`
                const result = await rp({method: "POST", url, json: true})
                resolve(result);
            })
        }catch (e) {
            reject("deleteMenu出了问题"+e)
        }


    }

}


(async ()=>{
    const w=new Wechat();
    let result=await w.deleteMenue();
    console.log(result);
    result=await w.createMenu(menu);
    console.log(result)
})()





