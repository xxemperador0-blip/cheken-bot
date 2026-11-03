module.exports={
  config:{name:"out",version:"1.0",author:"Cheken",countDown:5,role:2,category:"admin",guide:"{pn}"},
  onStart:async function({api,event}){
    api.sendMessage("👋 Goodbye! chekenGod is leaving!",event.threadID,()=>{
      api.removeUserFromGroup(api.getCurrentUserID(),event.threadID);
    });
  }
};
