const Discord = require('discord.js');
const ms = require('ms');

module.exports.run = async(bot, message, args) => {
let reminder = args.slice(1).join(' ');
let time = args[0];

const noTimeembed = new Discord.MessageEmbed()
.setColor('RED')
.setDescription("❌-Please state a duration for your reminder.")
.setFooter(bot.user.username, bot.user.displayAvatarURL())
.setTimestamp()

if(!time) return message.channel.send(noTimeembed);


const noReminderembed = new Discord.MessageEmbed()
.setColor('RED')
.setDescription("❌-Please state a reminder.")
.setFooter(bot.user.username, bot.user.displayAvatarURL())
.setTimestamp()

if(!reminder) return message.channel.send(noReminderembed);

const reminderSetembed = new Discord.MessageEmbed()
.setColor('GREEN')
.setAuthor('Reminder Set!', message.author.displayAvatarURL())
.setDescription(`✅-Successfully set ${message.author}'s Reminder!`)
.addField('Remind In', `${time}`)
.addField('Reminder', `${reminder}`)
.setFooter(bot.user.username, bot.user.displayAvatarURL())
.setTimestamp()

message.channel.send(reminderSetembed);

setTimeout( async function() {
    message.author.send(`<@${message.author.id}>, here is your reminder!`);

    const reminderAlertembed = new Discord.MessageEmbed()
.setColor('GREEN')
.setAuthor('Reminder Alert!', message.author.displayAvatarURL())
.addField('Reminder', `${reminder}`)
.setFooter(bot.user.username, bot.user.displayAvatarURL())
.setTimestamp()

message.author.send(reminderAlertembed);

}, ms(time));
}

module.exports.help = {
    name: "5346756536",
    aliases: ['73567377','7373254', '799889']
}