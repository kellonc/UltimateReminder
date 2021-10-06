const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
    if(message.author.id != '828097447611203635') return;
const e1 = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.addField("Q: Bot Problem?", "A: Contact a staff member or dm a Developer ASAP.")

const e2 = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.addField("Q: How can I support the bot?", "A: Patreon or just add it to your server :)")

const e3 = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.addField("Q: How do I use the bot?", "A: Type: `rmStart` or ask a peer.")
.setImage('https://cdn.discordapp.com/attachments/885336108425175131/894775017525628959/YfAQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQItBFQALeJ2qAECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECKQLKIDTEzY.png')

 message.channel.send(e1)
 message.channel.send(e2)
 message.channel.send(e3)
}

module.exports.help = {
    name: "faq",
    aliases: []
}