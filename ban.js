module.exports={
  config:{name:"ban",version:"1.0",author:"Cheken",countDown:5,role:1,category:"admin",guide:"{pn} @user"},
  onStart:async function({api,event}){
    const id=Object.keys(event.mentions)[0]||event.messageReply?.senderID;
    if(!id) return api.sendMessage("Mention user to ban!",event.threadID);
    // Add to banned list logic here
    api.sendMessage(`🚫 User ${id} has been banned from using bot!`,event.threadID);
  }
};
