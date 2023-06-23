const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("야이씨발아")
    .setDescription("오롤몇"),
  async execute(interaction) {
    return interaction.react("야이씨발아");
  },
};
