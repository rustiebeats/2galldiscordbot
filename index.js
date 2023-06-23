require("dotenv/config");
const fs = require("node:fs");
const path = require("node:path");
const Discord = require("discord.js");
const config = require("./config.json");
const {
  Client,
  IntentsBitField,
  Collection,
  Events,
  GatewayIntentBits,
} = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    GatewayIntentBits.Guilds,
  ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, () => {
  console.log("The bot is online!");
});

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  // console.log(args); OK
  const command = args.shift().toLowerCase();
  if (command === "gpt") {
    let conversationLog = [
      {
        role: "system",
        content: "You are a friendly bot",
      },
    ];

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (!message.content.indexOf(config.prefix)) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id !== message.author.id) return;

      conversationLog.push({
        role: "user",
        content: msg.content.replace(/^[^\s]+\s/, ""),
      });
    });

    conversationLog.push({
      role: "user",
      content: message.content.replace(/^[^\s]+\s/, ""),
    });

    await message.channel.sendTyping();

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversationLog,
    });

    message.reply(result.data.choices[0].message);
  }
});

// client.on("messageCreate", async (message) => {
//   if (message.author.bot) return;
//   if (message.channel.id !== process.env.CHANNEL_ID) return;
//   if (!message.content.indexOf(config.prefix)) return;

//   let conversationLog = [
//     {
//       role: "system",
//       content: "You are a friendly bot",
//     },
//   ];

//   await message.channel.sendTyping();

//   let prevMessages = await message.channel.messages.fetch({ limit: 15 });
//   prevMessages.reverse();

//   prevMessages.forEach((msg) => {
//     if (!message.content.indexOf(config.prefix)) return;
//     if (msg.author.id !== client.user.id && message.author.bot) return;
//     if (msg.author.id !== message.author.id) return;

//     conversationLog.push({
//       role: "user",
//       content: msg.content,
//     });
//   });

//   conversationLog.push({
//     role: "user",
//     content: message.content,
//   });

//   await message.channel.sendTyping();

//   const result = await openai.createChatCompletion({
//     model: "gpt-3.5-turbo",
//     messages: conversationLog,
//   });

//   message.reply(result.data.choices[0].message);
// });

client.login(process.env.TOKEN);
