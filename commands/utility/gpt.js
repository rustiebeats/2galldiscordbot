require("dotenv/config");
const { SlashCommandBuilder } = require("discord.js");

const { ChatGPTClient } = require("discordjs-chatgpt");
const chatgpt = new ChatGPTClient(process.env.API_KEY, {
  contextRemembering: true,
  responseType: "embed",
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chatgpt")
    .setDescription("Talk with Chat-GPT!")
    .addStringOption((option) =>
      option.setName("message").setDescription("Your message")
    ),
  async execute(interaction) {
    const msg = interaction.options.getString("message", true);
    await chatgpt.chatInteraction(interaction, msg);
  },
};
