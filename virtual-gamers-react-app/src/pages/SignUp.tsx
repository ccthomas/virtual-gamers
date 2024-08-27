import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SupportedIcons } from '../components/ChipIcon';
import routeConfigs from '../RoutesConfig';

// Define supported icons and their labels
const iconNames = Object.keys(SupportedIcons);

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [selectedIcon, setSelectedIcon] = React.useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const handleIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setAnchorEl(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filteredIcons = iconNames
    .filter((iconName: string) => iconName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get('username');
    const password = data.get('password');
    if (username === null || password === null) {
      return;
    }

    const register = async () => {
      await signUp({
        username: username.toString(),
        password: password.toString(),
        iconName: selectedIcon,
      });
      navigate(routeConfigs.signIn.path);
    };

    register();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* Display the selected icon or a placeholder */}
            {selectedIcon ? React.createElement(SupportedIcons[selectedIcon]) : null}
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select an icon"
                  value={selectedIcon}
                  onClick={handleIconClick}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton onClick={handleIconClick}>
                        {selectedIcon ? React.createElement(SupportedIcons[selectedIcon], { fontSize: 'small' }) : '🔍'}
                      </IconButton>
                    ),
                  }}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <TextField
                    fullWidth
                    placeholder="Search icons"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ mb: 1 }}
                  />
                  {filteredIcons.length > 0 ? (
                    filteredIcons.map((iconName: string) => (
                      <MenuItem
                        key={iconName}
                        onClick={() => handleIconSelect(iconName)}
                      >
                        {React.createElement(SupportedIcons[iconName], { fontSize: 'small' })}
                        {iconName}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No icons found</MenuItem>
                  )}
                </Menu>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Button onClick={() => navigate('/signin')}>
                  Already have an account? Sign in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}
