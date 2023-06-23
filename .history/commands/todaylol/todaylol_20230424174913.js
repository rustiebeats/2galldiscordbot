const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("오롤몇").setDescription("오롤몇"),
  async execute(interaction) {
    const todaylol = 
    return interaction.reply("todaylol:1099979020386439248");
  },
};
