const prefix = "!"

module.exports.run = async (client, message) => {
    // Is the bot itself the author of the incoming message?
    if (message.author.bot) {
        return;
    }
    // Starts the incoming message with the prefix?
    if (message.content.startsWith(prefix)) {

        const messageArray = message.content.split(' ');
        const cmd = messageArray[0];
        const args = messageArray.slice(1);
        const commandfile = client.commands.get(cmd.slice(prefix.length)) || client.aliases.get(cmd.slice(prefix.length));

        if (!commandfile){
            return;
        } 
        commandfile.execute(client, message, args);
    }
}