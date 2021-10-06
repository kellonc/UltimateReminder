const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
    message.channel.send("Pinging...").then(m =>{
        // The math thingy to calculate the user's ping
          var ping = m.createdTimestamp - message.createdTimestamp;

        // Basic embed
          var embed = new Discord.MessageEmbed()
          .setDescription("<:Clockrpg:797571296095240282> `"+ping+"ms`")
          .setColor(db.get(`user_${message.author.id}.color`))
          
          // Then It Edits the message with the ping variable embed that you created
          m.edit(embed)
      });

}

module.exports.help = {
    name: "ping",
    aliases: []
}