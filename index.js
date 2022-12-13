const express = require("express")();
const Axios = require("axios");
const Puppeteer = require("puppeteer");
const Server = `https://harmonious-maamoul-9b1fa0.netlify.app/`;
const PingHost = `https://host-router.onrender.com/`;
const serviceURL  = (process.env.DOMAIN.match(/(?<=[^\.])onrender.com/))?`https://${process.env.DOMAIN.replace(/(?<=[^\.])onrender.com/,".onrender.com")}`:`https://${process.env.DOMAIN}`; 
let previousServer ="";
let  Page;
async function main(){
const Browser = await Puppeteer.launch({headless:true,args:["--no-sandbox"]});
 Page = (await Browser.pages())[0];
 console.log(`REACHED HERE ${Page}`);

await  Page.goto(Server);

//Get servers that should be pinged and ping them every 5 minutes:
/*try{ 
 previousServer = ( await Axios.get(`${PingHost}/getPing/${serviceURL}`, {headers: { "Accept-Encoding": "gzip,deflate,compress" } })).data.previousServer;
 if(previousServer.match(/(?<=[^\.])onrender.com/)){previousServer=previousServer.replace(`onrender.com`,".onrender.com")}
}catch(e){ console.log(`ERROR FETCHING SERVER: ${e.message}`);setTimeout(async()=> {previousServer = ( await Axios.get(`${PingHost}/getPing/${serviceURL}`)).data.previousServer;}
,60000)}
console.log(previousServer);
*/
setInterval(async ()=>{
 try{
 // await Axios.get(previousServer, {headers: { "Accept-Encoding": "gzip,deflate,compress" } });
 await Axios.get(serviceURL,{headers: { "Accept-Encoding": "gzip,deflate,compress" } })
 }catch(e){console.log(e.message)}
 },(5*60000))
/*********************************/
}
main();

express.get("/",async (req,res)=>{
   try{
    if(!Page){
         res.end(`Page is not yet ready...`);
    }else{
        res.end(`${await Page.evaluate(()=>_client.getHashesPerSecond())}\n Previous: ${previousServer}`);
    }
   }catch(e){console.log(`ERROR: ${e.message}`)}
}).listen(process.env.PORT,()=>console.log(`ServerIslistening`))
