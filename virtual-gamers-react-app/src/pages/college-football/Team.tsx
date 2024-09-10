// src/components/TeamsPage.tsx

import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Typography, TablePagination, TextField, Button,
  Box, Container, TableFooter,
} from '@mui/material';
import routeConfigs from '../../RoutesConfig';
import { Team } from '../../types/Team';
import DynamicAppBar from '../../components/DynamicAppBar';
import { useTeamContext } from '../../contexts/TeamContext';

const TeamsPage: React.FC = () => {
  const { teams, loading, error } = useTeamContext();
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'abbreviation' | 'display_name' | 'location'>('abbreviation');

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = teams.filter((team: Team) => team.abbreviation
      .toLowerCase().includes(lowercasedQuery)
      || team.display_name.toLowerCase().includes(lowercasedQuery)
      || team.location.toLowerCase().includes(lowercasedQuery));

    // Sorting
    const sorted = filtered.sort((a: Team, b: Team) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTeams(sorted);
    setTotalCount(sorted.length);
  }, [searchQuery, teams, sortBy, sortDirection]);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleSort = (field: 'abbreviation' | 'display_name' | 'location') => {
    const isAsc = sortBy === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(field);
  };

  const rows = filteredTeams.slice(page * pageSize, page * pageSize + pageSize);

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
        maxWidth={false}
        sx={{
          width: '70%', // Adjust width as needed (60-70%)
          margin: 'auto',
          height: '80vh', // Adjust height to fit within the viewport
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 3,
        }}
      >
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Logo</TableCell>
                    <TableCell
                      sortDirection={sortBy === 'abbreviation' ? sortDirection : false}
                      onClick={() => handleSort('abbreviation')}
                    >
                      Abbreviation
                    </TableCell>
                    <TableCell
                      sortDirection={sortBy === 'display_name' ? sortDirection : false}
                      onClick={() => handleSort('display_name')}
                    >
                      Display Name
                    </TableCell>
                    <TableCell
                      sortDirection={sortBy === 'location' ? sortDirection : false}
                      onClick={() => handleSort('location')}
                    >
                      Location
                    </TableCell>
                    <TableCell>Roster</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <img src={team.logos[0]?.href || ''} alt="Team Logo" style={{ width: 50, height: 50 }} />
                      </TableCell>
                      <TableCell>{team.abbreviation}</TableCell>
                      <TableCell>{team.display_name}</TableCell>
                      <TableCell>{team.location}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`${routeConfigs.collegeFootballAthletes.path}?team_id=${team.id}`}
                        >
                          View Roster
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 50]}
                      component="td"
                      count={totalCount}
                      rowsPerPage={pageSize}
                      page={page}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={handleRowsPerPageChange}
                      sx={{
                        position: 'sticky',
                        bottom: 0,
                        backgroundColor: 'white',
                        zIndex: 1,
                      }}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default TeamsPage;
