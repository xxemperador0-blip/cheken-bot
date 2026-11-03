const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "welcome",
    version: "2.0",
    author: "Cheken",
    category: "events"
  },

  onStart: async function ({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;

    const added = event.logMessageData.addedParticipants;
    const threadInfo = await api.getThreadInfo(event.threadID);

    for (let user of added) {
      if (user.userFbId == api.getCurrentUserID()) continue;

      const userID = user.userFbId;
      const name = user.fullName;
      
      try {
        // 1. Create cache folder
        const cachePath = path.join(__dirname, "cache");
        await fs.ensureDir(cachePath);
        const bgPath = path.join(cachePath, `welcome_${userID}.png`);

        // 2. Download user avatar
        const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        const avatarRes = await axios.get(avatarUrl, { responseType: "arraybuffer" });
        const avatarPath = path.join(cachePath, `avt_${userID}.png`);
        await fs.writeFile(avatarPath, Buffer.from(avatarRes.data));

        // 3. Create canvas
        const canvas = createCanvas(800, 400);
        const ctx = canvas.getContext("2d");

        // Background - gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 400);
        gradient.addColorStop(0, "#667eea");
        gradient.addColorStop(1, "#764ba2");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 400);

        // Load avatar
        const avatar = await loadImage(avatarPath);
        
        // Draw circle avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(200, 200, 120, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 80, 80, 240, 240);
        ctx.restore();

        // White border for avatar
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(200, 200, 120, 0, Math.PI * 2);
        ctx.stroke();

        // Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 36px Arial";
        ctx.fillText(`WELCOME!`, 400, 130);
        
        ctx.font = "bold 28px Arial";
        ctx.fillText(name, 400, 190);
        
        ctx.font = "20px Arial";
        ctx.fillText(`to ${threadInfo.threadName}`, 400, 230);
        ctx.fillText(`You are ${threadInfo.participantIDs.length}th member!`, 400, 265);
        ctx.fillText(`Enjoy! Type !help`, 400, 300);

        // Save
        const buffer = canvas.toBuffer("image/png");
        await fs.writeFile(bgPath, buffer);

        // Send with picture
        await api.sendMessage({
          body: `👋 Welcome ${name} to ${threadInfo.threadName} 🎉\nYou're member #${threadInfo.participantIDs.length}!`,
          attachment: fs.createReadStream(bgPath)
        }, event.threadID);

        // Clean
        await fs.unlink(avatarPath);
        await fs.unlink(bgPath);

      } catch (e) {
        console.log(e);
        api.sendMessage(`👋 Welcome ${name} to ${threadInfo.threadName} 🎉\nYou're #${threadInfo.participantIDs.length}!`, event.threadID);
      }
    }
  }
};
