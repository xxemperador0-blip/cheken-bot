module.exports={
  config:{name:"daily",version:"1.0",author:"Cheken",countDown:5,role:0,category:"economy",guide:"{pn}"},
  onStart:async function({api,event,usersData}){
    const reward=500;
    const userData=await usersData.get(event.senderID);
    const lastDaily=userData.data?.lastDaily||0;
    const now=Date.now();
    
    if(now-lastDaily<86400000){
      const left=Math.ceil((86400000-(now-lastDaily))/3600000);
      return api.sendMessage(`⏰ You already claimed daily!\nCome back in ${left}h`,event.threadID);
    }
    
    await usersData.set(event.senderID,{
      money:(userData.money||0)+reward,
      data:{...userData.data,lastDaily:now}
    });
    api.sendMessage(`🎉 Daily Reward: $${reward}!\nNew Balance: $${(userData.money||0)+reward}`,event.threadID);
  }
};
