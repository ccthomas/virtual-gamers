// src/components/TeamsPage.tsx

import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import {
  Container, Typography, Box, TextField,
  Paper, Button,
} from '@mui/material';
import DynamicAppBar from '../../components/DynamicAppBar';
import { Team } from '../../types/Team';
import { apiGet } from '../../utils/apiUtil';
import { RUBY_SERVICE_API } from '../../constants';
import routeConfigs from '../../RoutesConfig';

const TeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiGet(`${RUBY_SERVICE_API}/college_football/teams`);
        setTeams(response.data.data);
        setFilteredTeams(response.data.data); // Set initial filtered teams
      } catch (error) {
        console.error('Error fetching teams data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = teams
      .filter((team) => team.abbreviation.toLowerCase().includes(lowercasedQuery)
        || team.display_name.toLowerCase().includes(lowercasedQuery)
        || team.location.toLowerCase().includes(lowercasedQuery));
    setFilteredTeams(filtered);
  }, [searchQuery, teams]);

  const columns: GridColDef[] = [
    {
      field: 'logo',
      headerName: 'Logo',
      width: 150,
      renderCell: (params) => (
        <img src={params.value} alt="Team Logo" style={{ width: 50, height: 50 }} />
      ),
    },
    { field: 'abbreviation', headerName: 'Abbreviation', width: 150 },
    { field: 'display_name', headerName: 'Display Name', width: 200 },
    { field: 'location', headerName: 'Location', width: 200 },
    {
      field: 'roster',
      headerName: 'Roster',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          href={`${routeConfigs.collegeFootballAthletes.path}?team_id=${params.row.id}`}
        >
          View Roster
        </Button>
      ),
    },
  ];

  const rows: GridRowsProp = filteredTeams.map((team) => ({
    id: team.id,
    logo: team.logos[0]?.href || '', // Assuming the first logo is used
    abbreviation: team.abbreviation,
    display_name: team.display_name,
    location: team.location,
  }));

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
        maxWidth="xs"
        sx={{
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 3,
        }}>
        <Paper>
          <Typography variant="h4" gutterBottom>
            Teams
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              variant="outlined"
              fullWidth
              label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Abbreviation, Display Name, or Location"
            />
          </Box>
          <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default TeamsPage;
