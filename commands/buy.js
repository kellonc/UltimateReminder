const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
let buyTxt = args.join(' ');
const errEmbed = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setAuthor('$@#!')
.setDescription("Err.. not enough credits!")
.setFooter("Earn credits by voting! rmVote")

const errEmbed2 = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setAuthor('$@#!')
.setDescription("Err.. not a valid shop item!")
.setFooter("try: rmShop")

if(buyTxt.toLowerCase() == "premium"){
if(db.get(`user_${message.author.id}.supporter`) == 1) return message.channel.send("`You're already supporting Ultimate Reminder <3`");
if(db.get(`user_${message.author.id}.credits`) < 30) return message.channel.send(errEmbed);
db.add(`user_${message.author.id}.credits`, -30)
db.set(`user_${message.author.id}.premium`, 1)
db.set(`user_${message.author.id}.supporter`, 1)

var role = message.member.guild.roles.cache.find(role => role.name === "early supporter");
message.member.roles.add(role);

const premiumEmbed = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setDescription("✅ - You are now a Supporter of Ultimate Reminder!")
.setFooter("All Premium Perks have been added.")
return message.channel.send(premiumEmbed);
} else return message.channel.send(errEmbed2)
}

module.exports.help = {
    name: "buy",
    aliases: []
}