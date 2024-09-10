import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, TableContainer,
  Paper, CircularProgress, Table, TableBody,
  TableCell, TableHead, TablePagination, TableRow,
  TextField, MenuItem, Select, InputLabel, FormControl,
  SelectChangeEvent,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import DynamicAppBar from '../../components/DynamicAppBar';
import routeConfigs from '../../RoutesConfig';
import { RUBY_SERVICE_API } from '../../constants';
import { Athlete } from '../../types/Athlete';
import { apiGet } from '../../utils/apiUtil';
import { useTeamContext } from '../../contexts/TeamContext';
import { Team } from '../../types/Team';

// Define positions
const positions = [
  'Center', 'Cornerback', 'Defensive Back', 'Defensive End', 'Defensive Lineman', 'Defensive Tackle', 'EDGE',
  'Fullback', 'Guard', 'Kick Returner', 'Linebacker', 'Long Snapper', 'Nose Tackle', 'Offensive Lineman',
  'Offensive Tackle', 'Place kicker', 'Punter', 'Quarterback', 'Running Back', 'Safety', 'Tight End', 'Wide Receiver',
];

const RosterPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teamId = queryParams.get('team_id') || undefined;

  const { teams } = useTeamContext();

  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [collegeFilter, setCollegeFilter] = useState<string>(teamId || '');
  const [positionFilter, setPositionFilter] = useState<string>('');

  // Update fetch function to include new filters
  const fetchAthletes = async () => {
    try {
      let api = `${RUBY_SERVICE_API}/college_football/athletes?page=${page + 1}&page_size=${pageSize}`;
      api += collegeFilter !== '' ? `&team_id=${collegeFilter}` : '';
      api += nameFilter !== '' ? `&full_name=${nameFilter}` : '';
      api += positionFilter !== '' ? `&position_name=${positionFilter}` : '';
      const response = await apiGet(api);
      setAthletes(response.data.data);
      setTotalCount(response.data.total_count);
    } catch (err: unknown) {
      setError('Error fetching athletes data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, [page, pageSize, nameFilter, collegeFilter, positionFilter, teamId]);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value);
  };

  const handleCollegeChange = (event: SelectChangeEvent<string>) => {
    console.log(event);
    if (event.target.value === '') {
      queryParams.delete('team_id');
    } else {
      queryParams.set('team_id', event.target.value);
    }
    setCollegeFilter(event.target.value as string);
  };

  const handlePositionChange = (event: SelectChangeEvent<string>) => {
    setPositionFilter(event.target.value as string);
  };

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
        <Box sx={{ width: '100%', height: '100%' }}>
          <Typography variant="h4" gutterBottom>
            Roster
          </Typography>

          {/* Filters */}
          <Box sx={{
            display: 'flex', flexDirection: 'row', gap: 0, marginBottom: 0,
          }}>
            <TextField
              label="Search by Name"
              variant="outlined"
              value={nameFilter}
              onChange={handleNameChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>College</InputLabel>
              <Select
                value={collegeFilter}
                onChange={handleCollegeChange}
                label="College"
              >
                {/* Populate this dropdown with the list of colleges */}
                <MenuItem value="">All Colleges</MenuItem>
                {teams
                  .sort((a, b) => a.display_name.localeCompare(b.display_name))
                  .map((team: Team) => (
                    <MenuItem value={team.id}>{team.display_name}</MenuItem>
                  ))}
                {/* Add more colleges as necessary */}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={positionFilter}
                onChange={handlePositionChange}
                label="Position"
              >
                <MenuItem value="">All Positions</MenuItem>
                {positions.map((position) => (
                  <MenuItem key={position} value={position}>{position}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Headshot</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Height</TableCell>
                  <TableCell>Birth Place</TableCell>
                  <TableCell>College</TableCell>
                  <TableCell>Jersey</TableCell>
                  <TableCell>Position Name</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {athletes.map((athlete) => (
                  <TableRow key={athlete.id}>
                    <TableCell>
                      <img src={athlete.headshot.href} alt={athlete.headshot.alt} style={{ width: 50, height: 50, borderRadius: '50%' }} />
                    </TableCell>
                    <TableCell>{athlete.display_name}</TableCell>
                    <TableCell>{athlete.display_weight}</TableCell>
                    <TableCell>{athlete.display_height}</TableCell>
                    <TableCell>{athlete.birth_place.displayText}</TableCell>
                    <TableCell>{athlete.college.name}</TableCell>
                    <TableCell>{athlete.jersey}</TableCell>
                    <TableCell>{athlete.position_name}</TableCell>
                    <TableCell>{athlete.experience.displayValue}</TableCell>
                    <TableCell>{athlete.status.abbreviation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={pageSize}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </TableContainer>
        </Box>
      </Container>
    </>
  );
};

export default RosterPage;
