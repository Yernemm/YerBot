exports.run = (client) => {
    var bot = client;
    const m = require("./../shared/methods.js");
    const config = require("./../config.json");
    const sqlite = require("sqlite");
    bot.user.setPresence({ status: 'online', game: { name: `${config.prefix}help | yernemm.xyz` } });
    var d = new Date();
    timeStart = d.getTime();
    var msg = "--------------------------------------------------------------------------------------\r\n------" + "[" + d.getUTCDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getUTCFullYear() + " " + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds() + "] " + "YERBOT [NODE JS] STARTED------";
    msg += `\r\nServers: ${client.guilds.size} Channels: ${client.channels.size} Users: ${client.users.size}`
    console.log(msg);
    bot.channels.get(config.logChannelID).send(msg);
  
    var dbChecked = false;
  
    const dbp = sqlite.open("./yerFiles/db/reminders.sqlite")
      .then(sql => {
        sql.run(`CREATE TABLE IF NOT EXISTS reminders (timeSet INT, user TEXT, channelID TEXT, reminder TEXT, timeEnd INT)`)
          .then(() => {
            dbChecked=true;
            sqlite.close(dbp);
            
          });
  
      })
  
  
      var checker = setInterval(function(){
        checkDB()
      }, 10 * 1000);
  
      function checkDB(){
        var dbase  = sqlite.open("./yerFiles/db/reminders.sqlite")
        .then(sql=>{
  
          sql.all(`SELECT * FROM reminders`)
          .then(rows=>{
            for(i = 0;i<rows.length;i++){
              try{
                var dt = new Date();
                if(rows[i].timeEnd <= dt.getTime()){
                  let rowid = rows[i].timeSet;
                  let msg = `<@${rows[i].user}> Reminder: ${rows[i].reminder}`;
                  bot.channels.get(rows[i].channelID).send(msg)
                  .then(()=>{
                    sql.run(`DELETE FROM reminders WHERE timeSet = ${rowid}`)
                    .then(()=>{
                      sqlite.close(dbase);
                    });
                    
                  });
                  m.log(config, client, "", msg);
                }else{
                  sqlite.close(dbase);
                }
              } catch (err){
                //sqlite.close(dbase);
              }
            }
          })
  
        });
    
      }
  
  
  }