
//METADATA
exports.cmdtype = () => {
    return "moderation";
}

const desc = "Archives all messages in a text channel."; //Short description of what the command does.
const usage = "<channel id>"; //Any parameters required for command.
exports.run = (config, client, message, argsArr, argsTxt, extraData) => {
    const bot = client;
    const m = require("./../shared/methods.js");
    const fs = require("fs");
    //--------------------------------------------------------------------
    //Uncomment for protected owner-only command.
    //if(message.author.id !== config.ownerID) return; 
    //--------------------------------------------------------------------
    var msg = ""; //Put response message to be logged here.
    //--------------------------------------------------------------------

    //COMMAND LOGIC HERE:


    switch (message.author.id) {

        case "157588344363024385":

            var channelID = argsArr[0];

            //Check if the channel exists before doing anything else.
            if(bot.channels.get(channelID)){

            // var chan = bot.channels.get(channelID).fetchMessages().array();
            // console.log(chan);
                var chn = bot.channels.get(channelID);

                var timeArchived = m.formDateUTC();

            var requestNum = "archive--" + chn.guild.name + "--" + chn.name + "--" + timeArchived;
            message.channel.send("Collecting messages...\r\nRequest: \r\n**" + requestNum + "**");





            var lim = 100;
            var bef = "";


            getAllMsg();

            async function getAllMsg() {
                var msges = [];
                var allMsg = "";

                //for(var i = 1; i<=2; i++){
                do {

                    msges = await waiting();
                    msges.forEach(element => {

                        var dc = new Date(element.createdTimestamp);

                        allMsg = "[" + dc.getUTCFullYear() + "/" + m.lZero((dc.getUTCMonth() + 1), 2) + "/" + m.lZero(dc.getUTCDate(), 2) + " " + m.lZero(dc.getUTCHours(), 2) + ":" + m.lZero(dc.getUTCMinutes(), 2) + ":" + m.lZero(dc.getUTCSeconds(), 2) + "] " + element.author.username + "#" + element.author.discriminator + ": " + element.content + "\r\n" + allMsg;

                        //allMsg = element.content + "\r\n" + allMsg;
                    });
                    //console.log(msges.length);                    
                } while (msges.length == lim + 1);

                var msgs = "ARCHIVED BY YERBOT [ http://yernemm.xyz ]\r\n----------------------------\r\nALL DATES ARE IN yyyy/mm/dd FORMAT AND IN THE UTC TIMEZONE\r\nCHANNEL NAME: " + bot.channels.get(channelID).name + "\r\nSERVER NAME: " + bot.channels.get(channelID).guild.name + "\r\nARCHIVE CREATED: " + m.formDate() + "\r\n---------------------\r\n" + allMsg;


                //console.log(msgs);

                fs.writeFileSync("yerFiles//temp//" + requestNum + ".txt", msgs);
                var msg = "Archive Done!\r\n----------------------\r\nServer: **" + chn.guild.name +"**\r\nChannel: **" + chn.name + "**\r\nArchived: **" + timeArchived + "**\r\n----------------------";
                message.channel.send(msg, {
                    files: [
                        "yerFiles//temp//" + requestNum + ".txt"
                    ]
                });
                m.log(config, client, message, msg);
            }


            async function waiting() {
                var theMessage = "";
                var messageContent = await bot.channels.get(channelID).fetchMessages({ limit: lim, before: bef }).then(messages => {
                    var msg = [];
                    var counter = 0;
                    messages.forEach(element => {
                        counter++;
                        msg[counter] = element;

                        if (counter == lim) bef = element.id;
                    })
                    theMessage = msg;

                });
                return theMessage;
                // console.log(messageContent);
            }


        } else {
            var msg = "**Channel not found.**\r\n\r\nPlease specify a valid channel ID to a channel in which YerBot has the **read messages** and **read message history** permissions. The channel ID can be found by right-clicking on a channel in the channel list and clicking **Copy ID**.\r\n\r\nUseage: >archive [Channel ID]";
            message.channel.send(msg);
            m.log(config, client, message, msg);

        }

            break;

        default:
            var msg = "Temporarily, only certain users can use this command due to its resource-intensive nature.";
            message.channel.send(msg);
            m.log(config, client, message, msg);
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