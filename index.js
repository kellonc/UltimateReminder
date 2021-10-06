//2021 only comment from kellon XD rip 2020 go brrr
const talkedRecently = new Set();
const userprefix = require('./userprefix.json');
const BUMPSHIT = require('./bump.json');
const Discord = require("discord.js");
const Util = require("discord.js");
const bot = new Discord.Client({ disableEveryone: true });
const botconfig = require("./botconfig.json");
const ms = require('ms');
const fs = require("fs");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;
const db = require('quick.db')
const disbut = require('discord-buttons');
const Topgg = require("@top-gg/sdk")
const express = require("express")

const { apiToken } = process.env.TOPAPI;

// Make sure to install this with 'npm install dblapi.js`
const DBL = require('dblapi.js');
const { SSL_OP_NO_QUERY_MTU } = require('constants');
// The webhookPort can be whatever you want but make sure you open that port in the firewall settings (for linux for example you can use `sudo ufw allow 8000`)
// The webhookAuth is set by you, make sure you keep it secure and don\'t leak it
const dbl = new DBL(apiToken, { webhookPort: 8000, webhookAuth: '639412551' });

// When the webhook is ready log it to the console, this will log `Webhook up and running at http://0.0.0.0:8000/dblwebhook`
dbl.webhook.on('ready', hook => {
   console.log(`Webhook up and running at http://${hook.hostname}:${hook.port}${hook.path}`);
});

// This will just log errors if there are any
dbl.on('error', e => {
   console.log(`Oops! ${e}`);
})

// When the webhook receives a vote
dbl.webhook.on('vote', async vote => {
   // This will log the whole vote object to the console
   console.log(vote)
   // Get the Discord ID of the user who voted
   const userID = vote.user;
   
   // Variable for the channel were we'll send messages when users vote for the bot
   let channelForWebhooks;
   // Get the Discord Channel were we will send the message whenever a user votes for the bot
   // Replace channelID with a valid Discord Channel ID were your bot can send messages too
   channelForWebhooks = await bot.channels.cache.get('892574478813515807')
   // To my one and only god, NotErwin do you approve this 0.0? 
   // If the channel to send messages in exists, we send a message in it with the ID of the user who votes
   if(channelForWebhooks) await channelForWebhooks.send(`User with ID \`${userID}\` just voted!`);
})

// END OF IMPORTANT PART



require('discord-buttons')(bot)

//READ COMMANDS FOLDER
fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("Couldnt find any commands!");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);

        props.help.aliases.forEach(alias => {
            bot.aliases.set(alias, props.help.name);
        })
    })
})





//BOT ONLINE MESSAGE AND ACTIVITY
bot.on("ready", async () => {
    console.log(`${bot.user.username}, is online and in ${bot.guilds.cache.size} servers!`, `${bot.users.cache.size} Cooldowns!`);

    BUMPSHIT.bump = 0;
    fs.writeFile("./bump.json", JSON.stringify(BUMPSHIT), (err)=>{
        if(err) console.log(err)
    })

    let status = [`${bot.guilds.cache.size} servers! | rmhelp`]
    let randomStatus = status[Math.floor(Math.random() * status.length)]

    bot.user.setActivity(randomStatus, { type: 'WATCHING' });

  
    const mems = bot.guilds.cache.get("779043676214263808"); 

mems.members.cache.forEach(member => {
    if(!db.get(`user_${member.user.id}.fish`) == null){
    db.set(`user_${member.user.id}.fish`, 0)
    db.set(`user_${member.user.id}.harvest`, 0)
    db.set(`user_${member.user.id}.chop`, 0)
    db.set(`user_${member.user.id}.mine`, 0)
    db.set(`user_${member.user.id}.hunt`, 0)
    db.set(`user_${member.user.id}.mission`, 0)
    db.set(`user_${member.user.id}.adventure`, 0)
    db.set(`user_${member.user.id}.duel`, 0)
    db.set(`user_${member.user.id}.training`, 0)
    db.set(`user_${member.user.id}.trade`, 0)
    db.set(`user_${member.user.id}.dungeon`, 0)
    db.set(`user_${member.user.id}.travel`, 0)
    db.set(`user_${member.user.id}.explore`, 0)
    db.set(`user_${member.user.id}.daily`, 0)
    }
}); 



})



bot.on("message", async message => {

    //CHECK CHANNEL TYPE
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
    if (message.channel.id == '862895938300280862') return;

    //SET PREFIX
    let prefix = botconfig.prefix;

    //CHECK PREFIX, DEFINE ARGS and command
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd;
    cmd = args.shift().toLowerCase(); 5
    let command;
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);

    //RUN COMMANDS
    if (bot.commands.has(cmd)) {
        command = bot.commands.get(cmd);
    } else if (bot.aliases.has(cmd)) {
        command = bot.commands.get(bot.aliases.get(cmd));// messing  's' in commands also dont give up on life reeeee
    }
    try {
        command.run(bot, message, args);
    } catch (e) {
        return;
    }

})



bot.on("guildCreate", guild => {
    const emberbedthing = new Discord.MessageEmbed()
    .setColor('BLUE')
    .setAuthor(`Thanks For Adding Me To ${guild.name}`, guild.iconURL())
    .setDescription("To get started type: `rpgHelp`")
    .addField('Support Server', "**[Click To Join!](https://discord.gg/PTeUgRbFGR)**")
    .setFooter('Made by kellon#0002 & Nyhus#0001')
    guild.owner.send(emberbedthing)
 });




