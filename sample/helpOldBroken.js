
//METADATA
exports.cmdtype = () => {
    return "core";
}
const desc = "Displays help and info about YerBot."; //Short description of what the command does.
const usage = "[command]"; //Any parameters required for command.
exports.run = (config, client, message, argsArr, argsTxt, extraData) => {
    const bot = client;
    const m = require("./../shared/methods.js");
    //--------------------------------------------------------------------
    //Uncomment for protected owner-only command.
    //if(message.author.id !== config.ownerID) return; 
    //--------------------------------------------------------------------
    var msg = ""; //Put response message to be logged here.
    //--------------------------------------------------------------------

    //COMMAND LOGIC HERE:


    var msg = "error";
    switch (argsTxt) {
        case null:
        case "":
        case " ":
            msg = `**YerBot, Made by Yernemm. https://yernemm.xyz**\r\nTo get help for a specific command, do ${config.prefix}help [command]\r\n\r\n`;
            //Line below will be re-added when help command is finished for each command.
            //TO-DO: finish this.
            // msg += "__Use **>help [command]** to view specific help for that command.__\r\n";

            msg += "Commands:\r\n"

            const dir = './commands/';
            const fs = require('fs');

            var cmds = [];
            var cmdTypes = [];

            let count = 0;
            fs.readdirSync(dir).forEach(file => {

                if (file.endsWith(".js")) {
                    let cmdfile = require(`./${file}`);
                    cmds[count] = config.prefix + file.slice(0, -3) + "\r\n";
                    cmdTypes[count] = cmdfile.cmdtype();
                    count++;
                }

            })

            var typeTable = [[],[]];

            var uniqueTypes = cmdTypes.filter(onlyUnique).sort();

            

            for (i = 0; i < uniqueTypes.length; i++) {
                typeTable[0][i] = uniqueTypes[i];
            }

            var tcount = [];
            console.log(1);
            for(i=0;i<uniqueTypes.length;i++){
                tcount[i] = 1;
            }
            console.log(2);
            for (i = 0; i < cmds.length; i++) {
                for (j = 0; j < uniqueTypes.length; j++) {
                    typeTable[i] = [];
                    if(cmdTypes[i] == uniqueTypes[j]){
                    
                        typeTable[tcount[j]][j] = cmds[i];
                        tcount[j]++;
                    }
                }
            }
            console.log(3);
            console.log(uniqueTypes);
            console.log(cmdTypes);
            console.log(cmds);
            console.log(typeTable);
            msg += typeTable;





            //msg += "Commands:\r\n>hello\r\n>torb\r\n>good bot\r\n>bad bot\r\n>meitip\r\n>mei\r\n>zarmei\r\n>meihem\r\n>hanmei\r\n>echo\r\n>poll\r\n>stats\r\n>test\r\n>hero\r\n>rng";
            break;
        default:

            let cmd = argsTxt;
            try {
                let file = require(`./${cmd}.js`);

                let de = file.desc();
                let us = file.use();
                msg = `**Help for ${config.prefix}${cmd}**\r\n${de}\r\nUsage: ${config.prefix}${cmd} ${us}`;
            } catch (err) {
                msg = `Command \"${argsTxt}\" not found.\r\nUse **>help** to see available commands.`
            }

            break;


    }


    //--------------------------------------------------------------------
    m.logSend(config, client, message, msg); //Method will send msg to user, and also log it in both console AND log channel.
    //m.log(config, client, message, msg); //Alternative will log msg without sending msg.
}
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
exports.desc = () => {
    return desc;
}
exports.use = () => {
    return usage;
}