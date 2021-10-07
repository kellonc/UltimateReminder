const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {

if(db.get(`user_${message.author.id}.level`) === null){
    db.set(`user_${message.author.id}.level`, 1)
    db.set(`user_${message.author.id}.currentXP`, 1)
    db.set(`user_${message.author.id}.neededXP`, 100)
}

const current = db.get(`user_${message.author.id}.currentXP`)
const needed = db.get(`user_${message.author.id}.neededXP`)
const level = db.get(`user_${message.author.id}.level`)

    const canvacord = require("canvacord");
const img = message.author.displayAvatarURL({ format: 'png'});

const rank = new canvacord.Rank()
    .setAvatar(img)
    .setCurrentXP(current)
    .setRequiredXP(needed)
    .setLevel(level)
    .setLevelColor('#ebbd34')
    .setStatus(message.author.presence.status)
    .setProgressBar("#ebbd34", "COLOR")
    .setUsername(message.author.username)
    .setDiscriminator(message.author.discriminator);

rank.build()
    .then(data => {
        const attachment = new Discord.MessageAttachment(data, "RankCard.png");
        message.channel.send(attachment);
    });
}

module.exports.help = {
    name: "rank",
    aliases: []
}