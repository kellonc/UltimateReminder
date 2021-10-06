const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
let user = message.mentions.users.first();
let credAmt = args[0];
if(!user) return message.channel.send("`please mention a user.`");
if(Number.isNaN(+credAmt)) return message.channel.send("`args[1] must be a number kellon...`");

if(message.author.id != '828097447611203635') return message.channel.send("`this is a dev command.`");

db.add(`user_${user.id}.credits`, credAmt)

const embed = new Discord.MessageEmbed()
.setDescription(`${user} has been given ${credAmt}<:credit:885343856604876830>\nThey now have ${db.get(`user_${user.id}.credits`)}<:credit:885343856604876830>`)

return message.channel.send(embed);
}

module.exports.help = {
    name: "credits",
    aliases: []
}