module.exports={
  config:{name:"addmoney",aliases:["addbal","addcoin"],version:"1.0",author:"Cheken",countDown:5,role:2,category:"economy",guide:"{pn} @user [amount]"},
  onStart:async function({api,event,args,usersData}){
    let targetID, amount;
    
    if(event.messageReply){
      targetID=event.messageReply.senderID;
      amount=parseInt(args[0]);
    } else {
      targetID=Object.keys(event.mentions)[0];
      amount=parseInt(args[1]);
    }
    
    if(!targetID||isNaN(amount)) return api.sendMessage("Use: addmoney @user 1000\nOr reply to user: addmoney 1000",event.threadID);
    
    try{
      const userData=await usersData.get(targetID);
      const newMoney=(userData.money||0)+amount;
      await usersData.set(targetID,{money:newMoney});
      const name=await usersData.getName(targetID);
      api.sendMessage(`💰 Added $${amount} to ${name}\nNew Balance: $${newMoney}`,event.threadID);
    }catch(e){api.sendMessage("❌ Error: "+e.message,event.threadID);}
  }
};
