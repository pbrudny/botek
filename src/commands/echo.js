async function handleEcho({ say, args }) {
  const message = args.slice(1).join(' ');
  if (message) {
    await say(`Echo: ${message}`);
  } else {
    await say("Please provide a message to echo. Example: `/botek echo Hello World!`");
  }
}

module.exports = handleEcho; 