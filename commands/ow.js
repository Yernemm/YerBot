//METADATA
const desc = "Gets overwatch stats and user information. Use ow help for more info."; //Short description of what the command does.
const usage = "help"; //Any parameters required for command.
const cmdtype = "utility"; //Type of command
const Discord = require("discord.js");
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

    const sqlite = require("sqlite");
    const request = require("request");

    const msgNotFound = "User not found. Re-link your account.";
    const msgPrivate = "Profile set to private. Open Overwatch and set your career profile to public in the social settings.";


    const dbp = sqlite.open("./yerFiles/db/owUsers.sqlite")
        .then(sql => {



            //Get user info


            var usr = message.author.id;

            if (argsArr[1]) {
                usr = argsArr[1].replace("<", "").replace("@", "").replace("!", "").replace(">", "");
            }

            sql.get(`SELECT * FROM owAcc WHERE userId ="${usr}"`)
                .then(row => {




                    ///




                    switch (argsArr[0]) {

                        case "link":


                            m.logSend(config, client, message, `Account already linked to "${row.username} ${row.platform} ${row.region}". Consider unlinking with _'ow unlink'_.`);




                            break;

                        case "unlink":

                            sql.get(`SELECT * FROM owAcc WHERE userId ="${message.author.id}"`)
                                .then(row => {


                                    let username = row.username;
                                    sql.run(`DELETE FROM owAcc WHERE userId ="${message.author.id}"`)
                                        .then(() => {
                                            m.logSend(config, client, message, `Overwatch user "${username}" has been unlinked.`);
                                        })
                                        .catch(err => {
                                            m.logSend(config, client, message, `Error unlinking "${username}".`);
                                        });
                                });




                            break;

                        case "stats":
                            var options = {
                                url: getOwApiLink(row.username, row.platform, "blob"),
                                headers: {
                                    'User-Agent': 'request'
                                }
                            };
                            request(options, function (error, response, body) {
                                var parsed = JSON.parse(body);
                                if (parsed.error == 404) {
                                    m.logSend(config, client, message, msgNotFound);
                                } else if (parsed.error == "Private") {
                                    m.logSend(config, client, message, msgPrivate);
                                } else {
                                    //console.log(body);
                                    var userStats = parsed[row.region].stats;


                                    var statsPage = "";
                                    statsPage +=
                                        `Level: **${(userStats.quickplay.overall_stats.prestige * 100) + userStats.quickplay.overall_stats.level}**\r\n`;

                                    var qpStats = "a";

                                    var coStats = "b";



                                    const embed = new Discord.RichEmbed()
                                        .setTitle("Overwatch Stats for " + row.username)
                                        .setDescription(statsPage)
                                        .setThumbnail(userStats.quickplay.overall_stats.avatar)
                                        .addField("Quickplay", qpStats, true)
                                        .addField("Competitive", coStats, true)
                                        .setColor(0xfa9c1e);


                                    message.channel.send({ embed });
                                    m.log(config, client, message, statsPage);
                                }
                            });


                            break;

                        default:

                            break;


                    }






                })
                .catch(err => {
                    if (argsArr[0] != "help" && argsArr[0] != "link" && argsArr[0] != "unlink") {
                        let errmsg = "Linked account not found. Consider using _'ow link'_."
                        message.channel.send(errmsg);
                        m.log(config, client, message, errmsg + "\r\n\r\n" + err);
                    }

                    switch (argsArr[0]) {
                        case "help":

                            break;

                        case "link":

                            //platform region username

                            if (validateLink() != false) {

                                var user = argsTxt.slice("link ".length + argsArr[1].length + argsArr[2].length + 2);
                                var plat = argsArr[1];
                                var regi = argsArr[2];

                                if (plat == "pc") {
                                    user = user.split('#')[0] + "-" + user.split('#')[1];
                                }

                                sql.get(`SELECT * FROM owAcc WHERE userId ="${message.author.id}"`)
                                    .then(row => {
                                        msg = `Account already linked to "${row.username} ${row.platform} ${row.region}". Consider unlinking with _'ow unlink'_.`
                                        m.logSend(config, client, message, msg);
                                    })
                                    .catch(err => {
                                        m.log(config, client, message, err + " -1 ");
                                        sql.run(`CREATE TABLE IF NOT EXISTS owAcc (userId TEXT, username TEXT, platform TEXT, region TEXT)`)
                                            .then(() => {
                                                sql.run(`INSERT INTO owAcc (userId, username, platform, region) VALUES (?, ?, ?, ?)`, [message.author.id, user, plat, regi])
                                                    .then(() => {
                                                        m.logSend(config, client, message, `Discord account linked to: \r\n    Username: "${user}"\r\n    Platform: "${plat}"\r\n    Region: "${regi}"`);
                                                    })
                                                    .catch(err => {
                                                        //Failed to add account.
                                                        m.log(config, client, message, err + " -2 ");
                                                    });
                                            })
                                            .catch(err => {
                                                //Failed to create table.
                                                m.log(config, client, message, err + " -3 ");

                                            });
                                    });



                            } else {
                                m.logSend(config, client, message, "Invalid linking parameters.");
                            }


                            break;
                    }

                });



        });

    //--------------------------------------------------------------------
    //m.logSend(config, client, message, msg); //Method will send msg to user, and also log it in both console AND log channel.
    //m.log(config, client, message, msg); //Alternative will log msg without sending msg.


    function validateLink() {
        //TO-DO: FINISH VALIDATION
        if (argsArr[1] != null && argsArr[2] != null && argsArr[3] != null) {
            var user = argsTxt.slice(argsArr[1].length + argsArr[2].length + 2);
            var plat = argsArr[1];
            var regi = argsArr[2];


            if (user != null && plat != null && regi != null) {
                return true;
            }
            else
                return false;
        } else {
            return false;
        }
    }


    function getOwApiLink(user, platform, type) {
        //types include blob stats achievements heroes
        return `https://owapi.net/api/v3/u/${user}/${type}?platform=${platform}`;
    }

    function cmdHelp() {

        //TO-DO

    }

    function cmdLink() {



    }

    function cmdUnlink() {



    }








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

