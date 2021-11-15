const Discord = require('discord.js');
const botsettings = require('./config.json');
require('dotenv').config()
const checkdevs = require("./functions/check_developer.js")


const bot = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_PRESENCES] });


const fs = require("fs");
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();

const express = require('express');
const app = express();
const port = 3000;


bot.login(process.env.TOKEN);


bot.on('ready', async() => {
    console.log(bot.user.username + " Is online!")
})


// register command
fs.readdir("./commands/", (err, files) => {
    let folder = files.filter(f => f.split(".").pop())

    for (i = 0; i < folder.length; i++) {
        loadCommands(folder[i])
    }

});

// commandhandler
bot.on("messageCreate", async message => {
    if (message.channel.type === "dm") return;

    let prefix = botsettings.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if (commandfile) {
        message.delete()
        if (commandfile.config.permission == "DEVELOPER" && await checkdevs.check(message.author.id) == false) {
            message.channel.send({content: `<@${message.author.id}>  Only bot developers can access this command`})
            return;
        } else {
            if (commandfile.config.permission == "ADMINISTRATOR" && !message.member.roles.cache.find(r => r.id == commandfile.config.requiredrole)) {
                message.channel.send({content: `<@${message.author.id}> You do not have the required role to execute this command`})
                return
            } else {
                commandfile.run(bot, message, args)
            }

        }

    }
})

async function loadCommands(folder) {
    fs.readdir(`./commands/${folder}/`, (err, files) => {
        if (err) console.log(err)

        let jsfile = files.filter(f => f.split(".").pop() === "js")

        jsfile.forEach((f, i) => {
            let pull = require(`./commands/${folder}/${f}`);
            bot.commands.set(pull.config.name, pull);
            console.log("command " + botsettings.prefix + pull.config.name + " loaded")
            pull.config.aliases.forEach(alias => {
                bot.aliases.set(alias, pull.config.name)
                console.log(`new alias loaded for ${botsettings.prefix + pull.config.name} (${botsettings.prefix + alias})`)
            });
        });
    })

}

module.exports = {
    getbot: function() {
       return bot
    }
}


// WEBPAGES

const session = require('express-session')
const passport = require('passport')

// WebPagina stuff
const authRoute = require('./api/dashboard')
const teamapi = require('./api/teams')
    // const techRoute = require('./api/tech')
const homeRoute = require('./Website/RouterHandler')

const DiscordStrategy = require('./Website/discordstrategy')

// app.set('trust proxy', true)
// app.use((req, res, next) => {
//   if(!req.secure) return res.redirect('https://' + req.get('host') + req.url);
//   next();
// })


passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
app.use(session({
    secret: 'pqwoeiuytlakssjdhgmznncbv',
    cookie: {
        maxAge: 60000 * 60
    },
    saveUninitialized: false,
    name: '_dl'
}))
app.use(passport.initialize())
app.use(passport.session())


app.use('/dashboard', authRoute)
app.use('/teamapi', teamapi)
app.use('', homeRoute)

const listener = app.listen(port, () => {
    console.log("Your app is listening on port:" + listener.address().port);
});