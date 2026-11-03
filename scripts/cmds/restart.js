module.exports={
  config:{name:"restart",version:"1.0",author:"Cheken",countDown:5,role:2,category:"admin",guide:"{pn}"},
  onStart:async function({api,event}){
    api.sendMessage("🔄 Restarting bot...",event.threadID,()=>{
      process.exit(1);
    });
  }
};
