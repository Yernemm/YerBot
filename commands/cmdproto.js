
//METADATA
exports.cmdtype = () => {
    return "testing";
}

const desc = "Prototype code."; //Short description of what the command does.
const usage = "<code>"; //Any parameters required for command.
exports.run = (config, client, message, argsArr, argsTxt, extraData) => {
    const bot = client;
    const m = require("./../shared/methods.js");
    //--------------------------------------------------------------------
    //Uncomment for protected owner-only command.
    if(message.author.id !== config.ownerID){
        m.logSend(config, client, message, `Only ${config.ownerName} can use this.`);
        return;

    } else{
    //--------------------------------------------------------------------
    var msg = "Code Execution...\r\n"; //Put response message to be logged here.
    //--------------------------------------------------------------------

    //COMMAND LOGIC HERE:

    try{
       // msg = function(){
            eval(argsTxt);
      //  };
    }catch(err){
        msg += err;
    }
    


    //--------------------------------------------------------------------
    m.logSend(config, client, message, msg); //Method will send msg to user, and also log it in both console AND log channel.
    //m.log(config, client, message, msg); //Alternative will log msg without sending msg.
}
}
exports.desc = () =>{
    return desc;
}
exports.use = () =>{
    return usage;
}