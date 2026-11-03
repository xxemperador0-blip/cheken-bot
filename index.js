const fs = require("fs-extra");
const path = require("path");
const login = require("@xaviabot/fca-unofficial");

// Load config and appstate
const config = require("./config.json");
const appState = require("./appstate.json");

const commands = new Map();
const cmdsPath = path.join(__dirname, "scripts", "cmds");

// Load all commands from scripts/cmds
if (fs.existsSync(cmdsPath)) {
  const files = fs.readdirSync(cmdsPath).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const cmd = require(path.join(cmdsPath, file));
      const name = cmd.config?.name || cmd.name || file.replace(".js", "");
      commands.set(name.toLowerCase(), cmd);
      console.log(`✅ Loaded: ${name}`);
    } catch (e) {
      console.log(`❌ Failed: ${file} - ${e.message}`);
    }
  }
} else {
  console.log("❌ scripts/cmds folder not found!");
}

console.log(`\n👑 CHEKEN BOT - ${commands.size} commands loaded!`);
console.log(`Prefix: ${config.prefix}\n`);

login({ appState }, (err, api) => {
  if (err) {
    console.error("LOGIN FAILED - appstate expired!", err);
    return;
  }

  console.log("🚀 CHEKEN BOT IS ONLINE! 👑");
  api.setOptions({ listenEvents: true, selfListen: false });

  api.listenMqtt((err, event) => {
    if (err) return console.error(err);
    if (event.type !== "message" && event.type !== "message_reply") return;

    const body = event.body || "";
    const prefix = config.prefix || "!";

    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    if (!cmdName) return;

    const command = commands.get(cmdName);
    if (!command) return;

    try {
      const ctx = { api, event, args, config, commands };
      if (command.onStart) command.onStart(ctx);
      else if (command.run) command.run(ctx);
      else if (typeof command === "function") command(ctx);
    } catch (e) {
      console.error(`Error in ${cmdName}:`, e);
      api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
    }
  });
});
