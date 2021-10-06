const Discord = require('discord.js');
const userprefix = require('../userprefix.json');
const fs = require('fs');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
    db.set(`user_${message.author.id}.prefixxx`, 'rm')

    const resetEmbed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setDescription("`✅-PREFIX RESET:`\n `new prefix: rm`")

    return message.channel.send(resetEmbed)
}

module.exports.help = {
    name: "reset",
    aliases: []
}