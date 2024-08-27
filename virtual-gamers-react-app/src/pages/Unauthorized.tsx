// src/pages/UnauthorizedPage.js

import React from 'react';
import {
  Button, Container, Typography, Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import routeConfigs from '../RoutesConfig';
import DynamicAppBar from '../components/DynamicAppBar';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(routeConfigs.home.path);
  };

  const handleGoBack = () => {
    navigate(-2); // Go back to the previous page
  };

  return (
    <>
      <DynamicAppBar />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" paragraph>
            You do not have permission to access this page.
          </Typography>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoHome}
              sx={{ mr: 2 }}
            >
              Go to Home
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGoBack}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default UnauthorizedPage;
