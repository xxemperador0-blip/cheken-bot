module.exports={
  config:{name:"mute",version:"1.0",author:"Cheken",countDown:5,role:1,category:"admin",guide:"{pn} @user\n{pn} unmute @user\n{pn} list"},
  onStart:async function({api,event,args,usersData}){
    const cmd=args[0]?.toLowerCase();
    const id=Object.keys(event.mentions)[0]||event.messageReply?.senderID;

    if(cmd=="list"){
      const list=global.mutedUsers||[];
      if(list.length==0) return api.sendMessage("🔇 No muted users!",event.threadID);
      let msg="🔇 MUTED LIST:\n";
      for(let uid of list){msg+=`- ${await usersData.getName(uid)} (${uid})\n`;}
      return api.sendMessage(msg,event.threadID);
    }

    if(cmd=="unmute"){
      if(!id) return api.sendMessage("Mention user to unmute!",event.threadID);
      global.mutedUsers=global.mutedUsers||[];
      global.mutedUsers=global.mutedUsers.filter(x=>x!=id);
      return api.sendMessage(`🔊 Unmuted ${await usersData.getName(id)}!`,event.threadID);
    }

    // mute
    if(!id) return api.sendMessage("Use: mute @user\nmute unmute @user\nmute list",event.threadID);
    global.mutedUsers=global.mutedUsers||[];
    if(!global.mutedUsers.includes(id)) global.mutedUsers.push(id);
    api.sendMessage(`🔇 Muted ${await usersData.getName(id)}!\nThey can't use bot commands now!`,event.threadID);
  },
  // Auto delete messages from muted users
  onChat:async function({event,api}){
    global.mutedUsers=global.mutedUsers||[];
    if(global.mutedUsers.includes(event.senderID)){
      // Delete their message if bot is admin
      try{api.deleteMessage(event.messageID);}catch{}
    }
  }
};
