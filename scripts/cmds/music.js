const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "music",
    aliases: ["song", "play"],
    version: "1.0",
    author: "Cheken",
    countDown: 10,
    role: 0,
    shortDescription: "Download music",
    longDescription: "Search and download music from YouTube",
    category: "media",
    guide: "{pn} [song name]\nEx: {pn} despacito"
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) return api.sendMessage("🎵 | Please enter song name!\nEx: music despacito", event.threadID, event.messageID);

    api.sendMessage(`🔍 Searching: ${query}...`, event.threadID, event.messageID);

    try {
      // FREE MUSIC API
      const res = await axios.get(`https://api.vreden.my.id/api/ytplaymp3?query=${encodeURIComponent(query)}`);
      
      const data = res.data.result;
      const title = data.title;
      const downloadUrl = data.download.url;
      
      const filePath = path.join(__dirname, "cache", `${Date.now()}.mp3`);
      await fs.ensureDir(path.join(__dirname, "cache"));

      const audio = await axios.get(downloadUrl, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, Buffer.from(audio.data));

      await api.sendMessage({
        body: `🎵 𝗠𝗨𝗦𝗜𝗖\n\n🎶 Title: ${title}\n🔍 Search: ${query}\n\nEnjoy! 🎧`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, event.messageID);

      await fs.unlink(filePath);

    } catch (e) {
      console.log(e);
      api.sendMessage("❌ Music error. Try other song or try again later.\nTip: Use English song name.", event.threadID, event.messageID);
    }
  }
};
