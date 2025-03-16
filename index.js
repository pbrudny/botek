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

  console.log("Command received:", command); // Log the command for debugging

  const fullText = command.text;
  const args = fullText.trim().split(/\s+/);
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
      // Check if there's a user mention as the second argument
      if (args.length < 2 || !args[1].startsWith('@')) {
        await say("Please specify a user with @mention. Example: `/botek grade @user 5 for 1on1`");
        return;
      }

      // Extract username (remove @ symbol)
      const username = args[1].substring(1);

      // We'll need to look up the user ID from the username
      try {
        // Look up user by email (if it's an email) or by username
        const lookupMethod = username.includes('@') ? 'lookupByEmail' : 'lookupByUsername';
        const lookupValue = username.includes('@') ? username : username;

        let userInfo;

        // Handle lookup based on method
        if (lookupMethod === 'lookupByUsername') {
          // Get user list and find by username
          const result = await client.users.list();
          userInfo = result.members.find(user =>
            user.name === lookupValue ||
            user.profile.display_name === lookupValue
          );
        } else {
          // Look up by email
          const result = await client.users.lookupByEmail({
            email: lookupValue
          });
          userInfo = result.user;
        }

        if (!userInfo) {
          await say(`Could not find user with username: ${username}`);
          return;
        }

        const userId = userInfo.id;

        // Extract grade (third argument)
        const grade = args[2];
        if (!grade || isNaN(grade)) {
          await say("Please provide a valid grade. Example: `/botek grade @user 5 for 1on1`");
          return;
        }

        // Find "for" keyword
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
          text: `You got grade ${grade} for ${testName} test (given by <@${command.user_id}>)`
        });

        // Confirm to command initiator
        await say(`Grade ${grade} for ${testName} has been sent to <@${userId}>`);

      } catch (lookupError) {
        console.error("Error looking up user:", lookupError);
        await say(`Error finding user: ${lookupError.message}`);
      }
    } catch (error) {
      console.error("Error in grade command:", error);
      await say("There was an error processing the grade command. Please check the format: `/botek grade @user 5 for 1on1`");
    }
  }
  // Command: /botek give
  else if (subCommand === 'give') {
    try {
      // Find the @mention in the command
      const mentionArg = args.find(arg => arg.startsWith('@'));

      if (!mentionArg) {
        await say("Please specify a user with @mention. Example: `/botek give extra to @user`");
        return;
      }

      // Extract username (remove @ symbol)
      const username = mentionArg.substring(1);

      // Look up the user ID from username
      try {
        // Get user list and find by username
        const result = await client.users.list();
        const userInfo = result.members.find(user =>
          user.name === username ||
          user.profile.display_name === username
        );

        if (!userInfo) {
          await say(`Could not find user with username: ${username}`);
          return;
        }

        const userId = userInfo.id;

        // Determine if it's half or full extra
        const isHalfExtra = fullText.toLowerCase().includes('half extra');
        const points = isHalfExtra ? 0.5 : 1;

        // Send message to the user
        const message = points === 1
          ? `Great. You have got extra point :trophy: (given by <@${command.user_id}>)`
          : `Nice. You have got 0.5 of extra point :trophy: (given by <@${command.user_id}>)`;

        await client.chat.postMessage({
          channel: userId,
          text: message
        });

        // Confirm to command initiator
        const confirmMessage = points === 1
          ? `Extra point has been given to <@${userId}>`
          : `Half extra point has been given to <@${userId}>`;

        await say(confirmMessage);

      } catch (lookupError) {
        console.error("Error looking up user:", lookupError);
        await say(`Error finding user: ${lookupError.message}`);
      }
    } catch (error) {
      console.error("Error in give command:", error);
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
