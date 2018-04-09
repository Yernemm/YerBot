
//METADATA
exports.cmdtype = () => {
    return "testing";
}
const desc = `Command for checking Last.FM info. Do 'lf help' for more info.`; //Short description of what the command does.
const usage = "<mode> [arguments]"; //Any parameters required for command.
exports.run = (config, client, message, argsArr, argsTxt, extraData) => {
    const bot = client;
    const m = require("./../shared/methods.js");
    //--------------------------------------------------------------------
    //Uncomment for protected owner-only command.
    //if(message.author.id !== config.ownerID) return; 
    //--------------------------------------------------------------------
    var msg = ""; //Put response message to be logged here.
    //--------------------------------------------------------------------
    const lfColor = "#BA0000";
    //COMMAND LOGIC HERE:

    

    const sqlite = require("sqlite");
    const Discord = require("discord.js");
    var LastfmAPI = require('lastfmapi');
    var lfm = new LastfmAPI({
        'api_key' : config.lfmApiKey,
        'secret' : config.lfmSecret
    });


    const dbp = sqlite.open("./yerFiles/db/lf.sqlite")
    .then(sql=>{
        //m.log(config, client, message, "Opened");

        

         //  var objArr = Object.keys(topTracks)
                          //  resp = "Tracks:\r\n" + objArr[1];
                           // for(i=0;i<=1;i++){
                          //      resp += "\r\n" + objArr[i].name;
                         //   }

                        // resp = "```" + JSON.stringify(topTracks) + "```";


      

        


        sql.get(`SELECT * FROM lfAcc WHERE userId ="${message.author.id}"`)
        .then(row=>{
            var lfu = row.lfUser;







   
















                lfm.user.getRecentTracks({
                    'user' : lfu,
                    'limit': 2
                }, (err, topTracks) =>{
                    if(err){
                        m.logSend(config, client, message, "Error");
                    }else{
                        let resp = "Errrrr"
                        try{
                          //  var objArr = Object.keys(topTracks)
                          //  resp = "Tracks:\r\n" + objArr[1];
                           // for(i=0;i<=1;i++){
                          //      resp += "\r\n" + objArr[i].name;
                         //   }

                        // resp = "```" + JSON.stringify(topTracks) + "```";
                        resp = ""

                        for(i=0;i<10;i++){
                            let tr = topTracks.track[i];
                            resp += `\r\n\`${i+1}\`\t[${tr.name}](${tr.url}) by **${tr.artist.name}** (${tr.playcount} plays)`;
                        }
                        m.log(config, client, message, `\`\`\`${resp}\`\`\``);

                        try{
                            var objArr = Object.keys(topTracks)
                            resp = "Tracks:\r\n" + objArr[1];
                            for(i=0;i<=1;i++){
                                resp += "\r\n" + objArr[i].name;
                            }

                         resp = "```" + JSON.stringify(topTracks) + "```";

                       
                        message.channel.send({embed});
                        }catch(eg1){
                            m.log(config, client, message, eg1);
                        }
                            //resp = "Tracks:\r\n" + objArr[1];
                        //m.logSend(config, client, message, "Tracks:\r\n" + topTracks[1].name);//({'rank' : 1}).name);
                        }catch(err2){
                            resp = err2;
                        }
                        
                    }
                })

             
                
//.{'rank' : 1}









            })


    //sql.close("./yerFiles/db/lf.sqlite");

})
.catch(()=>{
    m.logSend(config, client, message, "Not opened");
});


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