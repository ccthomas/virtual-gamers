import React, { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { InputAdornment } from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { DEFAULT_ICON_KEY, SupportedIcons } from '../components/ChipIcon';
import routeConfigs from '../RoutesConfig';
import DynamicAppBar from '../components/DynamicAppBar';

// Define supported icons and their labels
const iconNames = Object.keys(SupportedIcons);

export default function SignInUp({ authType }: { authType: 'SIGN_IN' | 'SIGN_UP' }) {
  const navigate = useNavigate();
  const {
    isAuthenticated, signIn, signUp, error,
  } = useAuth();
  const [selectedIcon, setSelectedIcon] = React.useState<string | undefined>(undefined);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [formErrors, setFormErrors] = React.useState<{ username?: string; password?: string }>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routeConfigs.home.path);
    }
  }, [isAuthenticated, navigate]);

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

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (username: string | null, password: string | null) => {
    const errors: { username?: string; password?: string } = {};
    if (!username || username.length < 3) {
      errors.username = 'Username is required and must be at least 3 characters.';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password is required and must be at least 6 characters.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get('username')?.toString() || null;
    const password = data.get('password')?.toString() || null;

    if (!validateForm(username, password)) {
      return;
    }

    if (authType === 'SIGN_IN') {
      const success = await signIn({
        username: username!,
        password: password!,
      });

      if (success) { navigate(routeConfigs.home.path); }
    } else {
      const success = await signUp({
        username: username!,
        password: password!,
        iconName: selectedIcon || DEFAULT_ICON_KEY,
      });

      if (success) { navigate(routeConfigs.signIn.path); }
    }
  };

  return (
    <>
      <DynamicAppBar />
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
            {authType === 'SIGN_IN' && (<LockOutlinedIcon />)}
            {authType === 'SIGN_UP' && (React.createElement(SupportedIcons[selectedIcon || DEFAULT_ICON_KEY]))}
          </Avatar>
          <Typography component="h1" variant="h5">
            {authType === 'SIGN_IN' ? 'Sign In' : 'Sign Up'}
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
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handlePasswordVisibility()}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {authType === 'SIGN_UP' && (
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

              )}
            </Grid>
            {error && (
              <Typography color="error" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
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
                {authType === 'SIGN_IN' && (
                  <Button onClick={() => navigate(routeConfigs.signUp.path)}>
                    Don't have an account? Sign Up
                  </Button>
                )}
                {authType === 'SIGN_UP' && (
                  <Button onClick={() => navigate(routeConfigs.signIn.path)}>
                    Already have an account? Sign in
                  </Button>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
