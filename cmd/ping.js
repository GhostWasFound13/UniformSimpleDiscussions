
module.exports = {
  name: "ping",
  run: async (message, bot, args) => {
    await bot.createMessage(message.channelId, {
      embeds:[{
        title: "hello",
        description: "tesy",
        color: "#3426ae9e"
      }]
    });
  }
};
