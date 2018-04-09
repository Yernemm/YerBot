
//METADATA
exports.cmdtype = () => {
    return "testing";
}
const desc = "Reloads a command."; //Short description of what the command does.
const usage = "<command>"; //Any parameters required for command.
exports.run = (config, client, message, args) => {
    const m = require("./../shared/methods.js");
    //--------------------------------------------------------------------
    var msg = ""; //Put response message to be logged here.
    //--------------------------------------------------------------------
        //Uncomment for protected owner-only command.
        if(message.author.id !== config.ownerID){
            msg = `Only ${config.ownerName} can run this command.`;
            
       } else{
 //--------------------------------------------------------------------

    //COMMAND LOGIC HERE:

    if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    msg = `The command ${args[0]} has been reloaded`;

       };
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