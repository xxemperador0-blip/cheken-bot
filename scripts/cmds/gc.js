module.exports={
  config:{
    name:"gc",
    aliases:["group","box"],
    version:"1.0",
    author:"Cheken",
    countDown:5,
    role:0,
    category:"group",
    guide:"{pn} name [new name]\n{pn} emoji [emoji]\n{pn} admin list\n{pn} members\n{pn} info"
  },
  onStart:async function({api,event,args,usersData}){
    const cmd=args[0]?.toLowerCase();
    
    if(!cmd){
      return api.sendMessage(
`👥 𝗚𝗖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 👥
━━━━━━━━━━━━
!gc name [new name] - Change GC name
!gc emoji [emoji] - Change GC emoji
!gc admin list - List admins
!gc members - List members
!gc info - Group info
!gc add @user - Add user (admin only)
!gc kick @user - Kick user (admin only)
`,event.threadID);
    }

    if(cmd=="name"){
      const newName=args.slice(1).join(" ");
      if(!newName) return api.sendMessage("Enter new name!",event.threadID);
      api.setTitle(newName,event.threadID);
      api.sendMessage(`✅ GC name changed to: ${newName}`,event.threadID);
    }
    
    else if(cmd=="emoji"){
      const emoji=args[1];
      if(!emoji) return api.sendMessage("Enter emoji! Ex: gc emoji 😍",event.threadID);
      api.changeThreadEmoji(emoji,event.threadID);
      api.sendMessage(`✅ GC emoji changed to: ${emoji}`,event.threadID);
    }
    
    else if(cmd=="admin"&&args[1]=="list"){
      const info=await api.getThreadInfo(event.threadID);
      let msg="👑 GC ADMINS:\n";
      for(let id of info.adminIDs){
        msg+=`- ${await usersData.getName(id)}\n`;
      }
      api.sendMessage(msg,event.threadID);
    }
    
    else if(cmd=="members"){
      const info=await api.getThreadInfo(event.threadID);
      api.sendMessage(`👥 Members: ${info.participantIDs.length}\nGC Name: ${info.threadName}`,event.threadID);
    }
    
    else if(cmd=="info"){
      const info=await api.getThreadInfo(event.threadID);
      api.sendMessage(`📋 𝗚𝗖 𝗜𝗡𝗙𝗢\nName: ${info.threadName}\nMembers: ${info.participantIDs.length}\nEmoji: ${info.emoji}\nID: ${event.threadID}`,event.threadID);
    }
    
    else if(cmd=="add"){
      const id=Object.keys(event.mentions)[0];
      if(!id) return api.sendMessage("Mention user to add!",event.threadID);
      api.addUserToGroup(id,event.threadID,(e)=>{if(e) api.sendMessage("❌ Can't add user!",event.threadID); else api.sendMessage("✅ Added!",event.threadID);});
    }
    
    else if(cmd=="kick"){
     
