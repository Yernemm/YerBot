//METADATA
const desc = "Gets overwatch stats."; //Short description of what the command does.
const usage = ""; //Any parameters required for command.
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

    const sqlite = require("sqlite");


    const dbp = sqlite.open("./yerFiles/db/owUsers.sqlite")
        .then(sql => {


            switch (argsArr[0]) {

                case "link":


                    //username platform region

                    if (validateLink() != false) {

                        var user = argsArr[1];
                        var plat = argsArr[2];
                        var regi = argsArr[3];

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



                    }



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

                    break;

                default:

                    break;


            }


        });

    //--------------------------------------------------------------------
    //m.logSend(config, client, message, msg); //Method will send msg to user, and also log it in both console AND log channel.
    //m.log(config, client, message, msg); //Alternative will log msg without sending msg.


    function validateLink() {
        //TO-DO: FINISH VALIDATION
        if (argsArr[1] != null && argsArr[2] != null && argsArr[3] != null)
            return true;
        else
            return false;
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

