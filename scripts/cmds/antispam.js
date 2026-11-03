module.exports={
  config:{name:"antispam",version:"1.0",author:"Cheken",countDown:5,role:1,category:"admin",guide:"{pn} on/off\n{pn} set [number]"},
  onStart:async function({api,event,args}){
    const cmd=args[0]?.toLowerCase();
    global.antispam=global.antispam||{enabled:false,limit:5,time:10000};

    if(cmd=="on"){
      global.antispam.enabled=true;
      return api.sendMessage("✅ AntiSpam ON! Spammers will be auto-muted!",event.threadID);
    }
    if(cmd=="off"){
      global.antispam.enabled=false;
      return api.sendMessage("❌ AntiSpam OFF!",event.threadID);
    }
    if(cmd=="set"){
      const num=parseInt(args[1]);
      if(isNaN(num)) return api.sendMessage("Enter number! Ex: antispam set 5",event.threadID);
      global.antispam.limit=num;
      return api.sendMessage(`✅ Spam limit set to ${num} messages in 10s`,event.threadID);
    }
    return api.sendMessage(
`🔰 ANTISPAM CONFIG
Status: ${global.antispam.enabled?"ON ✅":"OFF ❌"}
Limit: ${global.antispam.limit} msgs / 10s
Commands:
!antispam on - Turn on
!antispam off - Turn off
!antispam set 5 - Set limit

When ON, bot auto mutes spammers!`,
    event.threadID);
  },
  onChat:async function({event,api,usersData}){
    global.antispam=global.antispam||{enabled:false,limit:5,time:10000};
    global.spamTracker=global.spamTracker||{};
    
    if(!global.antispam.enabled) return;
    if(global.antispam.enabled && event.senderID==api.getCurrentUserID()) return;

    const id=event.senderID;
    const now=Date.now();
    if(!global.spamTracker[id]) global.spamTracker[id]=[];
    
    global.spamTracker[id]=global.spamTracker[id].filter(t=>now-t<global.antispam.time);
    global.spamTracker[id].push(now);

    if(global.spamTracker[id].length>=global.antispam.limit){
      global.mutedUsers=global.mutedUsers||[];
      if(!global.mutedUsers.includes(id)){
        global.mutedUsers.push(id);
        const name=await usersData.getName(id);
        api.sendMessage(`🚨 SPAM DETECTED!\n🔇 ${name} has been AUTO-MUTED for spamming!\nUse !mute unmute @user to unmute`,event.threadID);
      }
      global.spamTracker[id]=[];
    }
  }
};
