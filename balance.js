module.exports={
  config:{name:"balance",aliases:["bal","money","coin"],version:"1.0",author:"Cheken",countDown:5,role:0,category:"economy",guide:"{pn} or {pn} @user"},
  onStart:async function({api,event,usersData}){
    const targetID=Object.keys(event.mentions)[0]||event.senderID;
    const data=await usersData.get(targetID);
    const name=await usersData.getName(targetID);
    api.sendMessage(`💰 ${name}'s Balance: $${data.money||0}`,event.threadID);
  }
};
