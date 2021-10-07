const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
    const canvacord = require("canvacord");
const img = message.author.avatarURL();

const rank = new canvacord.Rank()
    .setAvatar(img)
    .setCurrentXP('99')
    .setRequiredXP('100')
    .setStatus("dnd")
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
    name: "moo",
    aliases: []
}