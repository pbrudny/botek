const { findUser } = require('../utils/userLookup');

async function handleGrade({ args, say, client, command }) {
  try {
    // Check if there's a user mention as the second argument
    if (args.length < 2 || !args[1].startsWith('@')) {
      await say("Please specify a user with @mention. Example: `/botek grade @user 5 for 1on1`");
      return;
    }

    // Extract username (remove @ symbol)
    const username = args[1].substring(1);

    try {
      const userInfo = await findUser(client, username);

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

module.exports = handleGrade; 