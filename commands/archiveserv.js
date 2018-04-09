
//METADATA
exports.cmdtype = () => {
    return "moderation";
}
const desc = "Archives all messages sent in all channels the bot has access to, in a server."; //Short description of what the command does.
const usage = "<server id>"; //Any parameters required for command.
exports.run = (config, client, message, argsArr, argsTxt, extraData) => {
    const bot = client;
    const m = require("./../shared/methods.js");
    const fs = require('fs');
    //--------------------------------------------------------------------
    //Uncomment for protected owner-only command.
    //if(message.author.id !== config.ownerID) return; 
    //--------------------------------------------------------------------
    var msg = ""; //Put response message to be logged here.
    //--------------------------------------------------------------------

    //COMMAND LOGIC HERE:


    switch (message.author.id) {

        case "157588344363024385":

            var guildID = argsArr[0];

            //Check if the channel exists before doing anything else.
            if(bot.guilds.get(guildID)){

            // var chan = bot.channels.get(channelID).fetchMessages().array();
            // console.log(chan);
            //    var chn = bot.channels.get(channelID);

                var timeArchived = m.formDateUTC();


            var lim = 100;
            var bef = "";


            archServ();

            async function archServ(){
                var chanNames = "";

                var chanColl = bot.guilds.get(guildID).channels;

                var channNum = 0;

                chanColl.forEach(element =>{
                    if(element.type == "text"){
                    chanNames += "\r\n**" + element.name + "**";
                    channNum++;
                    }
                });

                message.channel.send("==================================================\r\n==================================================");
                message.channel.send("Server: **" + bot.guilds.get(guildID).name + "**\r\nChannels found:" + chanNames);
                message.channel.send("Starting...");

                var count = 1;
                await chanColl.forEach(async element =>{
                    var chn = element;
                    var requestNum = "archive--" + chn.guild.name + "--" + chn.name + "--" + timeArchived;
                   // message.channel.send("Collecting messages...\r\nRequest: \r\n**" + requestNum + "**");
                    var vals = await getAllMsg(element.id, requestNum);
                    message.channel.send(vals[0] + "\r\n\r\n**Progress: " + count + "/" + channNum + "**", {
                        files: [
                            vals[1]
                        ]
                    });
                    count++;
                });
              //  message.channel.send("***ALL CHANNELS ARCHIVED!***");
              //  message.channel.send("==================================================\r\n==================================================");
            }

            async function getAllMsg(chnl, requestNum) {
                var channelID = chnl;
                var chn = bot.channels.get(chnl);
                var msges = [];
                var allMsg = "";

                //for(var i = 1; i<=2; i++){
                do {

                    msges = await waiting(chnl);
                    try{
                    msges.forEach(element => {

                        var dc = new Date(element.createdTimestamp);

                        allMsg = "[" + dc.getUTCFullYear() + "/" + m.lZero((dc.getUTCMonth() + 1), 2) + "/" + m.lZero(dc.getUTCDate(), 2) + " " + m.lZero(dc.getUTCHours(), 2) + ":" + m.lZero(dc.getUTCMinutes(), 2) + ":" + m.lZero(dc.getUTCSeconds(), 2) + "] " + element.author.username + "#" + element.author.discriminator + ": " + element.content + "\r\n" + allMsg;

                        //allMsg = element.content + "\r\n" + allMsg;
                    });
                }catch(err){
                    
                    msges.forEach(element => {

                        allMsg += element;

                     });

                     allMsg += "\r\n" + err;
                };
                    //console.log(msges.length);                    
                } while (msges.length == lim + 1);

                var msgs = "ARCHIVED BY YERBOT [ http://yernemm.xyz ]\r\n----------------------------\r\nALL DATES ARE IN yyyy/mm/dd FORMAT AND IN THE UTC TIMEZONE\r\nCHANNEL NAME: " + bot.channels.get(channelID).name + "\r\nSERVER NAME: " + bot.channels.get(channelID).guild.name + "\r\nARCHIVE CREATED: " + m.formDate() + "\r\n---------------------\r\n" + allMsg;


                //console.log(msgs);

                fs.writeFileSync("yerFiles//temp//" + requestNum + ".txt", msgs);
                var msg = "Channel Archived!\r\n----------------------\r\nServer: **" + chn.guild.name +"**\r\nChannel: **" + chn.name + "**\r\nArchived: **" + timeArchived + "**\r\n----------------------";
                
                var vals = [msg, "yerFiles//temp//" + requestNum + ".txt"];
                    return vals;

                    m.log(config, client, message, msg);
            }


            async function waiting(chnl) {
                var theMessage = "";
                var messageContent = await bot.channels.get(chnl).fetchMessages({ limit: lim, before: bef }).then(messages => {
                    var msg = [];
                    var counter = 0;
                    messages.forEach(element => {
                        counter++;
                        msg[counter] = element;

                        if (counter == lim) bef = element.id;
                    })
                    theMessage = msg;

                })
                .catch(err =>{
                    theMessage = ["ERROR READING CHANNEL DATA:\n\r" + err];
                    message.channel.send("***ERROR ARCHIVING THE " + bot.channels.get(chnl).name + " CHANNEL!***");
                });
                return theMessage;
                // console.log(messageContent);
            }


        } else {
            var msg = "**Server not found.**\r\n\r\nPlease specify a valid Server ID to a server in which YerBot has the **read messages** and **read message history** permissions. The server ID can be found by right-clicking on a server icon in the server list and clicking **Copy ID**.\r\n\r\nUseage: >archive [Server ID]";
            m.logSend(config, client, message, msg);

        }

            break;

        default:
            var msg = "Temporarily, only certain users can use this command due to its resource-intensive nature.";
            m.logSend(config, client, message, msg);
            break;
    }


    //--------------------------------------------------------------------
    //m.logSend(config, client, message, msg); //Method will send msg to user, and also log it in both console AND log channel.
    //m.log(config, client, message, msg); //Alternative will log msg without sending msg.
}
exports.desc = () =>{
    return desc;
}
exports.use = () =>{
    return usage;
}