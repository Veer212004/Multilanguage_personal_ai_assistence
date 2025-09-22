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
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountIcon,
  Login as LoginIcon,
  PersonAdd as SignupIcon,
  Logout as LogoutIcon,
  GetApp as GetAppIcon,
  Android as AndroidIcon,
  Apple as AppleIcon,
  Computer as WebIcon,
  Download as DownloadIcon,
  QrCode as QrCodeIcon,
  Close as CloseIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import TravelExploreTwoToneIcon from '@mui/icons-material/TravelExploreTwoTone';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import LanguageSelector from './LanguageSelector';
import QRCode from 'qrcode';

const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElApp, setAnchorElApp] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 
  const languageSelectorRef = useRef();

  // ✅ Production URL configuration
  const PRODUCTION_URL = 'https://loanmate-platform.vercel.app';
  const getBaseUrl = () => {
    return PRODUCTION_URL;
  };

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

  const handleOpenAppMenu = (event) => {
    setAnchorElApp(event.currentTarget);
  };

  const handleCloseAppMenu = () => {
    setAnchorElApp(null);
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

  // ✅ Updated QR code generation to point to download page
  const generateQRCode = async () => {
    try {
      // ✅ Point to download page instead of direct APK
      const downloadUrl = `${getBaseUrl()}/Download-app`;
      
      // Generate QR code with download page URL
      const qrCodeDataUrl = await QRCode.toDataURL(downloadUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      setQrDialogOpen(true);
      handleCloseAppMenu();
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code. Please try again.');
    }
  };

  const handleCloseQrDialog = () => {
    setQrDialogOpen(false);
    setQrCodeUrl('');
  };

  // ✅ Updated share function with download page URL
  const shareQRCode = async () => {
    try {
      const downloadUrl = `${getBaseUrl()}/Download-app`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Download LoanMate App',
          text: 'Download the LoanMate mobile app for easy loan management',
          url: downloadUrl
        });
      } else {
        await navigator.clipboard.writeText(downloadUrl);
        alert('Download link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Unable to share. Please try copying the link manually.');
    }
  };

  // ✅ Updated download function with direct APK URL for button clicks
  const handleDownloadApp = (platform) => {
    handleCloseAppMenu();
    
    if (platform === 'android') {
      // ✅ For direct button clicks, still use direct APK download
      const link = document.createElement('a');
      link.href = `${getBaseUrl()}/Download-app`;
      link.download = 'LoanMate.apk';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (platform === 'ios') {
      alert('iOS app coming soon! Stay tuned.');
    } else if (platform === 'web') {
      window.open(getBaseUrl(), '_blank');
    }
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Loan Eligibility', icon: <AssessmentIcon />, path: '/loan-eligibility' },
    { text: 'Find Loan', icon: <TravelExploreTwoToneIcon />, path: '/loan-application' },
    { text: 'Financial Tips', icon: <TipsAndUpdatesTwoToneIcon />, path: '/financial-tips' },
    { text: 'DashBoard', icon: <GridViewTwoToneIcon />, path: '/Dashboard' },
  ];

  const drawer = (
    <Box sx={{ height: '100%' }}>
      {/* ✅ Beautiful Header with Gradient */}
      <Box
        sx={{
          background: 'linear-gradient(50deg, #202123ff 30%, #1e6dc7 90%)',
          color: 'white',
          p: 3,
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%)',
          }
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold', 
            fontFamily: 'monospace',
            letterSpacing: '0.1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          LOANMATE
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mt: 0.5 }}>
          Your Financial Partner
        </Typography>
      </Box>

      {/* ✅ Main Navigation */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              color: '#374151',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(5, 3, 31, 0.08)',
                transform: 'translateY(8px)',
                boxShadow: '0 2px 8px rgba(8, 41, 72, 1.5)',
              },
              '&:active': {
                transform: 'translateX(4px)',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: '#4f46e5',
                minWidth: '40px',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.3rem'
                }
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* ✅ Download Section */}
      <Divider sx={{ mx: 2, my: 1, borderColor: 'rgba(79, 70, 229, 0.2)' }} />
      
      <Box sx={{ px: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            px: 2, 
            py: 1, 
            color: '#6b7280',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05rem'
          }}
        >
          Download App
        </Typography>
        
        <List sx={{ py: 1 }}>
          <ListItem
            button
            onClick={() => handleDownloadApp('android')}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(40, 43, 52, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                transform: 'translateY(3px)',
                  boxShadow: '0 2px 8px rgba(8, 41, 72, 1.5)',
                 cursor : 'pointer',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#4CAF50', minWidth: '40px' }}>
              <AndroidIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Download Android App"
              sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
            />
          </ListItem>

          <ListItem
            button
            onClick={() => handleDownloadApp('ios')}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.02) 100%)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              '&:hover': {
               background: 'linear-gradient(135deg, rgba(40, 43, 52, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                transform: 'translateY(3px)',
                  boxShadow: '0 2px 8px rgba(8, 41, 72, 1.5)',
                  cursor : 'pointer',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#000', minWidth: '40px' }}>
              <AppleIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Download iOS App"
              secondary="Coming Soon"
              sx={{ 
                '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' },
                '& .MuiListItemText-secondary': { fontSize: '0.75rem', opacity: 0.7 }
              }}
            />
          </ListItem>

          <ListItem
            button
            onClick={() => handleDownloadApp('web')}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.05) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(40, 43, 52, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                transform: 'translateY(3px)',
                  boxShadow: '0 2px 8px rgba(8, 41, 72, 1.5)',
              cursor : 'pointer',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#2196F3', minWidth: '40px' }}>
              <WebIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Open Web App"
              sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
            />
          </ListItem>

          <ListItem
            button
            onClick={generateQRCode}
            sx={{
              borderRadius: 2,
              mb: 1,
              mx: 1,
              background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1) 0%, rgba(156, 39, 176, 0.05) 100%)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(40, 43, 52, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%)',
                transform: 'translateY(3px)',
                  boxShadow: '0 2px 8px rgba(8, 41, 72, 1.5)',
                   cursor : 'pointer',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#9C27B0', minWidth: '40px' }}>
              <QrCodeIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Show QR Code"
              sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
            />
          </ListItem>
        </List>
      </Box>

      {/* ✅ Auth Section */}
      <Divider sx={{ mx: 2, my: 1, borderColor: 'rgba(79, 70, 229, 0.2)' }} />

      <List sx={{ px: 1, pb: 3 }}>
        {!user ? (
          <>
            <ListItem
              component={RouterLink}
              to="/login"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: 1,
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
                  transform: 'translateX(8px)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#4f46e5', minWidth: '40px' }}>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Login"
                sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
              />
            </ListItem>
            
            <ListItem
              component={RouterLink}
              to="/signup"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: 1,
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.25) 100%)',
                  transform: 'translateX(8px)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#7c3aed', minWidth: '40px' }}>
                <SignupIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Sign Up"
                sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
              />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              component={RouterLink}
              to="/profile"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(79, 70, 229, 0.08)',
                  transform: 'translateX(5px)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#4f46e5', minWidth: '40px' }}>
                <AccountIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Profile"
                sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
              />
            </ListItem>
            
            <ListItem
              button
              onClick={() => { logout(); handleDrawerToggle(); }}
              sx={{
                borderRadius: 2,
                mb: 1,
                mx: 1,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  transform: 'translateX(5px)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#ef4444', minWidth: '40px' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                sx={{ '& .MuiListItemText-primary': { fontWeight: 500, fontSize: '0.9rem' } }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      {/* ✅ Enhanced AppBar with Gradient */}
      <AppBar 
        position="fixed" 
        sx={{
          background: 'linear-gradient(45deg, #026be3 30%, #383a3dff 90%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
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
                color: 'white',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              LOANMATE
            </Typography>

            {!isMobile && (
              <Box sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                gap: 3,
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)', 
                paddingLeft: 3,
                ml: 3
              }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    component={RouterLink}
                    to={item.path}
                    color="inherit"
                    startIcon={item.icon}
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-1px)',
                      }
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
              <LanguageSelector ref={languageSelectorRef} />

              {!isMobile && (
                <>
                  <Tooltip title="Download LoanMate App">
                    <Button
                      color="inherit"
                      startIcon={<GetAppIcon />}
                      onClick={handleOpenAppMenu}
                      sx={{
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        }
                      }}
                    >
                      Get App
                    </Button>
                  </Tooltip>
                  
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-getapp"
                    anchorEl={anchorElApp}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElApp)}
                    onClose={handleCloseAppMenu}
                  >
                    <MenuItem onClick={() => handleDownloadApp('android')}>
                      <AndroidIcon sx={{ mr: 1, color: '#4CAF50' }} />
                      <Box>
                        <Typography variant="body1">Download for Android</Typography>
                        <Typography variant="caption" color="textSecondary">
                          APK File • Latest Version
                        </Typography>
                      </Box>
                    </MenuItem>
                    
                    <MenuItem onClick={() => handleDownloadApp('ios')}>
                      <AppleIcon sx={{ mr: 1, color: '#000' }} />
                      <Box>
                        <Typography variant="body1">Download for iOS</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Coming Soon
                        </Typography>
                      </Box>
                    </MenuItem>
                    
                    <Divider />
                    
                    <MenuItem onClick={() => handleDownloadApp('web')}>
                      <WebIcon sx={{ mr: 1, color: '#2196F3' }} />
                      <Box>
                        <Typography variant="body1">Open Web App</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Works on any browser
                        </Typography>
                      </Box>
                    </MenuItem>
                    
                    <Divider />
                    
                    <MenuItem onClick={generateQRCode}>
                      <QrCodeIcon sx={{ mr: 1, color: '#9C27B0' }} />
                      <Box>
                        <Typography variant="body1">Show QR Code</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Scan to download
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Menu>
                </>
              )}

              {!isMobile && !user && (
                <>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{
                      color: 'white',
                       border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Log-in
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/signup"
                    startIcon={<SignupIcon />}
                    sx={{
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    Sign-Up
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

        {/* ✅ Enhanced Mobile Drawer */}
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
              width: 280,
              background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              borderRight: '3px solid #4f46e5',
              borderRadius: '0 12px 12px 0',
              boxShadow: '4px 0 20px rgba(79, 70, 229, 0.15)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </AppBar>

      {/* ✅ Enhanced QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={handleCloseQrDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0'
        }}>
          <Typography variant="h6" component="div">
            Download LoanMate App
          </Typography>
          <IconButton
            onClick={handleCloseQrDialog}
            size="small"
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              display: 'inline-block', 
              p: 2, 
              mb: 2,
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 2
            }}
          >
            {qrCodeUrl && (
              <img 
                src={qrCodeUrl} 
                alt="QR Code for LoanMate App Download" 
                style={{ 
                  width: '100%', 
                  maxWidth: '250px',
                  height: 'auto'
                }}
              />
            )}
          </Paper>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
            Scan this QR code with your phone camera to download the LoanMate app instantly
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            Visit: {getBaseUrl()}/download-app
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={shareQRCode}
            sx={{ 
              mr: 1,
              borderColor: '#4f46e5',
              color: '#4f46e5',
            }}
          >
            Share Link
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownloadApp('android')}
            sx={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            }}
          >
            Direct Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;