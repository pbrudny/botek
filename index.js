// Slack Bot Implementation using Node.js and the Slack Bolt Framework

const { App } = require('@slack/bolt');

// Initialize the app with your tokens
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Command: /botek help
app.command('/botek', async ({ command, ack, say }) => {
  await ack();

  const args = command.text.trim().split(' ');
  const subCommand = args[0].toLowerCase();

  if (subCommand === 'help' || !subCommand) {
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Available Botek Commands:*"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "• `/botek help` - Display this help message\n• `/botek echo [message]` - Echo back your message"
          }
        }
      ]
    });
  }
  // Command: /botek echo
  else if (subCommand === 'echo') {
    const message = args.slice(1).join(' ');
    if (message) {
      await say(`Echo: ${message}`);
    } else {
      await say("Please provide a message to echo. Example: `/botek echo Hello World!`");
    }
  }
  // Unknown command
  else {
    await say(`Unknown command: \`${subCommand}\`. Type \`/botek help\` to see available commands.`);
  }
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Botek is running!');
})();
