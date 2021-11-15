const Discord = require("discord.js")
const fs = require('fs');
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports.run = async (bot, message, args) => {

    message.channel.send({ content: "Checking for existing cache" })
    try {
        await fs.promises.readFile(`./functions/cache/teammembercache.json`)
        message.channel.send({ content: "Cache found, updating cache" })
    } catch (error) {
        message.channel.send({ content: "Cache not found, creating a new one" })
        await fs.promises.writeFile(`./functions/cache/teammembercache.json`, fs.readFileSync('./functions/cache/emptyteammembercache.json', "utf8"))
    }
    var teamsfile = fs.readFileSync("./teams.json", "utf8");
    var teamlist = JSON.parse(teamsfile)
    var thisguild = bot.guilds.cache.get("874777016241639444")
    var cachevariable = JSON.parse(await fs.readFileSync('./functions/cache/emptyteammembercache.json', "utf8"))
    for (var team in cachevariable.teams) {
        var role = thisguild.roles.cache.get(teamlist.teams[team].teamrole)

        role.members.forEach(Player => {
            sleep(150)
            if (Player.roles.cache.has(teamlist.other.teambossrole)) {
                cachevariable.teams[team].staff.teamboss = `${ Player.nickname || Player.user.username}`
            }
            if(Player.roles.cache.has(teamlist.other.teammanagerrole)){
                cachevariable.teams[team].staff.teammanager = `${ Player.nickname || Player.user.username}`
            }
            if (Player.roles.cache.has(teamlist.other.driverrole)) {
                if (cachevariable.teams[team].staff.driver1 == "none") {
                    cachevariable.teams[team].staff.driver1 = `${ Player.nickname || Player.user.username}`
                } else {
                    cachevariable.teams[team].staff.driver2 = `${ Player.nickname || Player.user.username}`
                }
            }
            if(Player.roles.cache.has(teamlist.other.reserverole)){
                if(cachevariable.teams[team].staff.reserve1 == "none"){
                    cachevariable.teams[team].staff.reserve1 = `${ Player.nickname || Player.user.username}`
                } else {
                    cachevariable.teams[team].staff.reserve2 = `${ Player.nickname || Player.user.username}`
                }
            }
            if(Player.roles.cache.has(teamlist.other.testdriverrole)){
                cachevariable.teams[team].staff.testdriver = `${ Player.nickname || Player.user.username}`
            }
            if(Player.roles.cache.has(teamlist.other.engineerrole)){
                if(cachevariable.teams[team].staff.engineer1 == "none"){
                    cachevariable.teams[team].staff.engineer1 = `${ Player.nickname || Player.user.username}`
                } else {
                    cachevariable.teams[team].staff.engineer1 = `${ Player.nickname || Player.user.username}`
                }
            }
        })

        cachevariable.teams[team].extra.color = thisguild.roles.cache.get(teamlist.teams[team].teamrole).hexColor
    }

    fs.writeFile("./functions/cache/teammembercache.json", JSON.stringify(cachevariable, null, 2), (err) => {
        if (err) {
            console.log(err);
        }
    })
    message.channel.send({ content: "A copy of the cache", files: ['./functions/cache/teammembercache.json'] })
}

module.exports.config = {
    name: "updatecache",
    description: "update the driver cache",
    aliases: ["cache"],
    usage: "updatecache",
    permission: "DEVELOPER"
}