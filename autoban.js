const Discord = require("discord.js");
const m = require("./shared/methods.js");
const sqlite = require("sqlite");
function autoBanObject (rgx, reason){
  this.rgx = rgx;
  this.reason = reason;
}
var reasons = [];
exports.init = (config, client) => {

  reasons = [
    new autoBanObject(/discord.gg\//gi, "detected Discord link in username."),
    new autoBanObject(/twitch.tv\//gi, "detected Twitch link in username."),
    new autoBanObject(/twitter.com\//gi, "detected Twitter link in username."),
    new autoBanObject(/bit.ly\//gi, "detected Bitly link in username."),
    new autoBanObject(/goo.gl\//gi, "detected Googl link in username."),
    new autoBanObject(/paypal.me\//gi, "detected paypal link in username."),
    new autoBanObject(/senseibin/gi, "spam bot owner name."),
    new autoBanObject(/.com\//gi, "detected '.com' link in username."),
    new autoBanObject(/.me\//gi, "detected '.me' link in username."),
    new autoBanObject(/.org\//gi, "detected '.org' link in username."),
    new autoBanObject(/.net\//gi, "detected '.net' link in username."),
    new autoBanObject(/.+\..+\/.+/gi, "detected generic link in username.")
  ];

}
exports.dm = (config,client,message,modChannel) =>{
  
  if (message.author.bot) return;

  var theUserId = message.author.id;

  const dbp = sqlite.open("./yerFiles/db/autoban.sqlite")
          .then(sql => {
            sql.get(`SELECT * FROM sqlite_master WHERE type='table' AND name="${theUserId}"`)
            .then(tab=>{
              
              console.log(tab);
              if(tab){
                sql.all(`SELECT * FROM "${theUserId}"`)
                .then(rows=>{
                  rows.forEach(row =>{
                   var modCh = client.guilds.get(row.guildID).channels.find(val => val.name == modChannel);
                   if(modCh != null){

                    
            const embed = new Discord.RichEmbed()
            .setAuthor(message.author.username + "#" + message.author.discriminator, client.user.avatarURL)
            .setTitle("Yer-Bot auto-ban appeal message:")
            .setThumbnail(message.author.avatarURL)
            .setColor(0xff8800)
            .setTimestamp()
            .setDescription(message.content)
            .addField("User info:", `Name: ${message.author.username}#${message.author.discriminator}\nID: ${theUserId}\nBan Reason: ${row.reason}`);
            

            modCh.send(embed)
            .then(()=>{
              message.channel.send("Message relayed to **" + modCh.guild.name + "**")
            });

                   }
                 
                  })

                  sql.run(`DROP TABLE "${theUserId}"`);
                })
                .catch
              }
                
                
                
            })
            .catch();
          })
          .catch();

}
exports.memberJoin = (config, client, member, modChannel) => {
  if(member.guild.id == "503377403956035584")
  return; //Ban Appeals server.
  
  reasons.forEach(b =>{

    if (b.rgx.test(member.user.username)) {
      
      switch (member.guild.id) {
        //Add cases here to not auto-ban.
        default:
        
        if(member.bannable){

     
          var banLog = `"${member.user.username}#${member.user.discriminator}" with ID \`${member.id}\` [ <@${member.id}> ] in ${member.guild.name} with guild ID \`${member.guild.id}\` for reason: ${b.reason}`;
             
          const embed = new Discord.RichEmbed()
          .setAuthor("YerBot Auto-ban", client.user.avatarURL)
          .setTitle(member.guild.name)
          .setThumbnail(member.guild.iconURL)
          .setColor(0xaa2222)
          .setTimestamp()
          .setDescription(`You have been auto-banned from **${member.guild.name}**.\nReason: **${b.reason}**\n\nIf you think this is a mistake, send me a message below. This will be relayed to the moderators of all servers you have been auto-banned from so far.\nDo not send more than one message as only the first one will be sent.\n\nIf you are unable to send an appeal message because you no longer share a common server with YerBot, join this server in order to continue with the appeal process. https://discord.gg/9vREGQw`);
          
         
            m.logNoMsg(config, client, `**User auto-banned** ${banLog}`)
            
            member.user.send({embed}).then(()=>{
              banSequence(config, client, member, modChannel, b, true);
            })
            .catch(()=>{
              banSequence(config, client, member, modChannel, b, false);
            });

        }
      
        }
            
    }
    
  })
}
function banSequence(config, client, member, modChannel, b, appealSent){
  member.ban("[AutoBan][YerBot]: " + b.reason)
              .then(() => {
      
      
      
      
                const dbp = sqlite.open("./yerFiles/db/autoban.sqlite")
                .then(sql => {
               
                  sql.run(`CREATE TABLE IF NOT EXISTS "${member.user.id}" (guildID TEXT, reason TEXT)`)
                  .then(()=>{
                  
                    sql.run(`DELETE FROM "${member.user.id}" WHERE guildID IS ?`, [member.guild.id])
                    .then(() =>{
                     
                      sql.run(`INSERT INTO "${member.user.id}" (guildID, reason) VALUES (?, ?)`, [member.guild.id, b.reason])
                      .then(()=>{
                      
      
        
                      })
                      .catch()
                    })
                    .catch()         
                  })
                  .catch()
                  
                  let shortDesc =`Name: ${member.user.username}#${member.user.discriminator}\nID: ${member.id}\nBan Reason: ${b.reason}`;
                  if(!appealSent)
                  shortDesc += `\n\n**Appeal message has not been sent to the user due to their privacy settings.**`
      
                  var modCh = member.guild.channels.find(val => val.name == modChannel);
                  if(modCh != null){
                    const embed = new Discord.RichEmbed()
                    .setAuthor("YerBot Auto-ban", client.user.avatarURL)
                    .setTitle(member.guild.name)
                    .setThumbnail(member.user.avatarURL)
                    .setColor(0xaa2222)
                    .setTimestamp()
                    .setDescription(shortDesc);         
                
                
                    modCh.send({embed});
                  }
      
      
                 
      
                  
      
                })
                .catch();
              
                 //DELETE THE THING BELOW FOR THE FINAL VERSION
            //member.guild.unban(member.user);
            
            //-------------------
             
                })
                .catch(() => m.logNoMsg(config, client, `**ERROR COULD NOT BAN** ${banLog}`));
                
    
}