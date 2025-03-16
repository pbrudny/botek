# Botek - Slack Bot

A Slack bot built with Node.js and the Slack Bolt framework, integrated with Supabase for command logging. The bot helps manage grades and extra points for users.

## Features

- Command logging to Supabase database
- Grade assignment and notification
- Extra points management
- Echo functionality
- Help command

## Available Commands

- `/botek help` - Display help message with available commands
- `/botek echo [message]` - Echo back your message
- `/botek grade @user [score] for [test]` - Send grade information to user
- `/botek give extra to @user` - Give an extra point to user
- `/botek give half extra to @user` - Give half an extra point to user

## Prerequisites

- Node.js (v18 or higher)
- A Slack workspace with admin privileges
- A Supabase account and project

## Setup

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd botek
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   SLACK_BOT_TOKEN=your_slack_bot_token
   SLACK_SIGNING_SECRET=your_slack_signing_secret
   SLACK_APP_TOKEN=your_slack_app_token
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase**
   - Create a new table called `command_logs` with the following structure:
     ```sql
     create table command_logs (
       id uuid default uuid_generate_v4() primary key,
       user_id text not null,
       user_name text not null,
       command text not null,
       text text,
       channel_id text not null,
       created_at timestamptz not null default now()
     );
     ```

5. **Start the bot**
   ```bash
   node index.js
   ```

## Slack App Configuration

1. Create a new Slack App at https://api.slack.com/apps
2. Enable Socket Mode
3. Add the following bot token scopes:
   - `commands`
   - `chat:write`
   - `users:read`
   - `users:read.email`
4. Create a slash command `/botek`
5. Install the app to your workspace

## Environment Variables

- `SLACK_BOT_TOKEN`: Your Slack bot user OAuth token
- `SLACK_SIGNING_SECRET`: Your Slack app signing secret
- `SLACK_APP_TOKEN`: Your Slack app-level token
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase service role key (for database access)

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- The bot uses Supabase's Row Level Security (RLS) for database protection
- All sensitive tokens should be kept confidential

## Development

The bot is built with:
- [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) for Slack integration
- [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js) for database operations
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variable management

## Error Handling

The bot includes error handling for:
- User lookup failures
- Invalid command formats
- Database operation errors
- Invalid grade inputs

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 