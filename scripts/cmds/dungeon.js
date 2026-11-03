const monsters = [
  { name: "Slime 🟢", hp: 30, atk: 5, exp: 20, money: 50 },
  { name: "Goblin 👺", hp: 60, atk: 10, exp: 40, money: 100 },
  { name: "Skeleton 💀", hp: 100, atk: 15, exp: 70, money: 200 },
  { name: "Orc 👹", hp: 180, atk: 25, exp: 120, money: 400 },
  { name: "Dragon 🐉", hp: 300, atk: 40, exp: 250, money: 1000 },
  { name: "Demon King 👑", hp: 500, atk: 60, exp: 500, money: 3000 }
];

module.exports={
  config:{
    name:"dungeon",
    aliases:["rpg","adventure"],
    version:"3.0",
    author:"Cheken",
    countDown:3,
    role:0,
    category:"game",
    guide:`{pn}
{pn} stats
{pn} fight
{pn} heal

👑 ADMIN ONLY (Master Cheken):
{pn} setlevel @user 10
{pn} setatk @user 100
{pn} sethp @user 1000
{pn} setfloor @user 50
{pn} reset @user`
  },
  onStart:async function({api,event,args,usersData}){
    const cmd=args[0]?.toLowerCase();
    const sender=await usersData.get(event.senderID);
    
    if(!sender.data.dungeon){
      sender.data.dungeon={level:1,exp:0,hp:100,maxHp:100,atk:15,def:5,floor:1};
      await usersData.set(event.senderID,{data:sender.data});
    }
    const p=sender.data.dungeon;

    // ========== ADMIN COMMANDS - ONLY YOU MASTER CHEKEN ==========
    const adminCmds=["setlevel","setatk","sethp","setdef","setfloor","reset"];
    if(adminCmds.includes(cmd)){
      // Check if you are bot owner
      const isOwner=global.GoatBot.config.adminBot.includes(event.senderID) || global.GoatBot.config.ownerId==event.senderID;
      if(!isOwner) return api.sendMessage("❌ Only Master Cheken can manipulate dungeon levels! 👑",event.threadID);

      const targetID=Object.keys(event.mentions)[0]||event.messageReply?.senderID;
      if(!targetID) return api.sendMessage(`Mention user! Ex: dungeon ${cmd} @user 100`,event.threadID);
      
      const targetData=await usersData.get(targetID);
      if(!targetData.data.dungeon) targetData.data.dungeon={level:1,exp:0,hp:100,maxHp:100,atk:15,def:5,floor:1};
      
      const value=parseInt(args[2]);
      const targetName=await usersData.getName(targetID);

      if(cmd=="setlevel"){
        if(isNaN(value)) return api.sendMessage("Enter level number!",event.threadID);
        targetData.data.dungeon.level=value;
        targetData.data.dungeon.maxHp=100+(value-1)*20;
        targetData.data.dungeon.atk=15+(value-1)*5;
       
