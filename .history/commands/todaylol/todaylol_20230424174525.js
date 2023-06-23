const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("오롤몇")
    .setDescription("오롤몇"),
  async execute(interaction) {
    return interaction.react("");
  },
};
