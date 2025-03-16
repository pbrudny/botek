const { findUser } = require('../utils/userLookup');

async function handleGive({ args, say, client, command, fullText }) {
  try {
    // Find the @mention in the command
    const mentionArg = args.find(arg => arg.startsWith('@'));

    if (!mentionArg) {
      await say("Please specify a user with @mention. Example: `/botek give extra to @user`");
      return;
    }

    // Extract username (remove @ symbol)
    const username = mentionArg.substring(1);

    try {
      const userInfo = await findUser(client, username);

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

module.exports = handleGive; 