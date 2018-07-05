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
                            message.channel.send("Fetching stats. This might take a couple seconds...").then(initmsg => {
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

                                        //Do stuff for console players:


                                        var userStats = parsed[row.region.toLowerCase()].stats;
                                        var heroStats = parsed[row.region.toLowerCase()].heroes;
                                        var mainStats;
                                        var statsFlag = true;
                                        if (userStats.quickplay) { mainStats = userStats.quickplay; }
                                        else if (userStats.competitive) { mainStats = userStats.competitive; }
                                        else {
                                            m.logSend(config, client, message, "No stats found.");
                                            statsFlag = false;
                                        }
                                        if (statsFlag) {
                                            var statsPage = "";
                                            statsPage +=
                                                `Level: **${(userStats.quickplay.overall_stats.prestige * 100) + userStats.quickplay.overall_stats.level}**\r\n`;

                                            var qpStats = "No stats found.";
                                            if (userStats.quickplay) {
                                                var heroes = heroStats.playtime.quickplay;
                                                var max = -1.0000000000000000;
                                                var max2 = -1.0000000000000000;
                                                var max3 = -1.0000000000000000;
                                                var hero1 = "";
                                                var hero2 = "";
                                                var hero3 = "";
                                              //  heroes.forEach(h =>{
                                              //      if(h.value > max)
                                              //         hero1 = h;
                                              //  });


                                                for (var key in heroes) {
                                                    if (heroes.hasOwnProperty(key)) {
                                                        console.log(key + " -> " + heroes[key]);
                                                        if(heroes[key] > max)
                                                        {
                                                        max = heroes[key];
                                                        hero3 = hero2;
                                                        hero2 = hero1;
                                                        hero1 = `${key} (${round2dp(heroes[key])}h)`;
                                                        
                                                        } else if(heroes[key] > max2)
                                                        {
                                                         max2 = heroes[key];
                                                         hero3 = hero2;
                                                        hero2 = `${key} (${round2dp(heroes[key])}h)`;
                                                        } else if(heroes[key] > max3)
                                                        {
                                                         max3 = heroes[key];
                                                        hero3 = `${key} (${round2dp(heroes[key])}h)`;
                                                        }
                                                    }
                                                }

                                                qpStats = "" +
                                                    `Time played: **${round2dp(userStats.quickplay.game_stats.time_played)}h**\r\n` + 
                                                    `Most played:\r\n**1) ${m.capitalizeFirstLetter(hero1)}**\r\n**2) ${m.capitalizeFirstLetter(hero2)}**\r\n**3) ${m.capitalizeFirstLetter(hero3)}**`
                                            }

                                            var coStats = "No stats found.";
                                            if (userStats.competitive) {

                                                var heroes = heroStats.playtime.competitive;
                                                var max = -1.0000000000000000;
                                                var max2 = -1.0000000000000000;
                                                var max3 = -1.0000000000000000;
                                                var hero1 = "";
                                                var hero2 = "";
                                                var hero3 = "";
                                              //  heroes.forEach(h =>{
                                              //      if(h.value > max)
                                              //         hero1 = h;
                                              //  });


                                                for (var key in heroes) {
                                                    if (heroes.hasOwnProperty(key)) {
                                                        console.log(key + " -> " + heroes[key]);
                                                        if(heroes[key] > max)
                                                        {
                                                        max = heroes[key];
                                                        hero3 = hero2;
                                                        hero2 = hero1;
                                                        hero1 = `${key} (${round2dp(heroes[key])}h)`;
                                                        
                                                        } else if(heroes[key] > max2)
                                                        {
                                                         max2 = heroes[key];
                                                         hero3 = hero2;
                                                        hero2 = `${key} (${round2dp(heroes[key])}h)`;
                                                        } else if(heroes[key] > max3)
                                                        {
                                                         max3 = heroes[key];
                                                        hero3 = `${key} (${round2dp(heroes[key])}h)`;
                                                        }
                                                    }
                                                }




                                                coStats = "" +
                                                    `Time played: **${round2dp(userStats.competitive.game_stats.time_played)}h**\r\n`+ 
                                                    `Most played:\r\n**1) ${m.capitalizeFirstLetter(hero1)}**\r\n**2) ${m.capitalizeFirstLetter(hero2)}**\r\n**3) ${m.capitalizeFirstLetter(hero3)}**`
                                            }



                                            const embed = new Discord.RichEmbed()
                                                .setTitle("Overwatch Stats for " + row.username)
                                                .setDescription(statsPage)
                                                .setThumbnail(userStats.quickplay.overall_stats.avatar)
                                                .addField("Quickplay", qpStats, true)
                                                .addField("Competitive", coStats, true)
                                                .setColor(0xfa9c1e);




                                            message.channel.send({ embed });
                                            initmsg.delete();
                                            m.log(config, client, message, statsPage);
                                        }
                                    }
                                });
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
                                var plat = argsArr[1].toLowerCase();
                                var regi = argsArr[2].toLowerCase();

                                if (plat == "pc") {
                                    user = user.split('#')[0] + "-" + user.split('#')[1];
                                }

                                sql.get(`SELECT * FROM owAcc WHERE userId ="${message.author.id}"`)
                                    .then(row => {
                                        msg = `Account already linked to "${row.username} ${row.platform} ${row.region.toLowerCase()}". Consider unlinking with _'ow unlink'_.`
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
        //platform region username
        //TO-DO: FINISH VALIDATION
        if (argsArr[1] != null && argsArr[2] != null && argsArr[3] != null) {
            var flag = true;
            var user = argsTxt.slice(argsArr[1].length + argsArr[2].length + 2);
            var plat = argsArr[1];
            var regi = argsArr[2];

            switch (plat.toLowerCase()) {
                case "pc":
                case "xbl":
                case "psn":
                    break;
                default:
                    flag = false;
                    break;
            }

            switch (regi.toLowerCase()) {
                case "eu":
                case "us":
                case "kr":
                    break;
                default:
                    flag = false;
                    break;
            }
            return flag;

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

    function round2dp(number) {
        return Math.round(number * 100) / 100
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

