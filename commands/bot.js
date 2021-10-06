const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
const embed = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setAuthor(bot.user.username, bot.user.avatarURL())
.setDescription("```Ultimate Reminder Info\n\n》Servers: "+bot.guilds.cache.size+" \n》Users: "+bot.users.cache.size+"\n》Channels: "+bot.channels.cache.size+" \n》Developer: kellon#0001```")
.setTimestamp()

return message.channel.send(embed);
}

module.exports.help = {
    name: "bot",
    aliases: ["botinfo"]
}