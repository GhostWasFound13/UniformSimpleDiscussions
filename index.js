const {
    Client,
    Intents,
    GatewayEventNames,
} = require("zeneth");
const fs = require("fs");
const { FerraLink } = require("ferra-link");
const { Connectors } = require("shoukaku");
const bot = new Client({
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    token: "MTEzMjk0Nzk0Mjg5NTAwMTY2MQ.G-mlEO.W3VGLZWCtO1mw0KhktGGlUm73l_F04bECImmdE",
  presence: {
      activities: [{
        name: "astra bot is using zeneth",
        type: 0
      }],
      afk: false,
      since: Math.trunc(Date.now()/1000),
      status: 'dnd'
    }
});

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith("js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  bot.on(file.split(".")[0], (...args) => event(bot, ...args));
}

bot.FerraLink = new FerraLink({
    nodes: [{
      name: "Lavalink",
      url: "localhost:2333",
      auth: "youshallpass",
      secure: false
    }],
    shoukakuoptions: {
        moveOnDisconnect: false,
        resumable: false,
        resumableTimeout: 60,
        reconnectTries: 10,
        restTimeout: 60000
    },
    spotify: [{
        ClientID: "Your spotify clientId here",
        ClientSecret: "Your spotify clientSecret here"
    }],
    defaultSearchEngine: "FerralinkSpotify",
}, new Connectors.DiscordJS(bot));

bot.commands = new Map();

const loadCommands = (bot) => {
    const commandsFolder = "./cmd";

    fs.readdir(commandsFolder, (err, files) => {
        if (err) {
            console.error("Error reading folder with commands:", err);
            return;
        }

        files.forEach((file) => {
            const filePath = `${commandsFolder}/${file}`;

            if (!file.endsWith(".js")) {
                console.warn(`file "${file}" is not JavaScript-file and will be ignored.`);
                return;
            }

            try {
                const command = require(filePath);

                bot.commands.set(command.name, command);

                console.log(`loaded command: ${command.name}`);
            } catch (error) {
                console.error(`error load command - ${file}":`, error);
            }
        });
    });
};

bot.on(GatewayEventNames.Ready, () => {
    console.log(`logged in to : ${bot.user.username}`);

    loadCommands(bot);
});

