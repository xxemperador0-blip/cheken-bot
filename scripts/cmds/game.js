module.exports = {
  config: {
    name: "game",
    version: "2.0",
    author: "Cheken",
    countDown: 5,
    role: 0,
    shortDescription: "Fun games",
    longDescription: "Play slot, dice, rps, coinflip, guess",
    category: "game",
    guide: "{pn} slot\n{pn} dice\n{pn} rps rock\n{pn} coinflip\n{pn} guess 5"
  },

  onStart: async function ({ api, event, args }) {
    const cmd = args[0]?.toLowerCase();

    if (!cmd) {
      return api.sendMessage(
`🎮 𝗚𝗔𝗠𝗘 𝗠𝗘𝗡𝗨 🎮
━━━━━━━━━━━━
1. !game slot - Slot machine 🎰
2. !game dice - Roll dice 🎲
3. !game rps rock/paper/scissors - RPS ✊
4. !game coinflip - Flip coin 🪙
5. !game guess [1-10] - Guess number 🔢

Play now!`, event.threadID);
    }

    // 1. SLOT
    if (cmd === "slot") {
      const items = ["🍒", "🍋", "⭐", "🔔", "💎", "7️⃣"];
      const a = items[Math.floor(Math.random()*items.length)];
      const b = items[Math.floor(Math.random()*items.length)];
      const c = items[Math.floor(Math.random()*items.length)];
      const win = a===b && b===c;
      return api.sendMessage(`🎰 𝗦𝗟𝗢𝗧 🎰\n\n[ ${a} | ${b} | ${c} ]\n\n${win ? "🎉 JACKPOT! YOU WIN! 🎉" : "😢 Try again!"}`, event.threadID);
    }

    // 2. DICE
    if (cmd === "dice") {
      const dice = Math.floor(Math.random()*6)+1;
      return api.sendMessage(`🎲 You rolled: ${dice} ${["","⚀","⚁","⚂","⚃","⚄","⚅"][dice]}`, event.threadID);
    }

    // 3. RPS
    if (cmd === "rps") {
      const user = args[1]?.toLowerCase();
      const choices = ["rock","paper","scissors"];
      if (!choices.includes(user)) return api.sendMessage("Use: game rps rock/paper/scissors", event.threadID);
      const bot = choices[Math.floor(Math.random()*3)];
      let result = "Draw! 🤝";
      if (user!==bot) {
        if ((user==="rock"&&bot==="scissors")||(user==="paper"&&bot==="rock")||(user==="scissors"&&bot==="paper")) result="You WIN! 🎉";
        else result="You LOSE! 😢";
      }
      return api.sendMessage(`✊ 𝗥𝗣𝗦 ✊\nYou: ${user}\nBot: ${bot}\n\n${result}`, event.threadID);
    }

    // 4. COINFLIP
    if (cmd === "coinflip" || cmd === "flip") {
      const flip = Math.random()<0.5 ? "Heads" : "Tails";
      return api.sendMessage(`🪙 Coinflip: ${flip} ${flip==="Heads"?"👑":"💰"}`, event.threadID);
    }

    // 5. GUESS
    if (cmd === "guess") {
      const userGuess = parseInt(args[1]);
      const secret = Math.floor(Math.random()*10)+1;
      if (!userGuess) return api.sendMessage("Guess a number 1-10\nEx: game guess 5", event.threadID);
      if (userGuess===secret) return api.sendMessage(`🔢 Number was ${secret}\n🎉 CORRECT! You are genius!`, event.threadID);
      else return api.sendMessage(`🔢 Number was ${secret}\n❌ Wrong! Your guess: ${userGuess}`, event.threadID);
    }

   
