const Discord = require("discord.js")
const checkdevs = require("../../functions/check_developer.js")
const fs = require('fs');
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

module.exports.run = async(bot, message, args) => {

    // console.log(message.guild.members.size)
    var teamsfile = fs.readFileSync("./teams.json", "utf8");
    var teamlist = JSON.parse(teamsfile)
    
    for (var team in teamlist.teams) {

        var embed = new Discord.MessageEmbed()
        .setColor(teamlist.teams[team].teamcolor)
        .setTitle(team)
        .addFields([{
            name: `Teamboss`,
            value: "none"
        },
        {
            name: `Driver`,
            value: "none"
        },
        {
            name: `Driver`,
            value: "none"
        },
        {
            name: `Reserve`,
            value: "none"
        },
        {
            name: `Reserve`,
            value: "none"
        },
        {
            name: `Test`,
            value: "none"
        },
        {
            name: `Engineer`,
            value: "none"
        },
        {
            name: `Engineer`,
            value: "none"
        }])
        var role = message.guild.roles.cache.get(teamlist.teams[team].teamrole)
        console.log(team)
        role.members.forEach(Player => {
            sleep(100)
            if(Player.roles.cache.has(teamlist.other.teambossrole)){
                embed.fields[0].value = `<@${Player.user.id}>`}
            if(Player.roles.cache.has(teamlist.other.driverrole)){
                if(embed.fields[1].value == "none"){
                    embed.fields[1].value = `<@${Player.user.id}>`
                } else {
                    embed.fields[2].value = `<@${Player.user.id}>`
                }
            }
            if(Player.roles.cache.has(teamlist.other.reserverole)){
                if(embed.fields[3].value == "none"){
                    embed.fields[3].value = `<@${Player.user.id}>`
                } else {
                    embed.fields[4].value = `<@${Player.user.id}>`
                }
            }
            if(Player.roles.cache.has(teamlist.other.testdriverrole)){
                embed.fields[5].value = `<@${Player.user.id}>`
            }
            if(Player.roles.cache.has(teamlist.other.engineerrole)){
                if(embed.fields[6].value == "none"){
                    embed.fields[6].value = `<@${Player.user.id}>`
                } else {
                    embed.fields[7].value = `<@${Player.user.id}>`
                }
            }
        });
        await sleep(1000)
        // console.log(message.guild.roles.cache.get(eval(`teamlist.teams[team].teamrole`)).members)
        message.channel.send({
            embeds: [embed]
        })
        
    }
}

module.exports.config = {
    name: "teams",
    description: "print all teams with team staff",
    aliases: [],
    usage: "teams",
    permission: "ADMINISTRATOR",
    requiredrole: "874778868517568543"
}