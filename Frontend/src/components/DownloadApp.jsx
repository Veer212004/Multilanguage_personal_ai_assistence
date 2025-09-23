// Create a new file: src/pages/DownloadApp.jsx
import React, { useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Download as DownloadIcon, Android as AndroidIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const DownloadApp = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    // Trigger download immediately when page loads
    const triggerDownload = () => {
      const link = document.createElement('a');
      link.href = '/assets/LoanMateNewV-1.apk';
      link.download = 'LoanMate.apk';
      link.click();
      
      // Fallback: redirect to APK file directly after 2 seconds
      setTimeout(() => {
        window.location.href = '/assets/LoanMateNew.apk';
      }, 2000);
    };

    triggerDownload();
  }, []);

  const handleManualDownload = () => {
    window.location.href = '/assets/LoanMateNew.apk';
  };

  const handleclick = () => {
    Navigate('/');
  };

  return (
    
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 3
      }}
    >
      <Button
        variant="contained"
        size="large"
        onClick={handleclick}
        sx={{ mb: 2 }}
      >
        Go to Home 🏠
      </Button>
      <AndroidIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
      
      <Typography variant="h4" gutterBottom>
        Downloading LoanMate App...
      </Typography>
      
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Your download should start automatically
      </Typography>
      
      <CircularProgress sx={{ mb: 3 }} />
      
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        If download doesn't start automatically:
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        startIcon={<DownloadIcon />}
        onClick={handleManualDownload}
        sx={{ mb: 2 }}
      >
        Click Here to Download
      </Button>
      
      <Typography variant="caption" color="textSecondary">
        File: LoanMate.apk • Size: ~10MB
      </Typography>
    </Box>
  );
};

export default DownloadApp;