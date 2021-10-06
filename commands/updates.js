const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {

const channel = bot.channels.cache.find(channel => channel.id === '866490489775587358')

if(!message.author.id == '828097447611203635') return;

var change = args[0];
var changeTxt = args.slice(1).join(' ');

if(!change) return message.channel.send("Kellon stop forgetting change or changeTxt.");

channel.send("<@&878021274289459200>");

const embed = new Discord.MessageEmbed()
.setColor("#2f3136")
.setAuthor('Ultimate Reminder Update', bot.user.avatarURL())
.addField(`${change}`, "```"+changeTxt+"```")
.setFooter(`Update pushed by: ${message.author.tag}`)

return channel.send(embed);


}

module.exports.help = {
    name: "update",
    aliases: []
}