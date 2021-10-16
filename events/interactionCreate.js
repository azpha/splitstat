const Discord = require('discord.js');
const config = require('../configd.json');

module.exports = {
    name: 'interactionCreate',
    on: true,
    async execute(interaction) {
        if(!interaction.isCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if(!command) return;

        if(command.info.deprecated) {
            return await interaction.reply(`Hey, **${interaction.user.tag}**!\nThis command is now **deprecated** and is due to be removed from the bot.\n\n**Date of Deprecation: ${command.info.deprecated.date}**\n**Reason of Deprecation: ${command.info.deprecated.reason}**`)
        } else if (config.maintenance === true) {
            return await interaction.reply(`Hey, **${interaction.user.tag}**!\nSplitStat is currently in maintenance mode. This is generally done to push *big* updates that can't be pushed when the bot is on.\nFor updates, **join the Discord server!**\nhttps://dsc.gg/splitstat`)
        } else {
            try {
                console.log(`${interaction.user.tag} just ran ${command.name} in ${interaction.member.guild}!`)
                await command.execute(interaction);
            } catch (error) {
                await interaction.reply({ content: 'There was an error while executing this command! This has been sent to Awex!\n**Error:** ' + '`' + error.message + '`' });
                const webhookClient = new Discord.WebhookClient({ id: config.botuser.webhooks.errors.webhookId, token: config.botuser.webhooks.errors.webhookToken });

                var time = Date.now();
                const errorEmbed = new Discord.MessageEmbed()
                .setAuthor(`SplitStat Bot`, `https://images.mmorpg.com/images/games/logos/32/1759_32.png?cb=87A6A764853AF7668409F25907CC7EC4`)
                .setColor(`#2c1178`)
                .setTitle(`SplitStat Error!`)
                .addFields(
                    { name: 'Guild', value: `${interaction.member.guild.name}`, inline: true },
                    { name: 'User', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Command', value: `${command.name}`, inline: true }
                )
                .setDescription(`SplitStat encountered an error at <t:${Math.round(time / 1000)}:f>.\n\n**Error Type: ${error.name}**\n**Full Error: ${error.message}**`)

                return webhookClient.send({
                    username: 'SplitStat - Errors',
                    avatarURL: 'https://cdn.discordapp.com/app-icons/868689248218411050/cfb8eb37a8dcacefc9228d0949667ff1.png',
                    embeds: [errorEmbed]
                });
            }
        }
    }
}