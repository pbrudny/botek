async function handleHelp({ say }) {
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

module.exports = handleHelp; 