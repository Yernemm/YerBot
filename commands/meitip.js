
//METADATA
exports.cmdtype = () => {
    return "utility";
}
const desc = "Random mei tip."; //Short description of what the command does.
const usage = ""; //Any parameters required for command.
exports.run = (config, client, message, args) => {
    const m = require("./../shared/methods.js");
    //--------------------------------------------------------------------
    //Uncomment for protected owner-only command.
    //if(message.author.id !== config.ownerID) return; 
    //--------------------------------------------------------------------
    var msg = "Error"; //Put response message to be logged here.
    //--------------------------------------------------------------------

    //COMMAND LOGIC HERE:
    const fs = require('fs');
    var tips = fs.readFileSync('./yerFiles/mei.txt', 'utf8').split(m.nl());

    msg = tips[Math.floor(Math.random() * tips.length)];

    


    //--------------------------------------------------------------------
    m.logSend(config, client, message, msg); //Method will send msg to user, and also log it in both console AND log channel.
    //m.log(config, client, message, msg); //Alternative will log msg without sending msg.
}
exports.desc = () =>{
    return desc;
}
exports.use = () =>{
    return usage;
}