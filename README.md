# Botek - Educational Slack Bot with Dashboard

A comprehensive system for managing student grades and extra points through Slack commands, with a web-based dashboard for monitoring and analysis.

## System Components

### 1. Slack Bot (Backend)
- Command processing for grades and extra points
- Direct message notifications
- Command logging to Supabase
- User lookup and verification

### 2. Web Dashboard (Frontend)
- Password-protected interface
- Real-time student statistics
- Command history tracking
- Grade averages and extra points summary

## Available Slack Commands

- `/botek help` - Display help message with available commands
- `/botek echo [message]` - Echo back your message
- `/botek grade @user [score] for [test]` - Send grade information to user
- `/botek give extra to @user` - Give an extra point to user
- `/botek give half extra to @user` - Give half an extra point to user

## Prerequisites

- Node.js (v18 or higher)
- A Slack workspace with admin privileges
- A Supabase account and project
- npm or yarn package manager

## Project Structure

```
botek/
├── src/                    # Backend source files
│   ├── commands/          # Slack command handlers
│   ├── config/           # Configuration files
│   ├── services/         # Business logic services
│   └── utils/            # Utility functions
├── frontend/             # Frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── contexts/     # Context providers
│   │   ├── pages/       # Page components
│   │   └── config/      # Frontend configuration
│   └── public/          # Static assets
├── index.js             # Backend entry point
└── README.md
```

## Setup Instructions

### Backend Setup

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
   Create a `.env` file in the root directory:
   ```
   SLACK_BOT_TOKEN=your_slack_bot_token
   SLACK_SIGNING_SECRET=your_slack_signing_secret
   SLACK_APP_TOKEN=your_slack_app_token
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase**
   Create a new table called `command_logs`:
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

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the dashboard**
   - Open http://localhost:5173 in your browser
   - Login with password: `AwesomeStudents!2025`

## Dashboard Features

- **User Statistics**
  - Grade averages calculated from `/botek grade` commands
  - Extra points accumulated from `/botek give extra` commands
  - All statistics grouped by command recipients

- **Command Logs**
  - Complete history of all bot commands
  - Timestamp and user information
  - Filterable and sortable data

## Slack App Configuration

1. Create a new Slack App at https://api.slack.com/apps
2. Enable Socket Mode
3. Add bot token scopes:
   - `commands`
   - `chat:write`
   - `users:read`
   - `users:read.email`
4. Create slash command `/botek`
5. Install the app to your workspace

## Security

- Frontend access is protected by password
- Supabase RLS policies protect data access
- Environment variables for sensitive credentials
- Secure command validation and processing

## Development

The project uses:
- [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) for Slack integration
- [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js) for database operations
- [React](https://reactjs.org/) with [Vite](https://vitejs.dev/) for the frontend
- [Material-UI](https://mui.com/) for UI components

## Error Handling

- User lookup validation
- Command format verification
- Database operation error handling
- Frontend authentication protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 