import React, { useState, useRef, useEffect } from 'react';
import '../styles/navbar.css';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountIcon,
  Login as LoginIcon,
  PersonAdd as SignupIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import TravelExploreTwoToneIcon from '@mui/icons-material/TravelExploreTwoTone';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const languageSelectorRef = useRef();

  useEffect(() => {
    const handler = () => {
      if (languageSelectorRef.current && languageSelectorRef.current.openMenu) {
        languageSelectorRef.current.openMenu();
      }
    };
    window.addEventListener('open-language-selector', handler);
    return () => window.removeEventListener('open-language-selector', handler);
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleClick = () => {
    navigate('/login');
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Loan Eligibility', icon: <AssessmentIcon />, path: '/loan-eligibility' },
    { text: 'Find Loan', icon: <TravelExploreTwoToneIcon />, path: '/loan-application' },
    { text: 'Financial Tips', icon: <TipsAndUpdatesTwoToneIcon />, path: '/financial-tips' },
    { text: 'DashBoard', icon: <GridViewTwoToneIcon />, path: '/Dashboard' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            component={RouterLink}
            to={item.path}
            key={item.text}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        {/* Auth related options inside drawer */}
        {!user ? (
          <>
            <ListItem button component={RouterLink} to="/login">
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={RouterLink} to="/signup">
              <ListItemIcon><SignupIcon /></ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={RouterLink} to="/profile">
              <ListItemIcon><AccountIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={logout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              color="blue.200"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 },
            }}
          >
            LOANMATE
          </Typography>

          {/* Show menu buttons only on desktop */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 5 , borderLeft: '1px solid rgba(6, 5, 5, 0.3)', paddingLeft: 3 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            <LanguageSelector ref={languageSelectorRef} />

            {/* Auth buttons only on desktop */}
            {!isMobile && !user && (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/login"
                  startIcon={<LoginIcon />}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/signup"
                  startIcon={<SignupIcon />}
                >
                  Sign Up
                </Button>
              </>
            )}

            {!isMobile && user && (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.fullName} src={user.avatar || "/static/images/avatar/2.jpg"}>
                      {!user.avatar && user.fullName ? user.fullName.charAt(0) : 'U'}
                    </Avatar>
                  </IconButton>
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
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <AccountIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { logout(); handleClick(); }}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
           display: { xs: 'block', md: 'none' },
  '& .MuiDrawer-paper': { 
    boxSizing: 'border-box', 
    width: 240,
    color:'black',
    borderRight: '5px solid #01060aff', // Blue border
    borderRadius: '0 8px 8px 0',
    background : '#e1e6ecff',
  } ,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
