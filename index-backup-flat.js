const Discord = require("discord.js");
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var readToken = fs.readFileSync('yerFiles//token.txt', 'utf8').split('\r\n');
var logChannelID = fs.readFileSync('yerFiles//logchannel.txt', 'utf8').split('\r\n')[0];

var timeStart = 0;

console.log(logChannelID);
var token = readToken[0];
const prefix = ">";

var bot = new Discord.Client({ autoReconnect: true });




bot.on('ready', () => {
    bot.user.setPresence({ status: 'online', game: { name: '>help | yernemm.xyz' } });
    var d = new Date();
    timeStart = d.getTime();
    var msg = "--------------------------------------------------------------------------------------\r\n------" + "[" + d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + "] " + "YERBOT [NODE JS] STARTED------";
    console.log(msg);
    bot.channels.get(logChannelID).send(msg);

});


bot.on("message", message => {


    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(prefix)) return;



    var argsArr = message.content.substring(prefix.length).split(" ");
    var cmd = argsArr[0].toLowerCase();
    var args = message.content.substring(prefix.length + argsArr[0].length).trim();

    var d = new Date();
    var logMsg = "";

    logMsg += "[" + d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + "] " + message.guild + " | " + message.channel.name + ": \r\n\t" + message.author + "\r\n\t" + message.author.username + "#" + message.author.discriminator + " : " + message.content + "\r\n\tResponse: ";

    function formDate() {

        return lZero(d.getUTCDate(), 2) + "/" + lZero((d.getUTCMonth() + 1), 2) + "/" + d.getUTCFullYear() + " " + lZero(d.getUTCHours(), 2) + ":" + lZero(d.getUTCMinutes(), 2) + ":" + lZero(d.getUTCSeconds(), 2);
    }

    function formDateUTC() {
        return d.getUTCFullYear() + "-" + lZero((d.getUTCMonth() + 1), 2) + "-" + lZero(d.getUTCDate(), 2) + "_" + lZero(d.getUTCHours(), 2) + "-" + lZero(d.getUTCMinutes(), 2) + "-" + lZero(d.getUTCSeconds(), 2);
    }


    try {

        switch (cmd) {
            case "hello":
            case "hi":
            case "hey":
                var name = message.guild.member(message.author).nickname;
                if (name === null) name = message.author.username;
                var msg = "Hello " + name + "!";
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "torb":
                var msg = "TOrbrbrbrbBrbrbrBrBrBRBBRBRBRBRbRBRBRbRB";
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "good":
                var msg = "Thank you! <:_Happy:388153554357059595>";
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "bad":
                var msg = "<:_Cry:388154102837805056>";
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "meitip":
                var tips = fs.readFileSync('yerFiles//mei.txt', 'utf8').split('\r\n');

                var msg = tips[Math.floor(Math.random() * tips.length)];
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "mei":
                var lines = fs.readFileSync('yerFiles//meiart.txt', 'utf8').split('\r\n');

                var msg = lines[Math.floor(Math.random() * lines.length)];
                message.channel.send(msg);
                logMsg += "<" + msg + ">";
                break;

            case "zarmei":
            case "meirya":
            case "meizarya":
            case "zaryamei":
                var lines = fs.readFileSync('yerFiles//zarmei.txt', 'utf8').split('\r\n');

                var msg = lines[Math.floor(Math.random() * lines.length)];
                message.channel.send(msg);
                logMsg += "<" + msg + ">";
                break;

            case "meihem":
            case "meirat":
            case "junkmei":

                var lines = fs.readFileSync('yerFiles//meihem.txt', 'utf8').split('\r\n');

                var msg = lines[Math.floor(Math.random() * lines.length)];
                message.channel.send(msg);
                logMsg += "<" + msg + ">";
                break;
            case "hanmei":
            case "meizo":
            case "haznomei":

                var lines = fs.readFileSync('yerFiles//hanmei.txt', 'utf8').split('\r\n');

                var msg = lines[Math.floor(Math.random() * lines.length)];
                message.channel.send(msg);
                logMsg += "<" + msg + ">";
                break;


            case "echo":
                var msg = "|" + args + "|";
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "modpoll":
                var msg = "**Mod Poll**\r\n\r\n"
                    + args +
                    "\r\n\r\nProposed by: " + message.author.username +

                    "\r\n<:none:393952426123722753> Alpha\r\n<:none:393952426123722753> Hidden\r\n<:none:393952426123722753> Mori\r\n<:none:393952426123722753> Xetrae\r\n<:none:393952426123722753> Yernemm\r\n\r\n Vote <:yes:393952580411064320> <:no:393952542964580353> <:neutral:393952502724427777>";
                message.channel.send(msg).then(function (msge) {
                    msge.react(bot.emojis.get("393952580411064320"));
                    msge.react(bot.emojis.get("393952542964580353"));
                    msge.react(bot.emojis.get("393952502724427777"));
                });
                logMsg += msg;
                break;

            case "poll":
                var msg = "**Mod Poll**\r\n\r\n"
                    + args +
                    "\r\n\r\nProposed by: " + message.author.username +

                    "\r\n\r\n Vote <:yes:393952580411064320> <:no:393952542964580353> <:neutral:393952502724427777>";
                message.channel.send(msg).then(function (msge) {
                    msge.react(bot.emojis.get("393952580411064320"));
                    msge.react(bot.emojis.get("393952542964580353"));
                    msge.react(bot.emojis.get("393952502724427777"));
                });
                logMsg += msg;
                break;

            case "stats":
                var dn = new Date();
                var time = d.getTime() - timeStart;
                var ftime = msToTime(time);

                bot.syncGuilds();

                var svnum = bot.guilds.array().length;
                var chnum = bot.channels.array().length;
                var usnum = 0;
                bot.guilds.array().forEach(element => {
                    usnum += element.memberCount;
                });

                //TO-DO: finish current server stats.
                //var currserv = author.guild.name;



                var msg = "YerBot has been online for:\r\n" + ftime + "\r\n\r\nServing:\r\n" + svnum + " servers,\r\n" + chnum + " channels, and\r\n" + usnum + " users!";
                message.channel.send(msg);
                logMsg += msg;


                break;

            case "test":
                switch (argsArr[1]) {
                    case "time":
                        var inptime = parseInt(argsArr[2]);
                        var calcTime = msToTime(inptime);

                        var msg = calcTime;
                        message.channel.send(msg);
                        logMsg += msg;
                        break;

                    case "react":
                        var msg = "<a:YerAnim:393575040588972033> eek";
                        message.channel.send(msg)
                            .then(function (msge) {
                                msge.react(bot.emojis.get("393575040588972033"));
                                msge.react(bot.emojis.get("389882181130125313"));
                            });

                        logMsg += msg;
                        break;

                    case "parseint":
                        var int = parseInt(argsArr[2]);

                        var msg = int;
                        message.channel.send(msg);
                        logMsg += msg;
                        break;

                    case "channel":
                        var channelID = argsArr[2];
                        var msg = "error";
                        if (bot.channels.get(channelID))
                            msg = "Channel found: **" + bot.channels.get(channelID).name + "**";
                        else
                            msg = "Channel could not be found."

                        message.channel.send(msg);
                        logMsg += msg;
                        break;

                    default:
                        var msg = "Test not found. Available tests: \r\ntime \r\nreact \r\nparseint\r\nchannel";
                        message.channel.send(msg);
                        logMsg += msg;
                        break;


                }
                break;

            case "hero":
            case "randhero":
            case "herorand":
                //TO-DO: Port the hero roles and counters from web version.
                var allHeroes = ["Genji", "McCree", "Pharah", "Reaper", "Soldier: 76", "Tracer", "Bastion", "Hanzo", "Junkrat", "Mei", "Torbjorn", "Widowmaker", "D.Va",
                    "Reinhardt", "Roadhog", "Winston", "Zarya", "Ana", "Lucio", "Mercy", "Symmetra", "Zenyatta", "Sombra", "Orisa", "Doomfist", "Moira"
                ];


                var msg = "Play **" + allHeroes[Math.floor(Math.random() * allHeroes.length)] + "**!";
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "rng":

                var num1 = 1;
                var num2 = 100;

                if (argsArr[1] != null) num1 = parseInt(argsArr[1]);
                if (argsArr[2] != null) num2 = parseInt(argsArr[2]);

                var lower;
                var higher;

                if (num1 > num2) {
                    lower = num2;
                    higher = num1;

                } else {
                    lower = num1;
                    higher = num2;
                }



                var msg = Math.floor(Math.random() * (higher - lower + 1) + lower);
                message.channel.send(msg);
                logMsg += msg;
                break;

            case "archive":

                switch (message.author.id) {

                    case "157588344363024385":

                        var channelID = argsArr[1];

                        //Check if the channel exists before doing anything else.
                        if(bot.channels.get(channelID)){

                        // var chan = bot.channels.get(channelID).fetchMessages().array();
                        // console.log(chan);
                            var chn = bot.channels.get(channelID);

                            var timeArchived = formDateUTC();

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

                                    allMsg = "[" + dc.getUTCFullYear() + "/" + lZero((dc.getUTCMonth() + 1), 2) + "/" + lZero(dc.getUTCDate(), 2) + " " + lZero(dc.getUTCHours(), 2) + ":" + lZero(dc.getUTCMinutes(), 2) + ":" + lZero(dc.getUTCSeconds(), 2) + "] " + element.author.username + "#" + element.author.discriminator + ": " + element.content + "\r\n" + allMsg;

                                    //allMsg = element.content + "\r\n" + allMsg;
                                });
                                //console.log(msges.length);                    
                            } while (msges.length == lim + 1);

                            var msgs = "ARCHIVED BY YERBOT [ http://yernemm.xyz ]\r\n----------------------------\r\nALL DATES ARE IN yyyy/mm/dd FORMAT AND IN THE UTC TIMEZONE\r\nCHANNEL NAME: " + bot.channels.get(channelID).name + "\r\nSERVER NAME: " + bot.channels.get(channelID).guild.name + "\r\nARCHIVE CREATED: " + formDate() + "\r\n---------------------\r\n" + allMsg;


                            //console.log(msgs);

                            fs.writeFileSync("yerFiles//temp//" + requestNum + ".txt", msgs);
                            var msg = "Archive Done!\r\n----------------------\r\nServer: **" + chn.guild.name +"**\r\nChannel: **" + chn.name + "**\r\nArchived: **" + timeArchived + "**\r\n----------------------";
                            message.channel.send(msg, {
                                files: [
                                    "yerFiles//temp//" + requestNum + ".txt"
                                ]
                            });
                            logMsg += msg;
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
                        logMsg += msg;

                    }

                        break;

                    default:
                        var msg = "Temporarily, only certain users can use this command due to its resource-intensive nature.";
                        message.channel.send(msg);
                        logMsg += msg;
                        break;
                }

                break;

                case "archiveserver":
                case "archiveserv":

                switch (message.author.id) {

                    case "157588344363024385":

                        var guildID = argsArr[1];

                        //Check if the channel exists before doing anything else.
                        if(bot.guilds.get(guildID)){

                        // var chan = bot.channels.get(channelID).fetchMessages().array();
                        // console.log(chan);
                        //    var chn = bot.channels.get(channelID);

                            var timeArchived = formDateUTC();







                        var lim = 100;
                        var bef = "";


                        archServ();

                        async function archServ(){
                            var chanNames = "";

                            var chanColl = bot.guilds.get(guildID).channels;

                            var channNum = 0;

                            chanColl.forEach(element =>{
                                chanNames += "\r\n**" + element.name + "**";
                                channNum++;
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

                                    allMsg = "[" + dc.getUTCFullYear() + "/" + lZero((dc.getUTCMonth() + 1), 2) + "/" + lZero(dc.getUTCDate(), 2) + " " + lZero(dc.getUTCHours(), 2) + ":" + lZero(dc.getUTCMinutes(), 2) + ":" + lZero(dc.getUTCSeconds(), 2) + "] " + element.author.username + "#" + element.author.discriminator + ": " + element.content + "\r\n" + allMsg;

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

                            var msgs = "ARCHIVED BY YERBOT [ http://yernemm.xyz ]\r\n----------------------------\r\nALL DATES ARE IN yyyy/mm/dd FORMAT AND IN THE UTC TIMEZONE\r\nCHANNEL NAME: " + bot.channels.get(channelID).name + "\r\nSERVER NAME: " + bot.channels.get(channelID).guild.name + "\r\nARCHIVE CREATED: " + formDate() + "\r\n---------------------\r\n" + allMsg;


                            //console.log(msgs);

                            fs.writeFileSync("yerFiles//temp//" + requestNum + ".txt", msgs);
                            var msg = "Channel Archived!\r\n----------------------\r\nServer: **" + chn.guild.name +"**\r\nChannel: **" + chn.name + "**\r\nArchived: **" + timeArchived + "**\r\n----------------------";
                            
                            var vals = [msg, "yerFiles//temp//" + requestNum + ".txt"];
                                return vals;

                            
                            logMsg += msg;
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
                        message.channel.send(msg);
                        logMsg += msg;

                    }

                        break;

                    default:
                        var msg = "Temporarily, only certain users can use this command due to its resource-intensive nature.";
                        message.channel.send(msg);
                        logMsg += msg;
                        break;
                }

                break;

            case "help":
                var msg = "error";
                switch (args) {
                    case null:
                    case "":
                    case " ":
                        msg = "";
                        //Line below will be re-added when help command is finished for each command.
                        //TO-DO: finish this.
                        // msg += "__Use **>help [command]** to view specific help for that command.__\r\n";
                        msg += "Commands:\r\n>hello\r\n>torb\r\n>good bot\r\n>bad bot\r\n>meitip\r\n>mei\r\n>zarmei\r\n>meihem\r\n>hanmei\r\n>echo\r\n>poll\r\n>stats\r\n>test\r\n>hero\r\n>rng";
                        break;

                    default:
                        msg = "Command help not found.\r\nUse **>help** to see available commands."
                        break;


                }
                message.channel.send(msg);
                logMsg += msg;

                break;


            default:

                return;
                break;


        }


        console.log(logMsg);
        var logChannel = bot.channels.get(logChannelID);
        logChannel.send(logMsg);

    } catch (err) {

        var msg = "***Some error occured!***\r\n<@157588344363024385> Check the logs for the detailed error message and fix it!!"
        message.channel.send(msg);
        logMsg += msg + "\r\nERROR:\r\n" + err;
        console.log(logMsg);
        var logChannel = bot.channels.get(logChannelID);
        logChannel.send(logMsg);

    }

});

bot.login(token);

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100)
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24)
        , days = parseInt((duration / (1000 * 60 * 60 * 24)));

    return days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + "." + milliseconds + " seconds.";
}

function lZero(num, digits){
    var zeroes = "";
    for (i = 0; i < digits; i++){
        zeroes += "0";
    }
    return (zeroes + num).slice(- digits);
}