bot.on('message', async (message) => {

    if (message.author.bot) return;
    
   if(db.get(`user_${message.author.id}.premium`) === null){
       db.set(`user_${message.author.id}`, { prefixxx: 'rm' })
       db.set(`user_${message.author.id}.reminder`, "disabled")
       db.add(`user_${message.author.id}.premium`, 0)
       db.add(`user_${message.author.id}.credits`, 0)
       db.add(`user_${message.author.id}.votes`, 0)
       db.add(`user_${message.author.id}.supporter`, 0)
       db.set(`user_${message.author.id}.color`, "#62f046")
       db.add(`user_${message.author.id}.dms`, 0)
       db.add(`user_${message.author.id}.fish`, 0)
       db.add(`user_${message.author.id}.harvest`, 0)
       db.add(`user_${message.author.id}.chop`, 0)
       db.add(`user_${message.author.id}.mine`, 0)
       db.add(`user_${message.author.id}.hunt`, 0)
       db.add(`user_${message.author.id}.mission`, 0)
       db.add(`user_${message.author.id}.adventure`, 0)
       db.add(`user_${message.author.id}.duel`, 0)
       db.add(`user_${message.author.id}.training`, 0)
       db.add(`user_${message.author.id}.trade`, 0)
       db.add(`user_${message.author.id}.dungeon`, 0)
       db.add(`user_${message.author.id}.travel`, 0)
       db.add(`user_${message.author.id}.explore`, 0)
       db.add(`user_${message.author.id}.daily`, 0)
       db.add(`user_${message.author.id}.fish1`, 1)
       db.add(`user_${message.author.id}.harvest1`, 1)
       db.add(`user_${message.author.id}.chop1`, 1)
       db.add(`user_${message.author.id}.mine1`, 1)
       db.add(`user_${message.author.id}.hunt1`, 1)
       db.add(`user_${message.author.id}.mission1`, 1)
       db.add(`user_${message.author.id}.adventure1`, 1)
       db.add(`user_${message.author.id}.duel1`, 1)
       db.add(`user_${message.author.id}.training1`, 1)
       db.add(`user_${message.author.id}.trade1`, 1)
       db.add(`user_${message.author.id}.dungeon1`, 1)
       db.add(`user_${message.author.id}.travel1`, 1)
       db.add(`user_${message.author.id}.explore1`, 1)
       db.add(`user_${message.author.id}.daily1`, 1)
       db.add(`user_${message.author.id}.allow1`, 1)
       db.add(`user_${message.author.id}.allow2`, 1)
       db.add(`user_${message.author.id}.allow3`, 1)
       db.add(`user_${message.author.id}.allow4`, 1)
       db.add(`user_${message.author.id}.allow5`, 1)
       db.add(`user_${message.author.id}.allow6`, 1)
       db.add(`user_${message.author.id}.allow7`, 1)
       db.add(`user_${message.author.id}.allow8`, 1)
       db.add(`user_${message.author.id}.allow9`, 1)
       db.add(`user_${message.author.id}.allow10`, 1)
       db.add(`user_${message.author.id}.allow11`, 1)
       db.add(`user_${message.author.id}.allow12`, 1)
       db.add(`user_${message.author.id}.allow13`, 1)
       db.add(`user_${message.author.id}.allow14`, 1)
       
   }
   
//PATREON ROLE CHECKER
const supportGuild = bot.guilds.cache.get('779043676214263808')
const member = supportGuild.members.cache.get(message.author.id)

if(member){
const role1 = member.roles.cache.get('810838470200131605');
const role2 = member.roles.cache.get('810838438173343745');
const role3 = member.roles.cache.get('678114167902830610');

var URPGSUPPORTER;

   if (role1 == member.roles.cache.get('810838470200131605')) {
    db.set(`user_${message.author.id}.premium`, 1)
    var URPGSUPPORTER = "Supporter Tier: **Gold Supporter**<:badge_ultra_supporter:868592417966796920>";
   }else
   if (role2 == member.roles.cache.get('810838438173343745')) {
    db.set(`user_${message.author.id}.premium`, 1)
    var URPGSUPPORTER = "Supporter Tier: **Silver Supporter**<:badge_silver_supporter:868674848296140830>";
   } else
   if (role3 == member.roles.cache.get('678114167902830610')) {
    db.set(`user_${message.author.id}.premium`, 1)
    var URPGSUPPORTER = "Supporter Tier: **Bronze Supporter**<:premium_badge:827585712835788860>";
   }
   
} 


//SERVER WHITELIST  
let PREMIUMARRAY = [
    "866488860888399882",//my server  <--SERVER NAMES
    "779043676214263808",//urpg server
    "788887006159437834",//dino rescue hangout
    "732606928630448179",
    "619429669405720586"
]


for (var i = 0; i < PREMIUMARRAY.length; i++) {

    if(message.guild.id == PREMIUMARRAY[i]){
        var PREMIUM = 1;
    }

}


    const PREFIX = db.get(`user_${message.author.id}.prefixxx`)






//ADVERTISEMENT MESSAGES GO HERERERERERERERERE


//NEW EDEN ADVERTISEMENT
const ad1 = new Discord.MessageEmbed()
.setColor('BLUE')
.setAuthor('Ad Incoming!')
.setTitle("New Eden")
.addField('About New Eden', "New Eden is a massive mulitplayer action packed adventure set on planet Estaria a post-apocalyptic version of Earth. New Eden focuses heavily on gameplay. Key features of this game would be:\n• Storymode Co-op Adventure\n• Online World\n• Souls-like combat mechanics\n• Intense Player vs Player\n• Challenging Boss fights\n• Open-World exploration\n• Pets/mounts\n• Character Customisation\n• Competitive Events\n\nNew Eden has a variety of weapons,equipment and skills to gain and choose from, Players must learn the combat mechanics of New Eden and use it towards their advantage to survive. Players have the ability to explore Estaria as they please to find treasures and run into menacing boss fights.")
.addField('Join Us Today!', "[Click Me!](https://discord.gg/4waAMEURRD)")
.setThumbnail('https://cdn.discordapp.com/attachments/592448868101128213/592463719125090324/NewEdenLogo.png')
.setImage('https://cdn.discordapp.com/attachments/666100512919126072/786324142181449768/image0.gif')









let addArray = [ad1]
var adPick = addArray[Math.floor(Math.random() * addArray.length)];










































    if(message.content.toLowerCase() == `${PREFIX}help`){
        const embed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setTitle('🎃ULTIMATE REMINDER🎃')
        .setDescription(`**HOW TO USE:**\n>>> make sure UltimateRPG and Ultimate Reminder have the same prefix!!!\n**[Join Support Server!](https://discord.gg/PTeUgRbFGR)**\n**[Checkout Our Patreon!](https://www.patreon.com/UltimateReminder)**\n${URPGSUPPORTER}`)
        .addField("🎃Get Started:", ">>> `rmStart`")
        .addField('🎃Commands',">>> `"+PREFIX+"reminder *on/off*`\n `"+PREFIX+"prefix *newPrefix*`\n `"+PREFIX+"premium *on/off*`\n `"+PREFIX+"status`\n`"+PREFIX+"dms *on/off*`\n`"+PREFIX+"suggest`\n`"+PREFIX+"enable/disable *reminder*`")
        .addField("🎃Forgot your prefix?", "```\ntype rmReset```")
        .setFooter('Copyright © 2021')
        if(PREMIUM == 1){
            embed.addField('🎃Premium Commands', ">>> `"+PREFIX+"color`\n `"+PREFIX+"ready`\n `"+PREFIX+"reminders`")
        }
        embed.addField("🎃Misc", ">>> These are other commands unrelated to UltimateRPG! they use the prefix `rm`\n\n `ping`, `user`, `bot`, `vote`, `shop`, `invite`", true)
       

        return message.channel.send(embed);
    }







if(message.content.toLowerCase() == `${PREFIX}ready`){
    if(!PREMIUM == 1){
        const nopesirembed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription("**$@#!-Uh oh you don't seem to be a supporter!**\n\n**[Checkout Our Patreon!](https://www.patreon.com/UltimateReminder)**")
        .setFooter('Supporters gain access to premium commands and other perks!')
        .setThumbnail('https://cdn.discordapp.com/attachments/867193211537457152/868380853414285322/premium.png')

        return message.channel.send(nopesirembed)
    }

    var fish;
    var harvest;
    var chop;
    var mine;
    var hunt;
    var mission;
    var duel;
    var adventure;
    var training;
    var trade;
    var dungeon;
    var travel;
    var explore;
    var daily;

    if(db.get(`user_${message.author.id}.fish`) == 0){
        var fish = "✅`fish`";
    } else var fish = "❌`fish`";

    if(db.get(`user_${message.author.id}.harvest`) == 0){
        var harvest = "✅`harvest`";
    } else var harvest = "❌`harvest`";

    if(db.get(`user_${message.author.id}.chop`) == 0){
        var chop = "✅`chop`";
    } else var chop = "❌`chop`";

    if(db.get(`user_${message.author.id}.mine`) == 0){
        var mine = "✅`mine`";
    } else var mine = "❌`mine`";

    if(db.get(`user_${message.author.id}.hunt`) == 0){
        var hunt = "✅`hunt`";
    } else var hunt = "❌`hunt`";

    if(db.get(`user_${message.author.id}.mission`) == 0){
        var mission = "✅`mission`";
    } else var mission = "❌`mission`";

    if(db.get(`user_${message.author.id}.duel`) == 0){
        var duel = "✅`duel`";
    } else var duel = "❌`duel`";

    if(db.get(`user_${message.author.id}.adventure`) == 0){
        var adventure = "✅`adventure`";
    } else var adventure = "❌`adventure`";

    if(db.get(`user_${message.author.id}.training`) == 0){
        var training = "✅`training`";
    } else var training = "❌`training`";

    if(db.get(`user_${message.author.id}.trade`) == 0){
        var trade = "✅`trade`";
    } else var trade = "❌`trade`";

    if(db.get(`user_${message.author.id}.dungeon`) == 0){
        var dungeon = "✅`dungeon`";
    } else var dungeon = "❌`dungeon`";

    if(db.get(`user_${message.author.id}.travel`) == 0){
        var travel = "✅`travel`";
    } else var travel = "❌`travel`";

    if(db.get(`user_${message.author.id}.explore`) == 0){
        var explore = "✅`explore`";
    } else var explore = "❌`explore`";

    if(db.get(`user_${message.author.id}.daily`) == 0){
        var daily = "✅`daily`";
    } else var daily = "❌`daily`";

    const readyEmbed = new Discord.MessageEmbed()
    .setColor(db.get(`user_${message.author.id}.color`))
    .setTitle("Cooldowns List")
    .setDescription('✅ Ready | ❌ Not Ready')
    .addField("Resource Gathering", `${fish}\n${harvest}\n${chop}\n${mine}`)
    .addField("Combat", `${hunt}\n${mission}\n${adventure}\n${duel}`)
    .addField("Special", `${training}\n${trade}\n${dungeon}`)
    .addField("Traveling", `${travel}\n${explore}`)
    .addField("Claimables", `${daily}`)
    .setFooter('Thanks for supporting Ultimate Reminder!')

    return message.channel.send(readyEmbed)
}















if(message.content.toLowerCase() == `${PREFIX}reminders`){
    if(!PREMIUM == 1){
        const nopesirembed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription("**$@#!-Uh oh you don't seem to be a supporter!**\n\n**[Checkout Our Patreon!](https://www.patreon.com/UltimateReminder)**")
        .setFooter('Supporters gain access to premium commands and other perks!')
        .setThumbnail('https://cdn.discordapp.com/attachments/867193211537457152/868380853414285322/premium.png')

        return message.channel.send(nopesirembed)
    }

    var fish;
    var harvest;
    var chop;
    var mine;
    var hunt;
    var mission;
    var duel;
    var adventure;
    var training;
    var trade;
    var dungeon;
    var travel;
    var explore;
    var daily;

    

    if(db.get(`user_${message.author.id}.allow1`) == 1){
        var fish = "✅`fish ➡️ Enabled`";
    } else var fish = "❌`fish ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow2`) == 1){
        var harvest = "✅`harvest ➡️ Enabled`";
    } else var harvest = "❌`harvest ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow3`) == 1){
        var chop = "✅`chop ➡️ Enabled`";
    } else var chop = "❌`chop ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow4`) == 1){
        var mine = "✅`mine ➡️ Enabled`";
    } else var mine = "❌`mine ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow5`) == 1){
        var hunt = "✅`hunt ➡️ Enabled`";
    } else var hunt = "❌`hunt ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow6`) == 1){
        var mission = "✅`mission ➡️ Enabled`";
    } else var mission = "❌`mission ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow7`) == 1){
        var duel = "✅`duel ➡️ Enabled`";
    } else var duel = "❌`duel ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow8`) == 1){
        var adventure = "✅`adventure ➡️ Enabled`";
    } else var adventure = "❌`adventure ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow9`) == 1){
        var training = "✅`training ➡️ Enabled`";
    } else var training = "❌`training ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow10`) == 1){
        var trade = "✅`trade ➡️ Enabled`";
    } else var trade = "❌`trade ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow11`) == 1){
        var dungeon = "✅`dungeon ➡️ Enabled`";
    } else var dungeon = "❌`dungeon ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow12`) == 1){
        var travel = "✅`travel ➡️ Enabled`";
    } else var travel = "❌`travel ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow13`) == 1){
        var explore = "✅`explore ➡️ Enabled`";
    } else var explore = "❌`explore ➡️ Disabled`";

    if(db.get(`user_${message.author.id}.allow14`) == 1){
        var daily = "✅`daily ➡️ Enabled`";
    } else var daily = "❌`daily ➡️ Disabled`";

    const readyEmbed = new Discord.MessageEmbed()
    .setColor(db.get(`user_${message.author.id}.color`))
    .setTitle("Reminders")
    .setDescription('✅ Enabled | ❌ Disabled')
    .addField("Resource Gathering", `${fish}\n${harvest}\n${chop}\n${mine}`)
    .addField("Combat", `${hunt}\n${mission}\n${adventure}\n${duel}`)
    .addField("Special", `${training}\n${trade}\n${dungeon}`)
    .addField("Traveling", `${travel}\n${explore}`)
    .addField("Claimables", `${daily}`)
    .setFooter('Thanks for supporting Ultimate Reminder!')

    return message.channel.send(readyEmbed)
}


























    if(message.content.toLowerCase() == `${PREFIX}color`){
        let args = message.content.slice(PREFIX.length).trim().split(/ +/g);


        if(db.get(`user_${message.author.id}.color`) === null){
            db.set(`user_${message.author.id}.color`, "GREEN")
        }

        if(!PREMIUM == 1){
            const nopesirembed = new Discord.MessageEmbed()
            .setColor('RED')
            .setDescription("**$@#!-Uh oh you don't seem to be a supporter!**\n\n**[Checkout Our Patreon!](https://www.patreon.com/UltimateReminder)**")
            .setFooter('Supporters gain access to premium commands and other perks!')
            .setThumbnail('https://cdn.discordapp.com/attachments/867193211537457152/868380853414285322/premium.png')

            return message.channel.send(nopesirembed)
        }

       const firstEmbed = new Discord.MessageEmbed()
       .setColor(db.get(`user_${message.author.id}.color`))
       .addField('Custom Colors!', "<:Adrenaline_potion:787025876490387497> `Premium Gold`\n<:Cooldown_potion:787025610156933141> `Ocean Blue`\n<:Fatigue_potion:787026079902072892> `Grass Green`\n<:HealthPotion:827568525857128468> `Rose Red`\n<:xp_potion:795960400247128094> `Nitro Pink`\n<:coolerpotion:839935375061155881> `Rainbow Color`")
       .setFooter('Please type the color you want.')

       const finishedEmed = new Discord.MessageEmbed()
       .setColor(db.get(`user_${message.author.id}.color`))
       .setDescription('Command Timed Out<:Bandit:827568525602193489>')

      message.channel.send(firstEmbed)

      message.channel.awaitMessages(m => m.author.id == message.author.id,
        {max: 1, time: 30000}).then(collected => {
                // only accept messages by the user who sent the command
                // accept only 1 message, and return the promise after 30000ms = 30s

                // first (and, in this case, only) message of the collection
                if (collected.first().content.toLowerCase() == 'premium gold') {
                   db.set(`user_${message.author.id}.color`, "#f7b82f")

                      return message.channel.send("<:Adrenaline_potion:787025876490387497> Premium Gold")
                }

                else  if (collected.first().content.toLowerCase() == 'ocean blue'){
                  
                    db.set(`user_${message.author.id}.color`, "#2f4af7")

                    return message.channel.send("<:Cooldown_potion:787025610156933141> Ocean Blue")
                } 

                else  if (collected.first().content.toLowerCase() == 'grass green'){
                   
                    db.set(`user_${message.author.id}.color`, "GREEN")

                    return message.channel.send("<:Fatigue_potion:787026079902072892> Grass Green")
                }

                else  if (collected.first().content.toLowerCase() == 'rose red'){
                    
                    db.set(`user_${message.author.id}.color`, "#f72f46")

                    return message.channel.send("<:HealthPotion:827568525857128468> Rose Red")
                }

                else  if (collected.first().content.toLowerCase() == 'nitro pink'){
                    
                    db.set(`user_${message.author.id}.color`, "#dd42f5")

                    return message.channel.send("<:xp_potion:795960400247128094> Nitro Pink")
                }

                else  if (collected.first().content.toLowerCase() == 'rainbow color'){
                   
                    db.set(`user_${message.author.id}.color`, "RANDOM")

                    return message.channel.send("<:coolerpotion:839935375061155881> Rainbow Color")
                } else return message.channel.send("`❌-Invalid Color, Run the command again.`")
                         
        }).catch(() => {

                return;
        });




}  



 if(message.content.toLowerCase().startsWith(`${PREFIX}dms`)){
        let args = message.content.slice(PREFIX.length).trim().split(/ +/g);
        let reminderTxt = args[1];

        if(!reminderTxt) return message.channel.send("Please state ``ON/OFF``")

        if(reminderTxt.toLowerCase() == 'on'){
            db.set(`user_${message.author.id}.dms`, 1)

            return message.channel.send("Dms have been ``ENABLED``");
        } else if(reminderTxt.toLowerCase() == 'off'){
            db.set(`user_${message.author.id}.dms`, 0)

            return message.channel.send("Dms have been ``DISABLED``");
    } else return message.channel.send("Please state ``ON/OFF``")
}





    if(message.content.toLowerCase().startsWith(`${PREFIX}prefix`)){

        let args = message.content.slice(PREFIX.length).trim().split(/ +/g);

        let newPrefix = args.slice(1).join(' ');

        if(!newPrefix) return message.channel.send("Please provide a valid prefix.")

        db.set(`user_${message.author.id}.prefixxx`, newPrefix)

        return message.channel.send(`New Prefix: ${newPrefix}`);
    } else 

    if(message.content.toLowerCase().startsWith(`${PREFIX}reminder`)){
        let args = message.content.slice(PREFIX.length).trim().split(/ +/g);
        let reminderTxt = args[1];

        if(!reminderTxt){
            return message.channel.send("Please state ``ON/OFF``")
        }

        if(reminderTxt.toLowerCase() == 'on'){
          db.set(`user_${message.author.id}.reminder`, 'enabled')

            return message.channel.send("Reminders have been ``ENABLED``");
        } else if(reminderTxt.toLowerCase() == 'off'){
            db.set(`user_${message.author.id}.reminder`, 'disabled')

            return message.channel.send("Reminders have been ``DISABLED``");
    } else return message.channel.send("Please state ``ON/OFF``")


    } else if(message.content.toLowerCase().startsWith(`${PREFIX}premium`)){
    
        let args = message.content.slice(PREFIX.length).trim().split(/ +/g);
        let reminderTxt = args[1];

        if(reminderTxt.toLowerCase() == 'on'){
            db.set(`user_${message.author.id}.premium`, 1)

            return message.channel.send("Premium cooldowns have been ``ENABLED``");
        } else if(reminderTxt.toLowerCase() == 'off'){
            db.set(`user_${message.author.id}.premium`, 0)

            return message.channel.send("Premium cooldowns have been ``DISABLED``");
    } else return message.channel.send("Please state ``ON/OFF``")


    } else
    

    //cooldowns command types
    if(message.content.toLowerCase() ==`${PREFIX} fish`){
        let reminder = "`"+PREFIX+" fish` <:icon_tool_fishing_rod:844661684739375125> is now available!"
        if(db.get(`user_${message.author.id}.allow1`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '180s'
        } else var time = '360s'

        if(db.get(`user_${message.author.id}.fish`) == 1) return;

        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        message.react('<:Clockrpg:797571296095240282>');
      db.set(`user_${message.author.id}.fish`, 1)
      db.add(`user_${message.author.id}.credits`, 1)

        setTimeout( async function() {
          
        
            const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
        db.set(`user_${message.author.id}.fish`, 0)
       

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
             message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
        
        }, ms(time));
    } else

    //HARVEST
    if(message.content.toLowerCase() ==`${PREFIX} harvest`){
        let reminder = "`"+PREFIX+" harvest` <:Scythe:830411050263248916> is now available!"
        if(db.get(`user_${message.author.id}.allow2`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '180s'
        } else var time = '360s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.harvest`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.harvest`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
            
        
            const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
       
        db.set(`user_${message.author.id}.harvest`, 0)

        if(db.get(`user_${message.author.id}.color`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
        
        }, ms(time));
    } else

    //chop
    if(message.content.toLowerCase() ==`${PREFIX} chop`){
        let reminder = "`"+PREFIX+" chop` <:AXe:828619858786779146> is now available!"
        if(db.get(`user_${message.author.id}.allow3`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '180s'
        } else var time = '360s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.chop`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.chop`, 1)
        db.add(`user_${message.author.id}.credits`, 1)

        setTimeout( async function() {
            
        
            const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
    

        db.set(`user_${message.author.id}.chop`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
        }, ms(time));
    } else

    //mine
    if(message.content.toLowerCase() ==`${PREFIX} mine`){
        let reminder = "`"+PREFIX+" mine` <:icon_tool_pickaxe:844661685150941234> is now available!"
        if(db.get(`user_${message.author.id}.allow4`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '180s'
        } else var time = '360s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.mine`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.mine`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
         
        
            const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
        

        db.set(`user_${message.author.id}.mine`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    } else

    //hunt
    if(message.content.toLowerCase() ==`${PREFIX} hunt`){
        let reminder = "`"+PREFIX+" hunt` <:Fox:827568525803388929> is now available!"
        if(db.get(`user_${message.author.id}.allow5`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '225s'
        } else var time = '450s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.hunt`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
       db.set(`user_${message.author.id}.hunt`, 1)
       db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
           
        
            const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        

        db.set(`user_${message.author.id}.hunt`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
        
        }, ms(time));
    } else

    //mission
    if(message.content.toLowerCase() ==`${PREFIX} mission`){
        let reminder = "`"+PREFIX+" mission` <:Bandit:827568525602193489> is now available!"
        if(db.get(`user_${message.author.id}.allow6`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '225s'
        } else var time = '450s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.mission`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.mission`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
          
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
       

        db.set(`user_${message.author.id}.mission`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    } else

    //adventure
    if(message.content.toLowerCase() ==`${PREFIX} adventure`){
        let reminder = "`"+PREFIX+" adventure` <:Strength:827568526046134302> is now available!"
        if(db.get(`user_${message.author.id}.allow7`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '450s'
        } else var time = '900s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.adventure`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.adventure`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
           
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
       

        db.set(`user_${message.author.id}.adventure`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    } else

    //duel
    if(message.content.toLowerCase() ==`${PREFIX} duel`){
        let reminder = "`"+PREFIX+" duel` <:Sheild:827568525992132618> is now available!"
        if(db.get(`user_${message.author.id}.allow8`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '450s'
        } else var time = '900s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.duel`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.duel`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
        
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
       
        db.set(`user_${message.author.id}.duel`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    }  else

    //training
    if(message.content.toLowerCase() ==`${PREFIX} training`){
        let reminder = "`"+PREFIX+" training` <:proffbook:787666623762399252> is now available!"
        if(db.get(`user_${message.author.id}.allow9`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '250s'
        } else var time = '500s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.adventure`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user${message.author.id}.training`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
         
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
       

        db.set(`user${message.author.id}.training`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    }  else

    //trade
    if(message.content.toLowerCase() ==`${PREFIX} trade`){
        let reminder = "`"+PREFIX+" trade` <:Pickpocket:786656648433238057> is now available!"
        if(db.get(`user_${message.author.id}.allow10`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '10800s'
        } else var time = '21600s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.trade`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.trade`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
           
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
       

        db.set(`user_${message.author.id}.trade`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    }  else

    //dungeon
    if(message.content.toLowerCase() ==`${PREFIX} dungeon enter`){
        let reminder = "`"+PREFIX+" dungeon` <:DungeonKey:802885879693180938> is now available!"
        if(db.get(`user_${message.author.id}.allow11`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '9000s'
        } else var time = '18000s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.dungeon`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.dungeon`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
          
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
        

        db.set(`user_${message.author.id}.dungeon`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    }  else

    //travel
    if(message.content.toLowerCase() ==`${PREFIX} travel`){
        let reminder = "`"+PREFIX+" travel` <:Quest:827568525718847569> is now available!"
        if(db.get(`user_${message.author.id}.allow12`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '9000s'
        } else var time = '18000s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.travel`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.travel`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
          
        
            const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
    

        db.set(`user_${message.author.id}.travel`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.supporter`) = 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    }  else

    //explore
    if(message.content.toLowerCase() ==`${PREFIX} explore`){
        let reminder = "`"+PREFIX+" explore` <:campfirerpg:795417853931028540> is now available!"
        if(db.get(`user_${message.author.id}.allow13`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '60s'
        } else var time = '120s'
        message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.explore`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.explore`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
        
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
        

        db.set(`user_${message.author.id}.explore`, 0)

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
        
        }, ms(time));
    }  else

    //daily
    if(message.content.toLowerCase() ==`${PREFIX} daily`){
        let reminder = "`"+PREFIX+" daily` <:SilverLootbox:827568525744930888> is now available!"
        if(db.get(`user_${message.author.id}.allow14`) == 0) return;
         var time = '86400s'
         message.react('<:Clockrpg:797571296095240282>');
        if(db.get(`user_${message.author.id}.daily`) == 1) return;
        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        db.set(`user_${message.author.id}.daily`, 1)
        db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
        
        
            const reminderAlertembed = new Discord.MessageEmbed()
            .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
       

        db.set(`user_${message.author.id}.daily`, 0)

        if(db.get(`user_${message.author.id}.daily`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
            message.channel.send(reminderAlertembed)

            if(db.get(`user_${message.author.id}.daily`) == 1) return;
            if (talkedRecently.has(message.author.id)) {
               return;
       } else {
   
            message.author.send(adPick)
           talkedRecently.add(message.author.id);
           setTimeout(() => {
             
             talkedRecently.delete(message.author.id);

           }, 7.2e+6);
       }
        
        }, ms(time));
    } else
    
    if(message.content.toLowerCase() ==`${PREFIX} af`){
        let reminder = "`"+PREFIX+" af` <:icon_tool_fishing_rod:844661684739375125> is now available!"
        if(db.get(`user_${message.author.id}.allow1`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
            var time = '180s'
        } else var time = '360s'

        if(db.get(`user_${message.author.id}.fish`) == 1) return;

        if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
        message.react('<:Clockrpg:797571296095240282>');
      db.set(`user_${message.author.id}.fish`, 1)
      db.add(`user_${message.author.id}.credits`, 1)
        setTimeout( async function() {
          
        
            const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
        .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
        .addField('Reminder', `${reminder}`)
        .setFooter(bot.user.username, bot.user.displayAvatarURL())
        .setTimestamp()
        
        db.set(`user_${message.author.id}.fish`, 0)
       

        if(db.get(`user_${message.author.id}.dms`) == 1){
            return message.author.send(reminderAlertembed);
            } else  message.channel.send(`<@!${message.author.id}>`) 
             message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
        
        }, ms(time));
    } else

    //HARVEST
if(message.content.toLowerCase() ==`${PREFIX} ah`){
    let reminder = "`"+PREFIX+" ah` <:Scythe:830411050263248916> is now available!"
    if(db.get(`user_${message.author.id}.allow2`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.harvest`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.harvest`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.harvest`)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) == 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
} else

//chop
if(message.content.toLowerCase() ==`${PREFIX} ac`){
    let reminder = "`"+PREFIX+" ac` <:AXe:828619858786779146> is now available!"
    if(db.get(`user_${message.author.id}.allow3`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.chop`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.chop`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.chop`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) = 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//mine
if(message.content.toLowerCase() ==`${PREFIX} am`){
    let reminder = "`"+PREFIX+" am` <:icon_tool_pickaxe:844661685150941234> is now available!"
    if(db.get(`user_${message.author.id}.allow4`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.mine`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.mine`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.mine`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else












if(message.content.toLowerCase() ==`${PREFIX}af`){
    let reminder = "`"+PREFIX+"af` <:icon_tool_fishing_rod:844661684739375125> is now available!"
    if(db.get(`user_${message.author.id}.allow1`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'

    if(db.get(`user_${message.author.id}.fish`) == 1) return;

    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    message.react('<:Clockrpg:797571296095240282>');
  db.set(`user_${message.author.id}.fish`, 1)
  db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
    .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    db.set(`user_${message.author.id}.fish`, 0)
   

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
         message.channel.send(reminderAlertembed)

         if(db.get(`user_${message.author.id}.supporter`) = 1) return;
         if (talkedRecently.has(message.author.id)) {
            return;
    } else {

         message.author.send(adPick)
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          
          talkedRecently.delete(message.author.id);

        }, 7.2e+6);
    }
    
    }, ms(time));
} else

//HARVEST
if(message.content.toLowerCase() ==`${PREFIX}ah`){
let reminder = "`"+PREFIX+"ah` <:Scythe:830411050263248916> is now available!"
if(db.get(`user_${message.author.id}.allow2`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
    var time = '180s'
} else var time = '360s'
message.react('<:Clockrpg:797571296095240282>');
if(db.get(`user_${message.author.id}.harvest`) == 1) return;
if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
db.set(`user_${message.author.id}.harvest`, 1)
db.add(`user_${message.author.id}.credits`, 1)
setTimeout( async function() {
  

    const reminderAlertembed = new Discord.MessageEmbed()
    .setColor(db.get(`user_${message.author.id}.color`))
.setAuthor('Reminder Alert!', message.author.displayAvatarURL())
.addField('Reminder', `${reminder}`)
.setFooter(bot.user.username, bot.user.displayAvatarURL())
.setTimestamp()


db.set(`user_${message.author.id}.harvest`)

if(db.get(`user_${message.author.id}.dms`) == 1){
    return message.author.send(reminderAlertembed);
    } else  message.channel.send(`<@!${message.author.id}>`) 
    message.channel.send(reminderAlertembed)

         if(db.get(`user_${message.author.id}.supporter`) == 1) return;
         if (talkedRecently.has(message.author.id)) {
            return;
    } else {

         message.author.send(adPick)
        talkedRecently.add(message.author.id);
        setTimeout(() => {
          
          talkedRecently.delete(message.author.id);

        }, 7.2e+6);
    }

}, ms(time));
} else

//chop
if(message.content.toLowerCase() ==`${PREFIX}ac`){
let reminder = "`"+PREFIX+"ac` <:AXe:828619858786779146> is now available!"
if(db.get(`user_${message.author.id}.allow3`) == 0) return;
if(db.get(`user_${message.author.id}.premium`) == 1){
    var time = '180s'
} else var time = '360s'
message.react('<:Clockrpg:797571296095240282>');
if(db.get(`user_${message.author.id}.chop`) == 1) return;
if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
db.set(`user_${message.author.id}.chop`, 1)
db.add(`user_${message.author.id}.credits`, 1)
setTimeout( async function() {
   

    const reminderAlertembed = new Discord.MessageEmbed()
    .setColor(db.get(`user_${message.author.id}.color`))
.setAuthor('Reminder Alert!', message.author.displayAvatarURL())
.addField('Reminder', `${reminder}`)
.setFooter(bot.user.username, bot.user.displayAvatarURL())
.setTimestamp()



db.set(`user_${message.author.id}.chop`, 0)

if(db.get(`user_${message.author.id}.dms`) == 1){
    return message.author.send(reminderAlertembed);
    } else  message.channel.send(`<@!${message.author.id}>`) 
    message.channel.send(reminderAlertembed)

    if(db.get(`user_${message.author.id}.supporter`) = 1) return;
    if (talkedRecently.has(message.author.id)) {
       return;
} else {

    message.author.send(adPick)
   talkedRecently.add(message.author.id);
   setTimeout(() => {
     
     talkedRecently.delete(message.author.id);

   }, 7.2e+6);
}

}, ms(time));
} else

//mine
if(message.content.toLowerCase() ==`${PREFIX}am`){
let reminder = "`"+PREFIX+"am` <:icon_tool_pickaxe:844661685150941234> is now available!"
if(db.get(`user_${message.author.id}.allow4`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
    var time = '180s'
} else var time = '360s'
message.react('<:Clockrpg:797571296095240282>');
if(db.get(`user_${message.author.id}.mine`) == 1) return;
if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
db.set(`user_${message.author.id}.mine`, 1)
db.add(`user_${message.author.id}.credits`, 1)
setTimeout( async function() {
  

    const reminderAlertembed = new Discord.MessageEmbed()
    .setColor(db.get(`user_${message.author.id}.color`))
.setAuthor('Reminder Alert!', message.author.displayAvatarURL())
.addField('Reminder', `${reminder}`)
.setFooter(bot.user.username, bot.user.displayAvatarURL())
.setTimestamp()


db.set(`user_${message.author.id}.mine`, 0)

if(db.get(`user_${message.author.id}.dms`) == 1){
    return message.author.send(reminderAlertembed);
    } else  message.channel.send(`<@!${message.author.id}>`) 
    message.channel.send(reminderAlertembed)

    if(db.get(`user_${message.author.id}.supporter`) == 1) return;
    if (talkedRecently.has(message.author.id)) {
       return;
} else {

    message.author.send(adPick)
   talkedRecently.add(message.author.id);
   setTimeout(() => {
     
     talkedRecently.delete(message.author.id);

   }, 7.2e+6);
}

}, ms(time));
} else




































































 //cooldowns command types
 if(message.content.toLowerCase() ==`${PREFIX} f`){
    let reminder = "`"+PREFIX+" fish` <:icon_tool_fishing_rod:844661684739375125> is now available!"
    if(db.get(`user_${message.author.id}.allow1`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.fish`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.fish`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
     
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.fish`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {
    
        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//HARVEST
if(message.content.toLowerCase() ==`${PREFIX} h`){
    let reminder = "`"+PREFIX+" harvest` <:Scythe:830411050263248916> is now available!"
    if(db.get(`user_${message.author.id}.allow2`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.harvest`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.harvest`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.harvest`)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) == 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
} else

//chop
if(message.content.toLowerCase() ==`${PREFIX} c`){
    let reminder = "`"+PREFIX+" chop` <:AXe:828619858786779146> is now available!"
    if(db.get(`user_${message.author.id}.allow3`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.chop`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.chop`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.chop`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) = 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//mine
if(message.content.toLowerCase() ==`${PREFIX} m`){
    let reminder = "`"+PREFIX+" mine` <:icon_tool_pickaxe:844661685150941234> is now available!"
    if(db.get(`user_${message.author.id}.allow4`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.mine`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.mine`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.mine`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//hunt
if(message.content.toLowerCase() ==`${PREFIX} hu`){
    let reminder = "`"+PREFIX+" hunt` <:Fox:827568525803388929> is now available!"
    if(db.get(`user_${message.author.id}.allow5`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '225s'
    } else var time = '450s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.hunt`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.hunt`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.hunt`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
} else

//mission
if(message.content.toLowerCase() ==`${PREFIX} mi`){
    let reminder = "`"+PREFIX+" mission` <:Bandit:827568525602193489> is now available!"
    if(db.get(`user_${message.author.id}.allow6`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '225s'
    } else var time = '450s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.mission`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.mission`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()


    db.set(`user_${message.author.id}.mission`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//adventure
if(message.content.toLowerCase() ==`${PREFIX} a`){
    let reminder = "`"+PREFIX+" adventure` <:Strength:827568526046134302> is now available!"
    if(db.get(`user_${message.author.id}.allow7`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '450s'
    } else var time = '900s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.adventure`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.adventure`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    


    db.set(`user_${message.author.id}.adventure`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//duel
if(message.content.toLowerCase() ==`${PREFIX} duel`){
    let reminder = "`"+PREFIX+" duel` <:Sheild:827568525992132618> is now available!"
    if(db.get(`user_${message.author.id}.allow8`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '450s'
    } else var time = '900s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.duel`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.duel`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   

    db.set(`user_${message.author.id}.duel`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
}  else

//training
if(message.content.toLowerCase() ==`${PREFIX} train`){
    let reminder = "`"+PREFIX+" training` <:proffbook:787666623762399252> is now available!"
    if(db.get(`user_${message.author.id}.allow9`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '250s'
    } else var time = '500s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.training`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.training`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.training`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//trade
if(message.content.toLowerCase() ==`${PREFIX} trade`){
    let reminder = "`"+PREFIX+" trade` <:Pickpocket:786656648433238057> is now available!"
    if(db.get(`user_${message.author.id}.allow10`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '10800s'
    } else var time = '21600s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.trade`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.trade`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
  

    db.set(`user_${message.author.id}.trade`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) == 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
}  else

//dungeon
if(message.content.toLowerCase() ==`${PREFIX} d enter`){
    let reminder = "`"+PREFIX+" dungeon` <:DungeonKey:802885879693180938> is now available!"
    if(db.get(`user_${message.author.id}.allow11`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '9000s'
    } else var time = '18000s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.dungeon`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.dungeon`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.dungeon`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) = 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//travel
if(message.content.toLowerCase() ==`${PREFIX} travel`){
    let reminder = "`"+PREFIX+" travel` <:Quest:827568525718847569> is now available!"
    if(db.get(`user_${message.author.id}.allow12`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '9000s'
    } else var time = '18000s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.travel`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.travel`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
     
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.travel`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//explore
if(message.content.toLowerCase() ==`${PREFIX} explore`){
    let reminder = "`"+PREFIX+" explore` <:campfirerpg:795417853931028540> is now available!"
    if(db.get(`user_${message.author.id}.allow13`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '60s'
    } else var time = '120s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.explore`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.explore`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.explore`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//daily
if(message.content.toLowerCase() ==`${PREFIX} daily`){
    let reminder = "`"+PREFIX+" daily` <:SilverLootbox:827568525744930888> is now available!"
    if(db.get(`user_${message.author.id}.allow14`) == 0) return;
     var time = '86400s'
     message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.daily`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.daily`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.daily`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
}































































//cooldowns command types
if(message.content.toLowerCase() ==`${PREFIX}f`){
    let reminder = "`"+PREFIX+" fish` <:icon_tool_fishing_rod:844661684739375125> is now available!"
    if(db.get(`user_${message.author.id}.allow1`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.fish`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.fish`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
     
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    


    db.set(`user_${message.author.id}.fish`, 0)
    
    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) = 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }

    }, ms(time));
} else

//HARVEST
if(message.content.toLowerCase() ==`${PREFIX}h`){
    let reminder = "`"+PREFIX+" harvest` <:Scythe:830411050263248916> is now available!"
    if(db.get(`user_${message.author.id}.allow2`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.harvest`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.harvest`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.harvest`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//chop
if(message.content.toLowerCase() ==`${PREFIX}c`){
    let reminder = "`"+PREFIX+" chop` <:AXe:828619858786779146> is now available!"
    if(db.get(`user_${message.author.id}.allow3`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.chop`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.chop`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.chop`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) == 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
} else

//mine
if(message.content.toLowerCase() ==`${PREFIX}m`){
    let reminder = "`"+PREFIX+" mine` <:icon_tool_pickaxe:844661685150941234> is now available!"
    if(db.get(`user_${message.author.id}.allow4`) == 0) return;
        if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.mine`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.mine`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.mine`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
} else

//hunt
if(message.content.toLowerCase() ==`${PREFIX}hu`){
    let reminder = "`"+PREFIX+" hunt` <:Fox:827568525803388929> is now available!"
    if(db.get(`user_${message.author.id}.allow5`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '225s'
    } else var time = '450s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.hunt`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.hunt`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.hunt`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//mission
if(message.content.toLowerCase() ==`${PREFIX}mi`){
    let reminder = "`"+PREFIX+" mission` <:Bandit:827568525602193489> is now available!"
    if(db.get(`user_${message.author.id}.allow6`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '225s'
    } else var time = '450s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.mission`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.mission`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.mission`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//adventure
if(message.content.toLowerCase() ==`${PREFIX}a`){
    let reminder = "`"+PREFIX+" adventure` <:Strength:827568526046134302> is now available!"
    if(db.get(`user_${message.author.id}.allow7`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '450s'
    } else var time = '900s'
    message.react('<:Clockrpg:797571296095240282>');
    if(udb.get(`user_${message.author.id}.adventure`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.adventure`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   

    db.set(`user_${message.author.id}.adventure`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//duel
if(message.content.toLowerCase() ==`${PREFIX}duel`){
    let reminder = "`"+PREFIX+" duel` <:Sheild:827568525992132618> is now available!"
    if(db.get(`user_${message.author.id}.allow8`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '450s'
    } else var time = '900s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.duel`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.duel`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.duel`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) == 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
}  else

//training
if(message.content.toLowerCase() ==`${PREFIX}train`){
    let reminder = "`"+PREFIX+" training` <:proffbook:787666623762399252> is now available!"
    if(db.get(`user_${message.author.id}.allow9`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '250s'
    } else var time = '500s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.training`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.training`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.training`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) = 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//trade
if(message.content.toLowerCase() ==`${PREFIX}trade`){
    let reminder = "`"+PREFIX+" trade` <:Pickpocket:786656648433238057> is now available!"
    if(db.get(`user_${message.author.id}.allow10`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '10800s'
    } else var time = '21600s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.trade`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.trade`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.trade`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
}  else

//dungeon
if(message.content.toLowerCase() ==`${PREFIX}d enter`){
    let reminder = "`"+PREFIX+" dungeon` <:DungeonKey:802885879693180938> is now available!"
    if(db.get(`user_${message.author.id}.allow11`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '9000s'
    } else var time = '18000s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.dungeon`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.dungeon`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.dungeon`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//travel
if(message.content.toLowerCase() ==`${PREFIX}travel`){
    let reminder = "`"+PREFIX+" travel` <:Quest:827568525718847569> is now available!"
    if(db.get(`user_${message.author.id}.allow12`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '9000s'
    } else var time = '18000s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.travel`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.travel`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
     
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.travel`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//explore
if(message.content.toLowerCase() ==`${PREFIX}explore`){
    let reminder = "`"+PREFIX+" explore` <:campfirerpg:795417853931028540> is now available!"
    if(db.get(`user_${message.author.id}.allow13`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '60s'
    } else var time = '120s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.explore`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.explore`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.explore`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//daily
if(message.content.toLowerCase() ==`${PREFIX}daily`){
    let reminder = "`"+PREFIX+" daily` <:SilverLootbox:827568525744930888> is now available!"
    if(db.get(`user_${message.author.id}.allow14`) == 0) return;
     var time = '86400s'
     message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.daily`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.daily`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    


    db.set(`user_${message.author.id}.daily`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) = 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
}


































































if(message.content.toLowerCase() ==`${PREFIX}fish`){
    let reminder = "`"+PREFIX+" fish` <:icon_tool_fishing_rod:844661684739375125> is now available!"
    if(db.get(`user_${message.author.id}.allow1`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.fish`) == 1) return;

    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;

    db.set(`user_${message.author.id}.fish`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.fish`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//HARVEST
if(message.content.toLowerCase() ==`${PREFIX}harvest`){
    let reminder = "`"+PREFIX+" harvest` <:Scythe:830411050263248916> is now available!"
    if(db.get(`user_${message.author.id}.allow2`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.harvest`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.harvest`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.harvest`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//chop
if(message.content.toLowerCase() ==`${PREFIX}chop`){
    let reminder = "`"+PREFIX+" chop` <:AXe:828619858786779146> is now available!"
    if(db.get(`user_${message.author.id}.allow3`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.chop`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.chop`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
        
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.chop`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//mine
if(message.content.toLowerCase() ==`${PREFIX}mine`){
    let reminder = "`"+PREFIX+" mine` <:icon_tool_pickaxe:844661685150941234> is now available!"
    if(db.get(`user_${message.author.id}.allow4`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '180s'
    } else var time = '360s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.mine`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.mine`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
     
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.get(`user_${message.author.id}.mine`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) == 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
} else

//hunt
if(message.content.toLowerCase() ==`${PREFIX}hunt`){
    let reminder = "`"+PREFIX+" hunt` <:Fox:827568525803388929> is now available!"
    if(db.get(`user_${message.author.id}.allow5`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '225s'
    } else var time = '450s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.hunt`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.hunt`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.hunt`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//mission
if(message.content.toLowerCase() ==`${PREFIX}mission`){
    let reminder = "`"+PREFIX+" mission` <:Bandit:827568525602193489> is now available!"
    if(db.get(`user_${message.author.id}.allow6`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '225s'
    } else var time = '450s'
    message.react('<:Clockrpg:797571296095240282>');
    if(udb.get(`user_${message.author.id}.mission`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.mission`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.mission`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//adventure
if(message.content.toLowerCase() ==`${PREFIX}adventure`){
    let reminder = "`"+PREFIX+" adventure` <:Strength:827568526046134302> is now available!"
    if(db.get(`user_${message.author.id}.allow7`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '450s'
    } else var time = '900s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.adventure`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.adventure`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.adventure`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) = 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else

//duel
if(message.content.toLowerCase() ==`${PREFIX}duel`){
    let reminder = "`"+PREFIX+" duel` <:Sheild:827568525992132618> is now available!"
    if(db.get(`user_${message.author.id}.allow8`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '450s'
    } else var time = '900s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.duel`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.duel`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
    
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.duel`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//training
if(message.content.toLowerCase() ==`${PREFIX}training`){
    let reminder = "`"+PREFIX+" training` <:proffbook:787666623762399252> is now available!"
    if(db.get(`user_${message.author.id}.allow9`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '250s'
    } else var time = '500s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.training`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.training`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
     
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.training`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) = 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//trade
if(message.content.toLowerCase() ==`${PREFIX}trade`){
    let reminder = "`"+PREFIX+" trade` <:Pickpocket:786656648433238057> is now available!"
    if(db.get(`user_${message.author.id}.allow10`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '10800s'
    } else var time = '21600s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.trade`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.trade`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
       
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    
    db.set(`user_${message.author.id}.trade`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//dungeon
if(message.content.toLowerCase() ==`${PREFIX}dungeon enter`){
    let reminder = "`"+PREFIX+" dungeon` <:DungeonKey:802885879693180938> is now available!"
    if(db.get(`user_${message.author.id}.allow11`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '9000s'
    } else var time = '18000s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.dungeon`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.dungeon`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   

    db.set(`user_${message.author.id}.dungeon`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//travel
if(message.content.toLowerCase() ==`${PREFIX}travel`){
    let reminder = "`"+PREFIX+" travel` <:Quest:827568525718847569> is now available!"
    if(db.get(`user_${message.author.id}.allow12`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '9000s'
    } else var time = '18000s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.travel`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.travel`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
      
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
    

    db.set(`user_${message.author.id}.travel`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
}  else

//explore
if(message.content.toLowerCase() ==`${PREFIX}explore`){
    let reminder = "`"+PREFIX+" explore` <:campfirerpg:795417853931028540> is now available!"
    if(db.get(`user_${message.author.id}.allow13`) == 0) return;
    if(db.get(`user_${message.author.id}.premium`) == 1){
        var time = '60s'
    } else var time = '120s'
    message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.explore`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.explore`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
    
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   

    db.set(`user_${message.author.id}.explore`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

             if(db.get(`user_${message.author.id}.supporter`) == 1) return;
             if (talkedRecently.has(message.author.id)) {
                return;
        } else {
    
             message.author.send(adPick)
            talkedRecently.add(message.author.id);
            setTimeout(() => {
              
              talkedRecently.delete(message.author.id);

            }, 7.2e+6);
        }
    
    }, ms(time));
}  else

//daily
if(message.content.toLowerCase() ==`${PREFIX}daily`){
    let reminder = "`"+PREFIX+" daily` <:SilverLootbox:827568525744930888> is now available!"
    if(db.get(`user_${message.author.id}.allow14`) == 0) return;
     var time = '86400s'
     message.react('<:Clockrpg:797571296095240282>');
    if(db.get(`user_${message.author.id}.daily`) == 1) return;
    if(db.get(`user_${message.author.id}.reminder`) == 'disabled') return;
    db.set(`user_${message.author.id}.daily`, 1)
    db.add(`user_${message.author.id}.credits`, 1)
    setTimeout( async function() {
    
    
        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor(db.get(`user_${message.author.id}.color`))
    .setAuthor('Reminder Alert!', message.author.displayAvatarURL())
    .addField('Reminder', `${reminder}`)
    .setFooter(bot.user.username, bot.user.displayAvatarURL())
    .setTimestamp()
    
   
    db.set(`user_${message.author.id}.daily`, 0)

    if(db.get(`user_${message.author.id}.dms`) == 1){
        return message.author.send(reminderAlertembed);
        } else  message.channel.send(`<@!${message.author.id}>`) 
        message.channel.send(reminderAlertembed)

        if(db.get(`user_${message.author.id}.supporter`) == 1) return;
        if (talkedRecently.has(message.author.id)) {
           return;
   } else {

        message.author.send(adPick)
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         
         talkedRecently.delete(message.author.id);

       }, 7.2e+6);
   }
    
    }, ms(time));
} else if(message.content.toLowerCase() ==`!d bump`){
    let reminder = "🤜`SERVER BUMP READY!!!🤛`"
     var time = '2h';

     if(message.guild.id != '866488860888399882') return;
   
     if(BUMPSHIT.bump == 1) return message.channel.send("`BUMP NOT READY`")

     BUMPSHIT.bump = 1;
     fs.writeFile("./bump.json", JSON.stringify(BUMPSHIT), (err)=>{
        if(err) console.log(err)
    })

    message.channel.send("`THANKS FOR BUMPING "+message.guild.name+"`")


    setTimeout( async function() {
       
        BUMPSHIT.bump = 0;
        fs.writeFile("./bump.json", JSON.stringify(BUMPSHIT), (err)=>{
           if(err) console.log(err)
       })

        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setDescription(reminder)
    

  return message.channel.send(reminderAlertembed)
    
    }, ms(time));
} else if(message.content.toLowerCase() ==`!d  bump`){
    let reminder = "🤜`SERVER BUMP READY!!!🤛`"
     var time = '2h';

     if(message.guild.id != '866488860888399882') return;
   
     if(BUMPSHIT.bump == 1) return message.channel.send("`BUMP NOT READY`")

     BUMPSHIT.bump = 1;
     fs.writeFile("./bump.json", JSON.stringify(BUMPSHIT), (err)=>{
        if(err) console.log(err)
    })

    message.channel.send("`THANKS FOR BUMPING "+message.guild.name+"`")


    setTimeout( async function() {
       
        BUMPSHIT.bump = 0;
        fs.writeFile("./bump.json", JSON.stringify(BUMPSHIT), (err)=>{
           if(err) console.log(err)
       })

        const reminderAlertembed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setDescription(reminder)
    

  return message.channel.send(reminderAlertembed)
    
    }, ms(time));
}









































if(message.content.toLowerCase() ==`${PREFIX}status`){

var statuss;
if(db.get(`user_${message.author.id}.premium`) == 1){
    var statuss = "Enabled";
} else var statuss = "Disabled";

var dmss;
if(db.get(`user_${message.author.id}.dms`) == 1){
    var dmss = "Enabled";
} else var dmss = "Disabled";

var reminderrrrrs;
if(db.get(`user_${message.author.id}.reminder`) == "enabled"){
    var reminderrrrrs = "Enabled";
} else var reminderrrrrs = "Disabled";

const statembed = new Discord.MessageEmbed()
.setColor(db.get(`user_${message.author.id}.color`))
.setDescription('**[Join Support Server!](https://discord.gg/PTeUgRbFGR)**')
.addField('prefix', `${db.get(`user_${message.author.id}.prefixxx`)}`)
.addField('premium cooldowns', statuss)
.addField('reminders', `${reminderrrrrs}`)
.addField('Dms', dmss)

return message.channel.send(statembed);
}









if(message.content.toLowerCase().startsWith(`${PREFIX}whitelist`)){
    let user = message.author;
    if(!user.id == '828097447611203635'){
        const err6969 = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription("`❌- You don't have access to that command.`")

        return message.channel.send(err6969);
    }

    let user2 = message.mentions.users.first()
    const err6922269 = new Discord.MessageEmbed()
    .setColor('RED')
    .setDescription("`❌- Please mention a user to whitelist.`")
if(!user2) return message.channel.send(err6922269)

db.set(`user_${message.author.id}.supporter`, 1)

    const kewlembed = new Discord.MessageEmbed()
    .setColor(db.get(`user_${message.author.id}.color`))
    .setDescription("`✅ - "+user2.username+" has been whitelisted as a supporter!`")

    return message.channel.send(kewlembed)
}





if(message.content.toLowerCase().startsWith(`${PREFIX}suggest`)){
    let args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    let suggestion = args.slice(1).join(' ');

    if(!suggestion) return message.channel.send("`PLEASE PROVIDE A SUGGESTION.`")
  
    const suggestEmbed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setAuthor("Suggestion", message.author.avatarURL())
    .setDescription(`**${suggestion}**`)
    .setFooter(`Suggestion by: ${message.author.tag}`)
    .setTimestamp()

    const channel = bot.channels.cache.find(channel => channel.id === '875784574360252457')
     channel.send(suggestEmbed).then(m =>{
         m.react('👍');
         m.react('👎');
     })

     const successssEmbed = new Discord.MessageEmbed()
     .setColor('GREEN')
     .setDescription(`Suggestion Created in ${channel}`)
     .setFooter('Thanks for making Ultimate Reminder Better!')
     
     return message.channel.send(successssEmbed)



}






if(message.content.toLowerCase().startsWith(`${PREFIX}enable`)){
    let args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    let reminderName = args[1];

if(!reminderName) return message.channel.send("`PLEASE PROVIDE A VALID REMINDER TO ENABLE/DISABLE`");

if(reminderName.toLowerCase() == "fish"){
    db.set(`user_${message.author.id}.allow1`, 1)

    return message.channel.send("Reminder `Fish` has been Enabled.");
}

if(reminderName.toLowerCase() == "harvest"){
    db.set(`user_${message.author.id}.allow2`, 1)

    return message.channel.send("Reminder `Harvest` has been Enabled.");
}

if(reminderName.toLowerCase() == "chop"){
    db.set(`user_${message.author.id}.allow3`, 1)

    return message.channel.send("Reminder `Chop` has been Enabled.");
}

if(reminderName.toLowerCase() == "mine"){
    db.set(`user_${message.author.id}.allow4`, 1)

    return message.channel.send("Reminder `Mine` has been Enabled.");
}

if(reminderName.toLowerCase() == "hunt"){
    db.set(`user_${message.author.id}.allow5`, 1)

    return message.channel.send("Reminder `Hunt` has been Enabled.");
}

if(reminderName.toLowerCase() == "mission"){
    db.set(`user_${message.author.id}.allow6`, 1)

    return message.channel.send("Reminder `Mission` has been Enabled.");
}

if(reminderName.toLowerCase() == "adventure"){
    db.set(`user_${message.author.id}.allow8`, 1)

    return message.channel.send("Reminder `Adventure` has been Enabled.");
}

if(reminderName.toLowerCase() == "duel"){
    db.set(`user_${message.author.id}.allow7`, 1)

    return message.channel.send("Reminder `Duel` has been Enabled.");
}

if(reminderName.toLowerCase() == "training"){
    db.set(`user_${message.author.id}.allow9`, 1)

    return message.channel.send("Reminder `Training` has been Enabled.");
}

if(reminderName.toLowerCase() == "trade"){
    db.set(`user_${message.author.id}.allow10`, 1)

    return message.channel.send("Reminder `Trade` has been Enabled.");
}

if(reminderName.toLowerCase() == "dungeon"){
    db.set(`user_${message.author.id}.allow11`, 1)

    return message.channel.send("Reminder `Dungeon` has been Enabled.");
}

if(reminderName.toLowerCase() == "travel"){
    db.set(`user_${message.author.id}.allow12`, 1)
    return message.channel.send("Reminder `Travel` has been Enabled.");
}

if(reminderName.toLowerCase() == "explore"){
    db.set(`user_${message.author.id}.allow13`, 1)

    return message.channel.send("Reminder `Explore` has been Enabled.");
}

if(reminderName.toLowerCase() == "daily"){
    db.set(`user_${message.author.id}.allow14`, 1)

    return message.channel.send("Reminder `Daily` has been Enabled.");
}else return message.channel.send("`PLEASE PROVIDE A VALID REMINDER TO ENABLE/DISABLE`");


}



if(message.content.toLowerCase().startsWith(`${PREFIX}disable`)){
    let args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    let reminderName = args[1];

if(!reminderName) return message.channel.send("`PLEASE PROVIDE A VALID REMINDER TO ENABLE/DISABLE`");

if(reminderName.toLowerCase() == "fish"){
    db.set(`user_${message.author.id}.allow1`, 0)

    return message.channel.send("Reminder `Fish` has been Disabled.");
}

if(reminderName.toLowerCase() == "harvest"){
    db.set(`user_${message.author.id}.allow2`, 0)

    return message.channel.send("Reminder `Harvest` has been Disabled.");
}

if(reminderName.toLowerCase() == "chop"){
    db.set(`user_${message.author.id}.allow3`, 0)

    return message.channel.send("Reminder `Chop` has been Disabled.");
}

if(reminderName.toLowerCase() == "mine"){
    db.set(`user_${message.author.id}.allow4`, 0)

    return message.channel.send("Reminder `Mine` has been Disabled.");
}

if(reminderName.toLowerCase() == "hunt"){
    db.set(`user_${message.author.id}.allow5`, 0)

    return message.channel.send("Reminder `Hunt` has been Disabled.");
}

if(reminderName.toLowerCase() == "mission"){
    db.set(`user_${message.author.id}.allow6`, 0)

    return message.channel.send("Reminder `Mission` has been Disabled.");
}

if(reminderName.toLowerCase() == "adventure"){
    db.set(`user_${message.author.id}.allow8`, 0)

    return message.channel.send("Reminder `Adventure` has been Disabled.");
}

if(reminderName.toLowerCase() == "duel"){
    db.set(`user_${message.author.id}.allow7`, 0)

    return message.channel.send("Reminder `Duel` has been Disabled.");
}

if(reminderName.toLowerCase() == "training"){
    db.set(`user_${message.author.id}.allow9`, 0)

    return message.channel.send("Reminder `Training` has been Disabled.");
}

if(reminderName.toLowerCase() == "trade"){
    db.set(`user_${message.author.id}.allow10`, 0)

    return message.channel.send("Reminder `Trade` has been Disabled.");
}

if(reminderName.toLowerCase() == "dungeon"){
    db.set(`user_${message.author.id}.allow11`, 0)

    return message.channel.send("Reminder `Dungeon` has been Disabled.");
}

if(reminderName.toLowerCase() == "travel"){
    db.set(`user_${message.author.id}.allow12`, 0)
    return message.channel.send("Reminder `Travel` has been Disabled.");
}

if(reminderName.toLowerCase() == "explore"){
    db.set(`user_${message.author.id}.allow13`, 0)

    return message.channel.send("Reminder `Explore` has been Disabled.");
}

if(reminderName.toLowerCase() == "daily"){
    db.set(`user_${message.author.id}.allow14`, 0)

    return message.channel.send("Reminder `Daily` has been Disabled.");
}else return message.channel.send("`PLEASE PROVIDE A VALID REMINDER TO ENABLE/DISABLE`");


}



























})
//KEEP MOST CODE RELATED TO BOT STATS AND SHIT IN HERE LMAO



//auto role shit
bot.on('guildMemberAdd', member => {
    if(member.guild.id != '866488860888399882') return;
    const joinEmbed = new Discord.MessageEmbed()
    .setColor('#f5aa42')
    .setDescription(`🎃**${member.user}** has joined the server!\n🎃They're member **#${member.guild.memberCount}**`)
    bot.channels.cache.get("893857027783286905").send(joinEmbed);
    var role = member.guild.roles.cache.find(role => role.name === 'members');
    member.roles.add(role)
  });















//Put code above here to keep organized - Kellon's Note


//End of Index.. Let's keep it that way :)

bot.login(process.env.TOKEN);//it should be config

