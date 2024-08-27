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
  const [healthStatus, setHealthStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHealth = async () => {
      // Fetch health status from your backend
      const nodeJs = await axios.get(`${process.env.REACT_APP_SERVICE_API}/health`) // Adjust the endpoint as needed
        .then((r) => r.data)
        .catch(() => {
          setError('Failed to fetch health status');
          setLoading(false);
        });

      const ruby = await axios.get(`${process.env.REACT_APP_RUBY_SERVICE_API}/up`) // Adjust the endpoint as needed
        .then((r) => r.data)
        .catch(() => {
          setError('Failed to fetch health status');
          setLoading(false);
        });

      console.log({
        'NodeJs Server': nodeJs.Service,
        'NodeJs PostgreSQL': nodeJs.PostgresSql,
        'Ruby Server': ruby.Service,
        'Ruby PostgreSQL': ruby.PostgresSql,
      });
      setHealthStatus({
        'NodeJs Server': nodeJs.Service,
        'NodeJs PostgreSQL': nodeJs.PostgresSql,
        'Ruby Server': ruby.Service,
        'Ruby PostgreSQL': ruby.PostgresSql,
      });
      setLoading(false);
    };

    setLoading(true);
    getHealth();
  }, []);

  console.log(healthStatus);

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
        {Object.keys(healthStatus).map((key: string) => (
          <Grid item xs={12} sm={6}>
            <StatusCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>{key}</Typography>
                <Typography variant="body1" color="textPrimary">{healthStatus[key] || 'Unknown'}</Typography>
              </CardContent>
            </StatusCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
