const axios = require("axios");

module.exports = {
  config: {
    name: "ai",
    version: "1.0",
    author: "Cheken",
    countDown: 3,
    role: 0,
    shortDescription: "ChatGPT",
    longDescription: "Ask anything to AI",
    category: "ai",
    guide: "{pn} [question]\nExample: {pn} who are you?"
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❓ | Please ask something!\n\nExample: ai what is love?", event.threadID, event.messageID);
    }

    api.sendMessage("🤖 | AI is thinking...", event.threadID, event.messageID);

    try {
      // FREE GPT API
      const res = await axios.get(`https://api.kaiz-apis.gleeze.com/api/gpt-4o?ask=${encodeURIComponent(prompt)}&uid=${event.senderID}&apikey=a8haik-k-8ec3b0f8-ae27-4a50-b77c-60a27aed59a`);

      const reply = res.data.response || res.data.reply || "No response from AI.";

      api.sendMessage(reply, event.threadID, event.messageID);

    } catch (e) {
      // backup api if first fails
      try {
        const res2 = await axios.get(`https://api.vreden.my.id/api/v1/chat/gpt?prompt=${encodeURIComponent(prompt)}`);
        api.sendMessage(res2.data.result, event.threadID, event.messageID);
      } catch {
        api.sendMessage("❌ AI error, try again later.", event.threadID, event.messageID);
      }
    }
  }
};
