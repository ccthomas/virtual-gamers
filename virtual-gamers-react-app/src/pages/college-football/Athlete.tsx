// src/components/RosterPage.tsx

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import {
  Container, Typography, Box, Paper,
  CircularProgress,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import DynamicAppBar from '../../components/DynamicAppBar';
import { apiGet } from '../../utils/apiUtil';
import { RUBY_SERVICE_API } from '../../constants';
import routeConfigs from '../../RoutesConfig';
import { Athlete } from '../../types/Athlete';

const RosterPage: React.FC = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const query = new URLSearchParams(useLocation().search);
  const teamId = query.get('team_id');

  useEffect(() => {
    const fetchAthletes = async () => {
      let count = 0;
      try {
        const response = await apiGet(`${RUBY_SERVICE_API}/college_football/athletes`);
        setAthletes(response.data.data); // Adjust according to your API response structure
        count = response.data.count;
      } catch (err: unknown) {
        setError('Error fetching athletes data');
        return;
      } finally {
        setLoading(false);
      }

      if (count === 0 && teamId !== null) {
        try {
          await apiGet(`${RUBY_SERVICE_API}/college_football/management/athletes/load/${teamId}`);
          const response = await apiGet(`${RUBY_SERVICE_API}/college_football/athletes`);
          setAthletes(response.data.data); // Adjust according to your API response structure
        } catch (err: unknown) {
          setError('Error fetching athletes data');
          return;
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAthletes();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'headshot',
      headerName: 'Headshot',
      width: 80,
      renderCell: (params) => (
        <img src={params.value.href} alt={params.value.alt} style={{ width: 50, height: 50, borderRadius: '50%' }} />
      ),
    },
    { field: 'display_name', headerName: 'Name', width: 150 },
    { field: 'display_weight', headerName: 'Weight', width: 80 },
    { field: 'display_height', headerName: 'Height', width: 80 },
    { field: 'birth_place', headerName: 'Birth Place', width: 150 },
    { field: 'college', headerName: 'College', width: 150 },
    { field: 'jersey', headerName: 'Jersey', width: 100 },
    { field: 'position', headerName: 'Position Name', width: 150 },
    { field: 'experience', headerName: 'Experience', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
  ];

  const filteredAthletes = teamId === null ? athletes : athletes
    .filter((a: Athlete) => a.college.id === teamId);

  const rows: GridRowsProp = filteredAthletes.map((athlete) => ({
    id: athlete.id,
    headshot: athlete.headshot,
    display_name: athlete.display_name,
    display_weight: athlete.display_weight,
    display_height: athlete.display_height,
    birth_place: athlete.birth_place.displayText,
    college: athlete.college.name,
    jersey: athlete.jersey,
    position: athlete.position.displayName,
    experience: athlete.experience.displayValue,
    status: athlete.status.abbreviation,
  }));

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <DynamicAppBar
        title='College Football'
        items={[
          {
            label: 'Virtual Gamers',
            route: routeConfigs.home.path,
          },
          {
            label: 'Teams',
            route: routeConfigs.collegeFootballTeams.path,
          },

          {
            label: 'Athletes',
            route: routeConfigs.collegeFootballAthletes.path,
          },
        ]}
      />
      <Container
        maxWidth="lg"
        sx={{
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
        }}>
        <Paper sx={{ width: '100%', height: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Roster
          </Typography>
          <Box sx={{ height: '80vh', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default RosterPage;
