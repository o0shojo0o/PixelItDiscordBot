module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(client, message, args) {
        message.reply('Pong.');
    },
};