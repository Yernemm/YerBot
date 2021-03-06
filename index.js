const Discord = require("discord.js");
const client = new Discord.Client();
const readline = require('readline');
const fs = require("fs");



const config = require("./config.json");
const m = require("./shared/methods.js");

const modChannel = "yerbot-mod";

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

client.on("guildMemberAdd", (member) => {
  //When new user joins
  m.logNoMsg(config, client, `New user "${member.user.username}#${member.user.discriminator}" with ID \`${member.id}\` [ <@${member.id}> ] joining ${member.guild.name} with guild ID \`${member.guild.id}\``);

  //Auto ban
  
  //ALL-RIGHT LISTEN UP
  //I'm lazy and the code below is awful, I'll improve it one day maybe...

  let autoBanner = require("./autoban.js");
  autoBanner.memberJoin(config, client, member, modChannel);

  




});








client.on("message", message => {
  if (message.channel.id == config.spFrom) {
    var d = message.createdAt;
    var timeS = d.getUTCFullYear() + "/" + m.lZero((d.getUTCMonth() + 1), 2) + "/" + m.lZero(d.getUTCDate(), 2) + " " + m.lZero(d.getUTCHours(), 2) + ":" + m.lZero(d.getUTCMinutes(), 2) + ":" + m.lZero(d.getUTCSeconds(), 2);
    client.channels.get(spTo).send(timeS + " " + message.author + ": " + message.content);
  }


  //Delete mee6 welcomes from banned users
  if(message.author.bot){
  
    if(true){
      //used to be   message.author.username == "MEE6"
      //Wait 2 seconds after mee6 message sent to ensure the user has been banned already.
      //Potential race condition between yerbot and mee6, can potentially fail sometimes.
      const util = require('util');
      const timeoutPromise = util.promisify(setTimeout);
    
     
        
        if(message.content.includes("<@") && message.content.includes(">") && message.channel.name.includes("welcome"))
        {
          timeoutPromise(2500).then(()=>{ 


            //RegEx magic to get the ID
          var welcomeID = /<@!?([0-9]{15,20})>/.exec(message.content)[1]
          message.guild.fetchBans()
          .then(bans =>{

            if(bans.has(welcomeID))
            {
              //The user mentioned in the welcome has in fact been banned...
              m.log(config, client, message, "**MESSAGE DELETED BECAUSE USER BANNED**");
              if(message.deletable)
                message.delete();
            }

          }).catch((err) => {console.log("fetching bans failed"+err)});


          }).catch((err) => {console.log("timeout failed"+err)});
          
        }
      
    }
  }

  if (message.channel.type == "dm"){
    let autoBanner = require("./autoban.js");
    autoBanner.dm(config, client, message, modChannel);
  }

  if (message.author.bot) return;
  if (message.channel.type != "text") return;
  if (message.content.indexOf(config.prefix) !== 0) return;

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

      if (rawErr2.code == 'MODULE_NOT_FOUND' && rawErr1.code == 'MODULE_NOT_FOUND') {

      } else {
        var msg = `***Some error occured!***\r\n<@${config.ownerID}> Check the logs for the detailed error message and fix it!!`;
        message.channel.send(msg);
        msg += "\r\n\r\nERR1:\r\n" + err1;
        msg += "\r\n\r\nERR2:\r\n" + err2;
        m.log(config, client, message, msg, "e");
      };


    }


    //console.error(err1);
  }
});

client.on('error', error => {
  console.error('The WebSocket encountered an error:', error);
});

client.login(config.token);