// Load environment variables from .env file
require('dotenv').config();

const { App } = require('@slack/bolt');

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
            text: "• `/botek help` - Display this help message\n• `/botek echo [message]` - Echo back your message\n• `/botek grade @user [score] for [test]` - Send grade information to user\n• `/botek give extra to @user` - Give an extra point to user\n• `/botek give half extra to @user` - Give half an extra point to user"
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
  // Command: /botek grade
  else if (subCommand === 'grade') {
    try {
      // Extract user ID from the mention
      const userMention = args[1];
      if (!userMention || !userMention.startsWith('<@')) {
        await say("Please specify a user with @mention. Example: `/botek grade @user 5 for 1on1`");
        return;
      }

      // Extract user ID (format is <@USER_ID>)
      const userId = userMention.slice(2, -1).split('|')[0];

      // Extract grade
      const grade = args[2];
      if (!grade || isNaN(grade)) {
        await say("Please provide a valid grade. Example: `/botek grade @user 5 for 1on1`");
        return;
      }

      // Find "for" keyword index
      const forIndex = args.findIndex(arg => arg.toLowerCase() === 'for');
      if (forIndex === -1 || forIndex >= args.length - 1) {
        await say("Please specify what the grade is for. Example: `/botek grade @user 5 for 1on1`");
        return;
      }

      // Extract test name (everything after "for")
      const testName = args.slice(forIndex + 1).join(' ');

      // Send DM to the user
      await client.chat.postMessage({
        channel: userId,
        text: `You got grade ${grade} for ${testName} test`
      });

      // Confirm to command initiator
      await say(`Grade ${grade} for ${testName} has been sent to <@${userId}>`);
    } catch (error) {
      console.error(error);
      await say("There was an error processing the grade command. Please check the format: `/botek grade @user 5 for 1on1`");
    }
  }
  // Command: /botek give
  else if (subCommand === 'give') {
    try {
      const fullCommand = args.join(' ').toLowerCase();
      let points = 1;
      let userId;

      // Handle "give half extra to @user"
      if (fullCommand.includes('half extra')) {
        points = 0.5;
        // Find the user mention after "half extra to"
        const userMentionIndex = args.findIndex((arg, index) =>
          index > 0 && args[index-1].toLowerCase() === 'to' && arg.startsWith('<@')
        );

        if (userMentionIndex === -1) {
          await say("Please specify a user with @mention. Example: `/botek give half extra to @user`");
          return;
        }

        userId = args[userMentionIndex].slice(2, -1).split('|')[0];
      }
      // Handle "give extra to @user"
      else if (fullCommand.includes('extra to')) {
        // Find the user mention after "extra to"
        const userMentionIndex = args.findIndex((arg, index) =>
          index > 0 && args[index-1].toLowerCase() === 'to' && arg.startsWith('<@')
        );

        if (userMentionIndex === -1) {
          await say("Please specify a user with @mention. Example: `/botek give extra to @user`");
          return;
        }

        userId = args[userMentionIndex].slice(2, -1).split('|')[0];
      } else {
        await say("Invalid command format. Try `/botek give extra to @user` or `/botek give half extra to @user`");
        return;
      }

      // Send message to the user
      const message = points === 1
        ? "Great. You have got extra point :trophy:"
        : "Nice. You have got 0.5 of extra point :trophy:";

      await client.chat.postMessage({
        channel: userId,
        text: message
      });

      // Confirm to command initiator
      const confirmMessage = points === 1
        ? `Extra point has been given to <@${userId}>`
        : `Half extra point has been given to <@${userId}>`;

      await say(confirmMessage);
    } catch (error) {
      console.error(error);
      await say("There was an error processing the give command. Please check the format.");
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
