const supabase = require('../config/supabase');

async function logCommand(command) {
  try {
    const { data, error } = await supabase
      .from('command_logs')
      .insert([
        {
          user_id: command.user_id,
          user_name: command.user_name,
          command: command.command,
          text: command.text,
          channel_id: command.channel_id,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    console.log('Command logged successfully:', data);
  } catch (error) {
    console.error('Error logging command:', error);
  }
}

module.exports = {
  logCommand
}; 