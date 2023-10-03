module.exports = async (bot, message) => {
    if (!message.content.startsWith("!") || message.author.bot) {
        return;
    }

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = bot.commands.get(commandName);

    if (!command) {
        return;
    }

    try {
        await command.run(message, bot, args);
    } catch (error) {
        console.error(`error command execution "${commandName}":`, error);
        await bot.createMessage(message.channelId, "Something went wrong check the console.");
    }
});
