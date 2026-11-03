module.exports={
  config:{
    name:"analysis",
    aliases:["analyze","analy"],
    version:"1.0",
    author:"Cheken",
    countDown:5,
    role:0,
    category:"info",
    guide:"{pn} @user\n{pn} gc\n{pn} reply to image"
  },
  onStart:async function({api,event,args,usersData,threadsData}){
    const cmd=args[0]?.toLowerCase();

    // ANALYSIS GC
    if(cmd=="gc"){
      const info=await api.getThreadInfo(event.threadID);
      const data=await threadsData.get(event.threadID);
      return api.sendMessage(
`📊 𝗚𝗖 𝗔𝗡𝗔𝗟𝗬𝗦𝗜𝗦 📊
━━━━━━━━━━━━
Name: ${info.threadName}
Members: ${info.participantIDs.length}
Admins: ${info.adminIDs.length}
Messages: ${info.messageCount}
Emoji: ${info.emoji || "None"}
Approval Mode: ${info.approvalMode ? "ON" : "OFF"}
Created: ${new Date(info.creationTimestamp).toLocaleDateString()}

Activity: ${info.messageCount > 10000 ? "🔥 Very Active" : info.messageCount > 1000 ? "💬 Active" : "💤 Quiet"}
`,event.threadID);
    }

    // ANALYSIS USER
    const targetID=Object.keys(event.mentions)[0]||event.messageReply?.senderID||event.senderID;
    const userData=await usersData.get(targetID);
    const name=await usersData.getName(targetID);
    const threadInfo=await api.getThreadInfo(event.threadID);
    const isAdmin=threadInfo.adminIDs.includes(targetID);
    const isBotAdmin=global.GoatBot.config.adminBot.includes(targetID);

    // Calculate level from exp
    const exp=userData.exp||0;
    const level=Math.floor(Math.sqrt(exp/100));
    const money=userData.money||0;

    // Personality analysis (fun)
    const personalities=["Leader 😎","Friendly 🤗","Chatterbox 💬","Lurker 👀","Gamer 🎮","Helper 💖","Joker 😂","Quiet 🤫"];
    const personality=personalities[targetID.length%personalities.length];
    const activity=exp>5000?"🔥 Very Active":exp>1000?"💬 Active":"💤 Needs to chat more";

    api.sendMessage(
`🔍 𝗔𝗡𝗔𝗟𝗬𝗦𝗜𝗦 - ${name} 🔍
━━━━━━━━━━━━
🆔 UID: ${targetID}
👑 Role: ${isBotAdmin?"BOT OWNER 👑":isAdmin?"GC Admin 🛡️":"Member 👤"}
💰 Money: $${money}
⭐ EXP: ${exp}
📈 Level: ${level}
🎭 Type: ${personality}
📊 Activity: ${activity}

💡 Analysis:
${money>10000?"Rich! 💎":"Needs more money, do !daily"}
${level>10?"Veteran member! 🏆":"Newbie, keep chatting!"}
${isAdmin?"Respected in GC!":"Regular member"}

Made for Master Cheken 👑
`,event.threadID);
  }
};
