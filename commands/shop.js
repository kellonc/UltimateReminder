const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {

const embed = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setAuthor(`${bot.user.username}'s Shop`, bot.user.avatarURL())
.addField("Free Premium?!", "Premium: <:credit:885343856604876830>**30**")
.addField("Roles", "Coming soon :)")
.addField("Your Credits", `<:credit:885343856604876830>**${db.get(`user_${message.author.id}.credits`)}**`)
.setFooter("Type: rmBuy - Ultimate Reminder <3")

return message.channel.send(embed);
}

module.exports.help = {
name: "shop",
aliases: []
}