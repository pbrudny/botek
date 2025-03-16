import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tab,
  Tabs
} from '@mui/material';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 3, width: '100%' }}>{children}</Box>}
    </div>
  );
}

export default function Dashboard() {
  const [value, setValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [commandLogs, setCommandLogs] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch command logs
      const { data: logs, error: logsError } = await supabase
        .from('command_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;
      setCommandLogs(logs);

      // Process user stats from command logs
      const userStats = processUserStats(logs);
      setUsers(userStats);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processUserStats = (logs) => {
    const userMap = new Map();

    logs.forEach(log => {
      // Initialize user in the map when they appear in grade commands
      if (log.command === '/botek' && log.text?.toLowerCase().startsWith('grade')) {
        const userMatch = log.text.match(/grade @(\w+)/);
        if (userMatch) {
          const username = userMatch[1];
          if (!userMap.has(username)) {
            userMap.set(username, {
              user_name: username,
              extra_points: 0,
              grades: [],
            });
          }

          const gradeMatch = log.text.match(/grade @\w+ (\d+)/);
          if (gradeMatch) {
            userMap.get(username).grades.push(Number(gradeMatch[1]));
          }
        }
      }
      // Handle extra points by looking at the recipient
      else if (log.text?.toLowerCase().includes('extra')) {
        const userMatch = log.text.match(/to @(\w+)/);
        if (userMatch) {
          const username = userMatch[1];
          if (!userMap.has(username)) {
            userMap.set(username, {
              user_name: username,
              extra_points: 0,
              grades: [],
            });
          }

          const user = userMap.get(username);
          user.extra_points += log.text.toLowerCase().includes('half') ? 0.5 : 1;
        }
      }
    });

    return Array.from(userMap.values()).map(user => ({
      ...user,
      grade_average: user.grades.length > 0
        ? (user.grades.reduce((a, b) => a + b, 0) / user.grades.length).toFixed(2)
        : 'N/A'
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ 
      width: '100vw', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          px: 2
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Botek Dashboard
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleLogout}
            sx={{ 
              backgroundColor: '#f44336',
              '&:hover': {
                backgroundColor: '#d32f2f'
              }
            }}
          >
            Logout
          </Button>
        </Box>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={(e, newValue) => setValue(newValue)}
              sx={{ 
                px: 2,
                '& .MuiTab-root': {
                  fontSize: '1rem',
                  fontWeight: 'medium'
                }
              }}
            >
              <Tab label="User Stats" />
              <Tab label="Command Logs" />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>User Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Extra Points</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Grade Average</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.user_name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {user.user_name}
                      </TableCell>
                      <TableCell align="right">{user.extra_points}</TableCell>
                      <TableCell align="right">{user.grade_average}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={value} index={1}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Command</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Text</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commandLogs.map((log) => (
                    <TableRow 
                      key={log.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{log.user_name}</TableCell>
                      <TableCell>{log.command}</TableCell>
                      <TableCell>{log.text}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
} 