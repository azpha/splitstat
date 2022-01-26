const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const config = require('./config.json');
const db = require('./modules/db');

// Create an SQL table to store a users friends
db(`CREATE TABLE IF NOT EXISTS friends (
    pending INT NOT NULL,
    user_id varchar(255) NOT NULL,
    friend_id varchar(255) NOT NULL
)`);

db(`CREATE TABLE IF NOT EXISTS users (
    id varchar(255) UNIQUE,
    gameid varchar(255),
    dscid varchar(255) UNIQUE
  )`)

const client = new Client(
    { 
        intents: [
            Intents.FLAGS.GUILDS, 
            Intents.FLAGS.GUILD_MESSAGES
        ] 
    });

// Command Handling
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Event Handling
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

if(config.env === 'dev') {
    client.login(config.tokens.dev);
} else if (config.env === 'prod') {
    client.login(config.tokens.prod);
} else {
    console.log(chalk.redBright.bold('\nSplitStat failed to start!'), `\nUnknown environment "${config.env}".\n`)
}