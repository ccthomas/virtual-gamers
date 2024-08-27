import React from 'react';
import {
  Container, Paper, Typography, Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DynamicAppBar from '../components/DynamicAppBar';
import { useAuth } from '../contexts/AuthContext';
import routeConfigs from '../RoutesConfig';

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <DynamicAppBar />
      <Container
        maxWidth="xs"
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            textAlign: 'center',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to Virtual Gamers!
          </Typography>
          {!isAuthenticated ? (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginBottom: 2 }}
                onClick={() => navigate(routeConfigs.signIn.path)}
              >
                Sign In
              </Button>
              <br />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(routeConfigs.signUp.path)}
              >
                Register
              </Button>
            </>
          ) : (
            <>
              <Button
                disabled
                variant="contained"
                color="primary"
                sx={{ marginBottom: 2 }}
                onClick={() => navigate('/games')}
              >
                Games (Coming Soon...)
              </Button>
              <br />
              <Button
                disabled
                variant="contained"
                color="secondary"
                onClick={() => navigate('/games/join')}
              >
                Join Party (Coming Soon...)
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default HomePage;
