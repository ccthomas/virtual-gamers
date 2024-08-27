import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import GamesIcon from '@mui/icons-material/Games';
import { useNavigate } from 'react-router-dom';
import {
  Tooltip, IconButton, Avatar, Menu, MenuItem,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ChipIcon from './ChipIcon';

export type DynamicAppBarProps = {
  title?: string;
  items?: { route: string; label: string }[]
};

function DynamicAppBar({
  title = 'Virtual Gamers',
  items = [],
}: DynamicAppBarProps) {
  const navigate = useNavigate();
  const {
    isAuthenticated, username, userAccount, signOut,
  } = useAuth();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <GamesIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=''
            onClick={() => { navigate('/'); }}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {items.map((item) => (
              <Button
                key={item.label}
                onClick={() => navigate(item.route)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <>
                {isAuthenticated && (
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {userAccount?.iconName && (
                      <ChipIcon iconName={userAccount.iconName} label={username || ''} />
                    )}
                    {userAccount?.iconName === undefined && (<Avatar />)}
                  </IconButton>
                )}
                {!isAuthenticated && (
                  <Button
                    onClick={() => navigate('/signin')}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >Sign in</Button>
                )}
              </>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key='setting' onClick={handleCloseUserMenu}>
                <Typography textAlign="center" onClick={signOut} >Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default DynamicAppBar;
