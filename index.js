import Settings from './config.js';
import axios from "axios";

let data;
axios.get("https://api.github.com/gists/92787e502ca6a3babe43c3a20ff9a4ec").then(response => {
  data = JSON.parse(response.data.files['users.json'].content);
  ChatLib.chat('&c[NopeAddons] Initialized player data!');
});

const colourCodes = {
  'White': '&f',
  'Yellow': '&e',
  'Green': '&a',
  'DarkGreen': '&2',
  'Aqua': '&b',
  'Cyan': '&3',
  'Blue': '&1',
  'Pink': '&d',
  'Purple': '&5',
  'Gold': '&6',
  'Red': '&c',
  'DarkRed': '&4',
  'Black': '&0'
}

let botReplacement = '[BOT]'

register("step", () => {
  if (botReplacement != '[BOT]') {
    if (botReplacement == 0) {
      botReplacement = '[BOT]'
    }
    else {
      botReplacement -= 1;
    }
  }
}).setDelay(1);

let lastMessage = null;
register("messageSent", (message, event) => {
  lastMessage = message;
});

register("chat", (message, event) => {
  ChatLib.say(`${lastMessage} ･･`);
  lastMessage = `${lastMessage} ･･`;
  cancel(event);
}).setCriteria("&cYou cannot say the same message twice!&r");

register("chat", (player) => {
  if (Settings.welcomeMessage === true) {
      setTimeout(() => {
          ChatLib.say(Settings.welcomeMessageText + " " + player);
      }, 1500);
  }
}).setCriteria("Guild > ${player} joined.");

register("chat", (message, event) => {
  let send = false;
  if (message.includes(Settings.botName)) {
    message = message.replace(/&r/g, "");
    if (match = message.match(/Sorry (\S+), the pond is empty! Please wait (\d+) seconds to fish again./)) {
      if (match[1] == Player.getName()) {
        botReplacement = match[2];
      }
    }
    cancel(event);
    message = message.replaceAll(Settings.botName, '&9' + botReplacement + '&r');
    send = true;
  }
  for (player of data) {
    if (message.includes(player.username)) {
      message = message.replace(/&r/g, "");
      if (player.prefix) {
        if (player.color) {
          message = message.replaceAll(player.username, colourCodes[player.color] + player.prefix + ' ' + player.username + '&r');
        }
        else {
          message = message.replaceAll(player.username, player.prefix + ' ' + player.username + '&r');
        }
      }
      if (player.color) {
        message = message.replaceAll(player.username, colourCodes[player.color] + player.username + '&r');
      }
      cancel(event);
      send = true
    }
  }
  if (send == true) {
    ChatLib.chat(message);
  }
}).setCriteria("&r${message}");

register("step", () => {
  if (data) {
    World.getAllPlayers().forEach((player) => {
      let username = player.name;
      let send = false;
      for (user of data) {
        if (username.includes(user.username)) {
          if (user.prefix) {
            if (user.color) {
              username = username.replaceAll(user.username, colourCodes[user.color] + user.prefix + ' ' + user.username);
            }
            else {
              username = username.replaceAll(user.username, user.prefix + ' ' + user.username);
            }
          }
          if (user.color) {
            username = username.replaceAll(user.username, colourCodes[user.color] + user.username + '&r');
          }
          send = true
        }
      }
    if (send == true) {
      player.setTabDisplayName(new TextComponent(username));
      player.setNametagName(new TextComponent(username));
    }
    });
  }
})

register("ItemTooltip", (tooltip, item, event) => {
  const lore = item.getLore();
  let send = false;
  let lines = [];
  for (let line of lore) {
    for (player of data) {
      if (line.includes(player.username) && !line.includes(player.prefix)) {
        if (player.prefix) {
          if (player.color) {
            line = line.replaceAll(player.username, colourCodes[player.color] + player.prefix + ' ' + player.username);
          }
          else {
            line = line.replaceAll(player.username, player.prefix + ' ' + player.username);
          }
        }
        if (player.color) {
          line = line.replaceAll(player.username, colourCodes[player.color] + player.username + '&r');
        }
        cancel(event);
        send = true
      }
    }
    lines.push(line);
  }
  lines.shift();
  if (send == true) {
    item.setLore(lines.join('\n'));
  }
}) 


register("command", () => {
  Settings.openGUI();
}).setName(`nope`, true);

register("command", () => {
  axios.get("https://api.github.com/gists/92787e502ca6a3babe43c3a20ff9a4ec").then(response => {
  data = JSON.parse(response.data.files['users.json'].content);
  ChatLib.chat('&c[NopeAddons] Updated player data!');
  });
}).setName('update', true);
