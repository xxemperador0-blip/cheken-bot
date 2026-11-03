module.exports = function(text, type) {
  if (type === "error") console.log("[ERROR]", text);
  else console.log(text);
};

module.exports.log = (msg) => console.log(msg);
module.exports.info = (msg) => console.log(msg);
module.exports.warn = (msg) => console.log(msg);
module.exports.error = (msg) => console.log("[ERROR]", msg);
