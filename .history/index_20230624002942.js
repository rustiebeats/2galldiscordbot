require("dotenv/config");
const { Client, IntentsBitField } = require("discord.js");
const { Configuartion, OpenAIApi } = 

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("The bot is online!");
});

client.on("messageCreate", (message) => {
  console.log(message);
});

client.login(process.env.TOKEN);
