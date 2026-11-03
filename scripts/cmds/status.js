module.exports={
  config:{
    name:"status",
    aliases:["bot","uptime","stat"],
    version:"1.0",
    author:"Cheken",
    countDown:5,
    role:0,
    category:"info",
    guide:"{pn}"
  },
  onStart:async function({api,event,args,usersData,threadsData}){
    const uptime=process.uptime();
    const hours=Math.floor(uptime/3600);
    const mins=Math.floor((uptime%3600)/60);
    const secs=Math.floor(uptime%60);
    
    const memUsage=(process.memoryUsage().heapUsed/1024/1024).toFixed(2);
    
    const allUsers=await usersData.getAll();
    const allThreads=await threadsData.getAll();
    
    const ping=Date.now();
    
    api.sendMessage("⏳ Checking status...",event.threadID,(err,info)=>{
      const latency=Date.now()-ping;
      
      api.sendMessage(
`🤖 𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 🤖
━━━━━━━━━━━━
✅ Online: YES
⏰ Uptime: ${hours}h ${mins}m ${secs}s
⚡ Ping: ${latency}ms
💾 RAM: ${memUsage} MB
📦 Node: ${process.version}

👥 Users: ${allUsers.length}
👨‍👩‍👧‍👦 Groups: ${allThreads.length}

👑 Owner: Master Cheken
🔧 Prefix: ${global.GoatBot.config.prefix}
🟢 Status: Smooth & Active!

Made with ❤️ for Master Cheken 👑
`,event.threadID);
      
      setTimeout(()=>api.unsendMessage(info.messageID),10000);
    });
  }
};
