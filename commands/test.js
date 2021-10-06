const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
const embed = new Discord.MessageEmbed()
.setColor('#2f3136')
.setTitle("Title")
.setAuthor("Author")
.setDescription("Description")
.setFooter("Footer")
.setTimestamp()

return message.channel.send(embed);

}

module.exports.help = {
    name: "test639412551",
    aliases: []
}