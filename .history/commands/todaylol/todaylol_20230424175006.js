const { SlashCommandBuilder } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
  data: new SlashCommandBuilder().setName("오롤몇").setDescription("오롤몇"),
  async execute(interaction) {
    const todaylol = client.emojis.cache.find(
      (emoji) => emoji.name === "todaylol"
    );
    return interaction.reply(`${todaylol}`);
  },
};
