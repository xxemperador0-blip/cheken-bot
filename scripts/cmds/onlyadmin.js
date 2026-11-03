module.exports={
  config:{name:"onlyadmin",version:"1.0",author:"Cheken",countDown:5,role:1,category:"admin",guide:"{pn} on/off"},
  onStart:async function({api,event,args}){
    if(args[0]=="on"){
      global.GoatBot.config.adminOnly=true;
      api.sendMessage("🔒 Admin Only: ON\nOnly admin can use bot now!",event.threadID);
    } else if(args[0]=="off"){
      global.GoatBot.config.adminOnly=false;
      api.sendMessage("🔓 Admin Only: OFF\nEveryone can use bot!",event.threadID);
    } else api.sendMessage("Use: onlyadmin on/off",event.threadID);
  }
};
