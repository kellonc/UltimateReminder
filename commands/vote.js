const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
const embed = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setAuthor(`Vote For ${bot.user.username}`, bot.user.avatarURL())
.setDescription('**[Click To Vote](https://top.gg/bot/866096057770573874/vote)**')

return message.channel.send(embed);
    }

module.exports.help = {
    name: "vote",
    aliases: []
}