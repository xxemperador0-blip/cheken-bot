module.exports={
  config:{name:"admin",version:"1.0",author:"Cheken",countDown:5,role:2,category:"admin",guide:"{pn} add @user | {pn} remove @user | {pn} list"},
  onStart:async function({api,event,args,usersData}){
    const cmd=args[0];
    if(cmd=="list"){
      const config=global.GoatBot.config;
      let msg="👑 ADMIN LIST:\n";
      for(let id of config.adminBot){msg+=`- ${await usersData.getName(id)} (${id})\n`;}
      return api.sendMessage(msg,event.threadID);
    }
    const id=Object.keys(event.mentions)[0];
    if(!id) return api.sendMessage("Mention user!\n!admin add @user",event.threadID);
    // This is demo - real admin add needs config.json edit
    api.sendMessage(`Admin command: ${cmd} ${id}\nTo make permanent, add UID to config.json adminBot`,event.threadID);
  }
};
