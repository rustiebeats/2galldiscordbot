require("dotenv/config");
const {
  Client,
  CommandInteraction,
  MessageEmbed,
  SlashCommandBuilder,
} = require("discord.js");

const messageCounts = new Map();

function incrementMessageCount(guildId, memberId) {
  if (!messageCounts.has(guildId)) {
    messageCounts.set(guildId, new Map());
  }
  const guildMessageCounts = messageCounts.get(guildId);

  if (!guildMessageCounts.has(memberId)) {
    guildMessageCounts.set(memberId, 0);
  }
  const memberMessageCount = guildMessageCounts.get(memberId);
  guildMessageCounts.set(memberId, memberMessageCount + 1);
}
function getRanking(guildId) {
  if (!messageCounts.has(guildId)) {
    return [];
  }
  const guildMessageCounts = messageCounts.get(guildId);

  const ranking = Array.from(guildMessageCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  );

  return ranking;
}

function createRankingEmbed(ranking) {
  const embed = new MessageEmbed()
    .setTitle("Server Message Ranking")
    .setDescription("Ranking of members based on message count:")
    .setColor("#0099ff");

  ranking.forEach((entry, index) => {
    const memberId = entry[0];
    const member = client.users.cache.get(memberId);
    const messageCount = entry[1];

    embed.addField(
      `${index + 1}. ${member.username}`,
      `Message Count: ${messageCount}`
    );
  });

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("Display the ranking of members based on message count."),
  async execute(interaction) {
    const ranking = getRanking(interaction.guild.id);
    const embed = createRankingEmbed(ranking);
    await interaction.reply({ embeds: [embed] });
  },
};
