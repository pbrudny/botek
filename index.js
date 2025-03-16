// Load environment variables from .env file
require('dotenv').config();

const { App } = require('@slack/bolt');
const commands = require('./src/commands');
const { logCommand } = require('./src/services/commandLogger');

// Initialize the app with your tokens
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Command: /botek
app.command('/botek', async ({ command, ack, say, client }) => {
  await ack();

  // Log command to Supabase
  await logCommand(command);

  console.log("Command received:", command); // Log the command for debugging

  const fullText = command.text;
  const args = fullText.trim().split(/\s+/);
  const subCommand = args[0].toLowerCase();

  const context = { command, say, client, args, fullText };

  if (subCommand === 'help' || !subCommand) {
    await commands.help(context);
  }
  else if (subCommand === 'echo') {
    await commands.echo(context);
  }
  else if (subCommand === 'grade') {
    await commands.grade(context);
  }
  else if (subCommand === 'give') {
    await commands.give(context);
  }
  else {
    await say(`Unknown command: \`${subCommand}\`. Type \`/botek help\` to see available commands.`);
  }
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Botek is running!');
})();
