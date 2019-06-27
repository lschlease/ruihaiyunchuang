  const {parseString} = require("xml2js");
  module.exports={

      getUserDataAsync(req) {
          return new Promise((resolve,reject) =>{
              let xmlData="";
              req
                  .on("data", data => {
                      xmlData += data.toString();
                  })

                  .on("end", () => {
                      resolve(xmlData)
                  })
          })
      },

      parseXMLAsync(xmlData){
          return new Promise((resolve,reject) =>{
              parseString(xmlData,{trim:true},(err,data)=>{
                  if(!err){
                      resolve(data);
                  }else {
                      reject("parseXMLAsync方法出了问题"+err);
                  }
              })
          })
      },

      formatMessage(jsData){
          let message={};
          jsData=jsData.xml
          if(typeof jsData ==="object"){
              //遍历对象
              for(let key in jsData) {
                    // 获取属性值
                  let value = jsData[key];
                  message[key]=value[0];
              }
          }
          return message;
      }

  };





