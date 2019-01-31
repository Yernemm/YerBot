//METADATA
const desc = "Converts the message such that each character is surrounded by a spoier tag."; //Short description of what the command does.
const usage = "<message>"; //Any parameters required for command.
const cmdtype = "fun"; //Type of command
//Command
exports.run = (config, client, message, argsArr, argsTxt, extraData) => {
    const bot = client;
    const m = require("./../shared/methods.js");
    //--------------------------------------------------------------------
    //Uncomment for protected owner-only command.
    //if(message.author.id !== config.ownerID) return; 
    //--------------------------------------------------------------------
    var msg = "`"; //Put response message to be logged here.
    //--------------------------------------------------------------------

    //COMMAND LOGIC HERE:

    var i = 1;

    argsTxt.forEach(e=>{
        if(i<=398)
        msg+="||"+e+"||";
        i++;
    })
    msg +="`"



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
exports.cmdtype = () => {
    return cmdtype;
}