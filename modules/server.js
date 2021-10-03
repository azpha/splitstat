const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const discord = require('discord.js');
const axios = require('axios');
const config = require('../configd.json');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const webhookClient = new discord.WebhookClient({ id: config.botuser.webhooks.voting.webhookId, token: config.botuser.webhooks.voting.webhookToken });

app.get('/', (req, res) => {
    res.send({ "status": 200 });
})

app.post('/webhook', async (req, res) => {
    try {
        const user = await axios.get(`https://discord.com/api/users/${req.body.user}`, {
            method: 'GET',
            headers: { 'authorization': `Bot ${config.botuser.token}` }
        })

        await webhookClient.send({
            content: `Thanks **${user.data.username}#${user.data.discriminator}** for [voting for SplitStat](https://top.gg/bot/868689248218411050/vote) on **Top.gg**!`,
            username: `SplitStat - Voting!`,
            avatarURL: `https://cdn.discordapp.com/app-icons/868689248218411050/cfb8eb37a8dcacefc9228d0949667ff1.png`
        })
    } catch(err) {
        console.log(err)
        return res.status(500).send({ "status": 500, "errors": err.message })
    }

    return res.status(200).send({ "status": 200 })
})

app.listen(1330, () => {
    console.log(`Listening on PORT 1330`)
})