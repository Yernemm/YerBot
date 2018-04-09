//METADATA
const desc = "Shows the colour given by the code.\r\nModes and code examples:\r\ncolour hex ff0000\r\ncolour rgb 255 0 0"; //Short description of what the command does.
const usage = "<mode> <code>"; //Any parameters required for command.
const cmdtype = "utility"; //Type of command
//Command
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
    
    var Color = require('color');
    //debug thing
    //message.channel.send(argsArr);
    
    switch (argsArr[0]) {
        case "hex":
            if (isHex(argsArr[1]) && argsArr[1].length <= 6) {
                var col = Color('#' + argsArr[1]);
                sendRGBCol(col, config, client, message, argsArr, argsTxt, extraData);
            } else {
                msg = "Invalid hex colour."
                message.channel.send(msg);
            }
            break;
        case "rgb":
            if (validateRGB(argsArr, message)) {
                var col = Color.rgb(parseInt(argsArr[1], 10),parseInt(argsArr[2], 10),parseInt(argsArr[3], 10));
                sendRGBCol(col, config, client, message, argsArr, argsTxt, extraData);
            } else {
                msg = "Invalid rgb colour."
                message.channel.send(msg);
            }

            break;
        default:
            msg = "Invalid mode."
            message.channel.send(msg);
            break;
    }




    //--------------------------------------------------------------------
    //m.logSend(config, client, message, msg); //Method will send msg to user, and also log it in both console AND log channel.
    m.log(config, client, message, msg); //Alternative will log msg without sending msg.
}
exports.desc = () => {
    return desc;
}
exports.use = () => {
    return usage;
}
exports.cmdtype = () => {
    return cmdtype;
}
function isHex(h) {
    var a = parseInt(h, 16);
    return (a.toString(16) === h)
}
function validateRGB(argsArr, message) {
    //Too lazy for long variable names. Deal with it >.<
    var f = true;
    for (i = 1; i <= 3; i++) {
        let a = argsArr[i];
        let b = parseInt(argsArr[i], 10);
        if (a != b){
            //debug stuff commented out.
           // message.channel.send(`first ${i}`);
            f = false;
        }
        if (b > 255 || b < 0)
        {
           // message.channel.send(`second ${i}`);
            f = false;
        }
    }
    return f;
}
function sendRGBCol(col, config, client, message, argsArr, argsTxt, extraData){
    var textColHex;
    if(col.isLight())
    textColHex = "000000";
    else
    textColHex = "ffffff";

    const Discord = require("discord.js");
    const embed = new Discord.RichEmbed()
    .setTitle("__Colour preview__")
    .addField("RGB", `${col.red()} ${col.green()} ${col.blue()}`)
    .addField("Hex", col.rgbNumber().toString(16))
    .setColor(col.rgbNumber())
    .setThumbnail(`https://dummyimage.com/800x800/${col.rgbNumber().toString(16)}/${textColHex}.png&text=%23${col.rgbNumber().toString(16)}`)
    .setImage(`https://dummyimage.com/800x200/36393e/${col.rgbNumber().toString(16)}.png&text=${encodeURI(message.member.displayName)}`)

    message.channel.send({embed});
}