const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("야이씨발아")
    .setDescription("야이씨발아"),
  async execute(interaction) {
    return interaction.reply("야이씨발아");
  },
};
