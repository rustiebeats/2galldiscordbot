const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("야이씨발아")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    return interaction.reply("Pong!");
  },
};
