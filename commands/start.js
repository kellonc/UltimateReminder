const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
const startEmbed = new Discord.MessageEmbed()
.setAuthor(bot.user.username, bot.user.avatarURL())
.setColor(db.get(`user_${message.author.id}.color`))
.setDescription("**HOW TO USE**")
.addField("Beginners Guide:", "```1. rmHelp\n\n2. rmReminders on\n\n3. rmPremium on/off\n\n4. rmReminders (make sure all reminders are enabled if not follow this, Type\nrmEnable then the reminder name for each one.)\n\n5. rmPrefix (MAKE SURE THIS MATCHES YOUR URPG PREFIX)\n\n6. rmDms on/off (off is recommended) ```")
.setFooter("For further help please contact Staff <3")
return message.channel.send(startEmbed)
}

module.exports.help = {
    name: "start",
    aliases: []
}