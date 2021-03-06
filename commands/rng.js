
//METADATA
exports.cmdtype = () => {
    return "utility";
}
const desc = "Returns a random number between integers num1 and num2, which can be specified."; //Short description of what the command does.
const usage = "[num1 = 100] [num2 = 1]"; //Any parameters required for command.
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

    var num1 = 100;
    var num2 = 1;

    if (argsArr[0] != null) num1 = parseInt(argsArr[0]);
    if (argsArr[1] != null) num2 = parseInt(argsArr[1]);

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