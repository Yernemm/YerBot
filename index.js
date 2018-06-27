const Discord = require("discord.js");
const client = new Discord.Client();
const readline = require('readline');
const fs = require("fs");



const config = require("./config.json");
const m = require("./shared/methods.js");

var logChannelID = config.logChannelID;

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

client.on("message", message => {
	if(message.channel.id == config.spFrom){
		var d = message.createdAt;
		var timeS = d.getUTCFullYear() + "/" + m.lZero((d.getUTCMonth() + 1), 2) + "/" + m.lZero(d.getUTCDate(), 2) + " " + m.lZero(d.getUTCHours(), 2) + ":" + m.lZero(d.getUTCMinutes(), 2) + ":" + m.lZero(d.getUTCSeconds(), 2);
		client.channels.get(spTo).send(timeS + " " + message.author + ": " + message.content);
	}
  if (message.author.bot) return;
  if (message.channel.type != "text") return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  // This is the best way to define args. Trust me.
  const argsArr = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = argsArr.shift().toLowerCase().replace(/[^a-zA-Z ]/g, "");
  const argsTxt = message.content.slice(config.prefix.length + command.length).trim();
  const extraData = "";

  // The list of if/else is replaced with those simple 2 lines:
  try {
      
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(config, client, message, argsArr, argsTxt, extraData);
  } catch (err) {

    var err1 = "```" + err.stack + "```";
    var rawErr1 = err;
    try {
      
        let commandFile = require(`./commands/alias/${command}.js`);
        commandFile.run(config, client, message, argsArr, argsTxt, extraData);
      } catch (err) {
          var err2 = "```" + err + "```";
          var rawErr2 = err;

          if(rawErr2.code == 'MODULE_NOT_FOUND' && rawErr1.code == 'MODULE_NOT_FOUND'){

          }else{
            var msg = `***Some error occured!***\r\n<@${config.ownerID}> Check the logs for the detailed error message and fix it!!`;
            message.channel.send(msg);
            msg+= "\r\n\r\nERR1:\r\n" + err1;
            msg+= "\r\n\r\nERR2:\r\n" + err2;           
            m.log(config, client, message, msg, "e");
          };

       
      }


    //console.error(err1);
  }
});

client.login(config.token);