const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
const embed = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setDescription("[Invite me to your server!](https://discord.com/api/oauth2/authorize?client_id=866096057770573874&permissions=1074097216&scope=bot)")
return message.channel.send(embed);
}

module.exports.help = {
    name: "invite",
    aliases: []
}