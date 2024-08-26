import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Card, CardContent, Grid, CircularProgress, Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StatusCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const LoadingContainer = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
}));

const ErrorContainer = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center',
}));

const HomePage = () => {
  const [status, setStatus] = useState<{ Service: string; PostgresSql: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch health status from your backend
    console.log('process.env.REACT_APP_SERVICE_API: ', process.env.REACT_APP_SERVICE_API);
    axios.get(`${process.env.REACT_APP_SERVICE_API}/health`) // Adjust the endpoint as needed
      .then((response) => {
        setStatus(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch health status');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <Typography variant="h4" gutterBottom>Health Status</Typography>
        <CircularProgress />
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Fetching data, please wait...
        </Typography>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <Typography variant="h4" gutterBottom>Health Status</Typography>
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please try refreshing the page or contact support if the problem persists.
        </Typography>
      </ErrorContainer>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Health Status
      </Typography>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          Current status of the system and database.
        </Typography>
      </Box>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <StatusCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>Service Status</Typography>
              <Typography variant="body1" color="textPrimary">{status?.Service || 'Unknown'}</Typography>
            </CardContent>
          </StatusCard>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatusCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>PostgreSQL Version</Typography>
              <Typography variant="body1" color="textPrimary">{status?.PostgresSql || 'Unknown'}</Typography>
            </CardContent>
          </StatusCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
