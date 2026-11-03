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
    version:"2.0",
    author:"Cheken",
    countDown:5,
    role:0,
    category:"game",
    guide:"{pn}\n{pn} stats\n{pn} fight\n{pn} heal\n{pn} leaderboard"
  },
  onStart:async function({api,event,args,usersData}){
    const cmd=args[0]?.toLowerCase();
    const sender=await usersData.get(event.senderID);
    
    // Init player data
    if(!sender.data.dungeon){
      sender.data.dungeon={
        level:1,
        exp:0,
        hp:100,
        maxHp:100,
        atk:15,
        def:5,
        floor:1
      };
      await usersData.set(event.senderID,{data:sender.data});
    }
    const p=sender.data.dungeon;

    if(!cmd){
      return api.sendMessage(
`🏰 𝗗𝗨𝗡𝗚𝗘𝗢𝗡 𝗥𝗣𝗚 🏰
━━━━━━━━━━━━
!dungeon stats - Your stats
!dungeon fight - Fight monster
!dungeon heal - Heal HP ($100)
!dungeon leaderboard - Top players

You: Lv.${p.level} | Floor ${p.floor}
For Master Cheken 👑
`,event.threadID);
    }

    if(cmd=="stats"){
      return api.sendMessage(
`⚔️ 𝗬𝗢𝗨𝗥 𝗦𝗧𝗔𝗧𝗦 ⚔️
━━━━━━━━━━━━
👑 ${await usersData.getName(event.senderID)}
⭐ Level: ${p.level}
❤️ HP: ${p.hp}/${p.maxHp}
🗡️ ATK: ${p.atk}
🛡️ DEF: ${p.def}
✨ EXP: ${p.exp}/${p.level*100}
🏰 Floor: ${p.floor}
💰 Money: $${sender.money||0}

${p.hp<=0?"💀 YOU ARE DEAD! Use !dungeon heal":"✅ Ready to fight!"}
`,event.threadID);
    }

    if(cmd=="heal"){
      if(p.hp>=p.maxHp) return api.sendMessage("❤️ HP already full!",event.threadID);
      if((sender.money||0)<100) return api.sendMessage("❌ Need $100 to heal! Do !daily",event.threadID);
      p.hp=p.maxHp;
      await usersData.set(event.senderID,{money:sender.money-100,data:sender.data});
      return api.sendMessage(`💖 Healed! HP: ${p.hp}/${p.maxHp} (-$100)`,event.threadID);
    }

    if(cmd=="fight"){
      if(p.hp<=0) return api.sendMessage("💀 You are dead! Heal first: !dungeon heal",event.threadID);
      
      // Pick monster based on floor
      const monsterIndex=Math.min(Math.floor(p.floor/2),monsters.length-1);
      const monster=JSON.parse(JSON.stringify(monsters[monsterIndex]));
      
      let battleLog=`⚔️ FLOOR ${p.floor} - You vs ${monster.name}!\n━━━━━━━━━━━━\n`;
      
      // Fight loop
      while(p.hp>0 && monster.hp>0){
        // Player attack
        const playerDmg=Math.max(1,p.atk - Math.floor(Math.random()*3));
        monster.hp-=playerDmg;
        battleLog+=`🗡️ You hit ${monster.name} -${playerDmg} HP\n`;
        if(monster.hp<=0) break;
        
        // Monster attack
        const monsterDmg=Math.max(1,monster.atk - p.def + Math.floor(Math.random()*5));
        p.hp-=monsterDmg;
       
