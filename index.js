const fs = require("fs-extra");
const path = require("path");
let login;
try {
  login = require("@xaviabot/fca-unofficial");
} catch { login = require("fca-unofficial"); }

const config = require("./config.json");

// Try to load appstate OR account.txt
let appState = null;
if (fs.existsSync("./appstate.json")) {
  appState = require("./appstate.json");
  console.log("Using appstate.json");
} else if (fs.existsSync("./account.txt")) {
  try {
    const txt = fs.readFileSync("./account.txt", "utf8");
    appState = JSON.parse(txt);
    console.log("Using account.txt");
  } catch (e) {
    console.log("account.txt is not JSON, trying as text");
    appState = fs.readFileSync("./account.txt", "utf8");
  }
} else {
  console.log("❌ No appstate.json or account.txt found!");
}

const commands = new Map();
const cmdsPath = path.join(__dirname, "scripts", "cmds");

if (fs.existsSync(cmdsPath)) {
  const files = fs.readdirSync(cmdsPath).filter(f => f.endsWith(".js"));
  for (const file of files) {
    try {
      const cmd = require(path.join(cmdsPath, file));
      const name = cmd.config?.name || file.replace(".js", "");
      commands.set(name.toLowerCase(), cmd);
      console.log(`✅ Loaded: ${name}`);
    } catch (e) {}
  }
}

console.log(`\n👑 CHEKEN BOT - ${commands.size} commands! Prefix: ${config.prefix}\n`);

login({ appState }, (err, api) => {
  if (err) {
    console.error("LOGIN FAILED!", err);
    return;
  }
  console.log("🚀 CHEKEN BOT IS ONLINE! 👑");
  api.setOptions({ listenEvents: true, selfListen: false });
  api.listenMqtt((err, event) => {
    if (err) return;
    if (event.type !== "message" && event.type !== "message_reply") return;
    const body = event.body || "";
    if (!body.startsWith(config.prefix)) return;
    const args = body.slice(config.prefix.length).trim().split(/ +/);
    const cmdName = args.shift()?.toLowerCase();
    const command = commands.get(cmdName);
    if (!command) return;
    try {
      const ctx = { api, event, args, config, commands };
      if (command.onStart) command.onStart(ctx);
      else if (command.run) command.run(ctx);
    } catch (e) {
      api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
    }
  });
});
