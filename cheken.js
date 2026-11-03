module.exports = {
  config: {
    name: "emperor",
    version: "2.0",
    author: "Cheken",
    countDown: 5,
    role: 0,
    shortDescription: "Owner info",
    longDescription: "Show owner info with style",
    category: "owner",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, usersData }) {
    const userName = await usersData.getName(event.senderID);
    
    const msg = `👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑
━━━━━━━━━━━━━━━━━━
👤 Name: Emperor Cheken
🌐 Facebook: fb.com/xxemperador0
🤖 Bot Name: Cheken Bot
⚡ Prefix: !
📦 Version: 2.0
━━━━━━━━━━━━━━━━━━
💬 Hello ${userName}!
Thanks for using my bot! Type !help to see all commands.

✨ Created with love by Emperor`;

    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
