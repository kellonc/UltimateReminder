const Discord = require('discord.js');

module.exports.run = async(bot, message, args) => {
const user = message.mentions.users.first()

if(!user) return message.channel.send("```err.. no user provided.\nprocess stopped.```")

let fakeIps = ["172.98.80.82", "95.152.51.179", "80.209.225.17","5.30.217.203","95.181.237.25","95.181.237.16","52.162.161.148","40.88.10.164","82.76.234.80","207.46.145.56","Protected","154.16.192.44"]
let IP = fakeIps[Math.floor(Math.random() * fakeIps.length)];

let fakeAddy = ["NYC, New York","Los Angeles, California","Chicago, Illinois","Houston, Texas","Phoenix, Arizona","Philadelphia, Pennsylvania","San Antonio, Texas","San Diego, California","Jacksonville, Florida"]
let ADDRESS = fakeAddy[Math.floor(Math.random() * fakeAddy.length)];

const embed = new Discord.MessageEmbed()
.setColor('#2f3136')
.setAuthor('Ultimate Hacker', user.avatarURL())
.setDescription("```Name: "+user.username+"\nIP: "+IP+"\nID: "+user.id+"\nAddress: "+ADDRESS+"\n\n\n Process Complete.```")

return message.channel.send(embed);
}

module.exports.help = {
    name: "hack",
    aliases: []
}