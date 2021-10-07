const Discord = require('discord.js');
const db = require('quick.db');

module.exports.run = async(bot, message, args) => {
    const mems1 = bot.guilds.cache.get("779043676214263808");  
    const mems2 = bot.guilds.cache.get("866488860888399882"); 
    mems1.members.cache.forEach(member => {
        if(!db.get(`user_${member.user.id}.level`) == null){
            db.add(`user_${message.author.id}.level`, 1)
            db.add(`user_${message.author.id}.currentXP`, 1)
            db.add(`user_${message.author.id}.neededXP`, 100)
        }
    }); 
    
    mems2.members.cache.forEach(member => {
        if(!db.get(`user_${member.user.id}.level`) == null){
            db.add(`user_${message.author.id}.level`, 1)
            db.add(`user_${message.author.id}.currentXP`, 1)
            db.add(`user_${message.author.id}.neededXP`, 100)
        }
    }); 
    const collection = new Discord.Collection();

await Promise.all(
    message.guild.members.cache.map(async(member) => {
        const id = member.id;
        const bal = db.get(`user_${id}.level`);
        return bal !== 0 ? collection.set(id, {
            id,
            bal,
        })
        : null
    })
);

    const data = collection.sort((a, b) => b.bal - a.bal).first(10);
    const embed = new Discord.MessageEmbed()
    .setColor('#ebbd34')
    .setTitle(`Leaderboard in ${message.guild.name}`)
    .setDescription(data.map((v, i) => {
        return `> ${i+1}) ${bot.users.cache.get(v.id).tag} | **Level ${v.bal}**`
    }))
    message.channel.send(embed)
}

module.exports.help = {
    name: "leaderboard",
    aliases: ['lb']
}