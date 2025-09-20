import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Button,
  Snackbar,
  Alert,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import {
  AccountBalance as BudgetIcon,
  Savings as SavingsIcon,
  TrendingUp as InvestingIcon,
  Assessment as CreditScoreIcon,
  PictureAsPdf as PdfIcon,
  Chat as ChatIcon,
  RecordVoiceOver as VoiceIcon,
  SmartToy as AiIcon,
  Translate as TranslateIcon,
  Send as SendIcon,
  Close as CloseIcon,
  ArrowForward as ArrowIcon,
  ArrowBack,
} from '@mui/icons-material';
import TextSpeech from './TextToSpeech'; // adjust path if needed
import { ArrowBackIosNewSharp } from '@mui/icons-material';
const FinancialTips = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const [showFeatureNotAvailable, setShowFeatureNotAvailable] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [speechText, setSpeechText] = useState('');
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);

  const handleFeatureClick = (feature) => {
    if (feature.key === 'chat') {
      if (window.botpress && typeof window.botpress.open === 'function') {
        window.botpress.open();
      } else {
        setError("Chatbot is not available. Please try again later.");
      }
    } else if (feature.key === 'voice') {
      setSpeechText("Here is your personalized financial advice and tips. Start saving, budgeting, and investing wisely for a secure future! to Explore more about voice guidance,just tap on the voice icon on the website.");
      setShowVoiceDialog(true);
    } else if (feature.key === 'language') {
     window.dispatchEvent(new Event('open-language-selector'));
    } else {
      setShowFeatureNotAvailable(true);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatHistory([
        ...chatHistory,
        { type: 'user', message: chatMessage },
        { type: 'bot', message: 'Thank you for your message. Our AI assistant will respond shortly.' }
      ]);
      setChatMessage('');
    }
  };

  const aiFeatures = [
    {
      icon: <ChatIcon fontSize="large" />,
      title: "AI Chat Assistant",
      description: "Get instant answers to your financial questions with our intelligent chatbot",
      key: 'chat',
      color: '#1976d2',
      path: '/chat',
    },
    {
      icon: <VoiceIcon fontSize="large" />,
      title: "Voice Guidance",
      description: "Listen to personalized financial advice and tips in audio format",
      key: 'voice',
      color: '#2e7d32'
    },
    {
      icon: <AiIcon fontSize="large" />,
      title: "Smart Advisor",
      description: "Get AI-powered personalized financial recommendations",
      key: 'advisor',
      path: '/Dashboard',
      color: '#ed6c02'
    },
    {
      icon: <TranslateIcon fontSize="large" />,
      title: "Multi-Language",
      description: "Access all resources in your preferred language",
      key: 'language',
      color: '#9c27b0',
      path:'/language',
    }
  ];

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const tabLabels = {
    budgeting: 'Budget Planning',
    saving: 'Smart Savings',
    investing: 'Investment Tips',
    creditScore: 'Credit Score',
  };

  const pdfResources = {
    budgeting: '/pdfs/budget.pdf',
    saving: '/pdfs/savings.pdf',
    investing: '/pdfs/investment.pdf',
    creditScore: '/pdfs/credit.pdf',
  };

  const handleDownload = async (pdfUrl) => {
    try {
      console.log('Fetching PDF from:', pdfUrl);

      const response = await fetch(pdfUrl, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`PDF not found (${response.status})`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('PDF file is empty');
      }

      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);

    } catch (error) {
      console.error('Download error:', error);
      setError(`Unable to load the PDF. Please try again.`);
      setTimeout(() => setError(null), 5000);
    }
  };

  const tips = {
    budgeting: [
      'Create a monthly budget and track all expenses',
      'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
      'Track and categorize all expenses',
      'Look for areas to reduce unnecessary spending',
      'Set specific financial goals',
    ],
    saving: [
      'Build an emergency fund covering 3-6 months of expenses',
      'Set up automatic savings transfers',
      'Look for high-yield savings accounts',
      'Save windfalls like tax refunds or bonuses',
      'Review and reduce recurring subscriptions',
    ],
    investing: [
      'Start investing early to benefit from compound interest',
      'Diversify your investment portfolio',
      'Consider low-cost index funds for long-term growth',
      'Research before making investment decisions',
      'Regularly review and rebalance your portfolio',
    ],
    creditScore: [
      'Pay all bills on time',
      'Keep credit utilization below 30%',
      'Regularly check your credit report',
      'Avoid applying for too many new credit accounts',
      'Keep old credit accounts open to maintain credit history',
    ],
  };

  const getCurrentCategory = () => {
    switch (activeTab) {
      case 0: return 'budgeting';
      case 1: return 'saving';
      case 2: return 'investing';
      case 3: return 'creditScore';
      default: return 'budgeting';
    }
  };

  const renderTipsList = () => {
    const currentCategory = getCurrentCategory();
    return (
      <Box>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            color: 'text.primary',
            mb: 3,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {activeTab === 0 && <BudgetIcon sx={{ mr: 1, color: 'primary.main' }} />}
          {activeTab === 1 && <SavingsIcon sx={{ mr: 1, color: 'primary.main' }} />}
          {activeTab === 2 && <InvestingIcon sx={{ mr: 1, color: 'primary.main' }} />}
          {activeTab === 3 && <CreditScoreIcon sx={{ mr: 1, color: 'primary.main' }} />}
          {tabLabels[currentCategory]}
        </Typography>
        
        <List sx={{ mb: 3 }}>
          {tips[currentCategory].map((tip, index) => (
            <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }} key={index}>
              <ListItem
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: 2,
                  mb: 1.5,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    bgcolor: 'primary.main',
                    transform: 'scaleY(0)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateX(8px)',
                    bgcolor: 'primary.main',
                    borderColor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                    '&::before': {
                      transform: 'scaleY(1)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                      transform: 'scale(1.1)',
                    },
                    '& .MuiListItemText-primary': {
                      color: 'white',
                      fontWeight: 500,
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  transition: 'all 0.3s ease',
                  minWidth: 48
                }}>
                  {activeTab === 0 && <BudgetIcon />}
                  {activeTab === 1 && <SavingsIcon />}
                  {activeTab === 2 && <InvestingIcon />}
                  {activeTab === 3 && <CreditScoreIcon />}
                </ListItemIcon>
                <ListItemText 
                  primary={tip}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '1rem',
                      lineHeight: 1.5,
                      transition: 'all 0.3s ease'
                    }
                  }}
                />
                <ArrowIcon sx={{ 
                  opacity: 0, 
                  transition: 'opacity 0.3s ease',
                  '.MuiListItem-root:hover &': {
                    opacity: 1
                  }
                }} />
              </ListItem>
            </Fade>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PdfIcon />}
            onClick={() => handleDownload(pdfResources[currentCategory])}
            sx={{ 
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
              }
            }}
          >
            Download Complete Guide
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl">
     <ArrowBackIosNewSharp className="w-6 h-6 text-gray-600 mb-4 mt-5 cursor-pointer" onClick={() => window.history.back()}/>
            <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Financial Resource Center
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Your comprehensive guide to financial wellness with AI-powered assistance
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Sidebar with AI Features */}
          <Grid item xs={12} md={3}>
            <Box sx={{ 
              position: { md: 'sticky' }, 
              top: 24,
              maxHeight: { md: 'calc(100vh - 100px)' },
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0,0,0,0.1)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(25, 118, 210, 0.3)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(25, 118, 210, 0.5)',
                }
              }
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <AiIcon sx={{ mr: 1, color: 'primary.main' }} />
                AI Features
              </Typography>
              
              {aiFeatures.map((feature, index) => (
                <Paper
                  key={index}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => handleFeatureClick(feature)}
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 3,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: hoveredFeature === index ? feature.color : 'divider',
                    background: hoveredFeature === index 
                      ? `linear-gradient(135deg, ${feature.color}15, ${feature.color}05)`
                      : 'background.paper',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoveredFeature === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: hoveredFeature === index 
                      ? `0 12px 40px ${feature.color}30`
                      : '0 2px 10px rgba(0, 0, 0, 0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      bgcolor: feature.color,
                      transform: hoveredFeature === index ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s ease',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    mb: 2
                  }}>
                    <Box sx={{ 
                      color: feature.color, 
                      mr: 2,
                      transition: 'transform 0.3s ease',
                      transform: hoveredFeature === index ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)'
                    }}>
                      {feature.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1,
                        transition: 'color 0.3s ease'
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary',
                          lineHeight: 1.5,
                          transition: 'color 0.3s ease'
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    opacity: hoveredFeature === index ? 1 : 0,
                    transition: 'opacity 0.3s ease'
                  }}>
                    <ArrowIcon sx={{ 
                      color: feature.color,
                      fontSize: '1.2rem'
                    }} />
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white', 
                  p: 3,
                  background: 'linear-gradient(135deg, #1976d2, #42a5f5)'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Financial Tips & Guidance
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Explore comprehensive financial advice tailored to your needs
                  </Typography>
                </Box>

                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    '& .MuiTab-root': {
                      minWidth: 140,
                      minHeight: 72,
                      transition: 'all 0.3s ease',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'gray.100',
                        '& .MuiSvgIcon-root': {
                          transform: 'scale(1.1)',
                        }
                      },
                      '&.Mui-selected': {
                        fontWeight: 600,
                        color: 'primary.main',
                        bgcolor: 'yellow.50',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                    }
                  }}
                >
                  <Tab 
                    icon={<BudgetIcon sx={{ mb: 0.5 }} />} 
                    label={tabLabels.budgeting}
                  />
                  <Tab 
                    icon={<SavingsIcon sx={{ mb: 0.5 }} />} 
                    label={tabLabels.saving}
                  />
                  <Tab 
                    icon={<InvestingIcon sx={{ mb: 0.5 }} />} 
                    label={tabLabels.investing}
                  />
                  <Tab 
                    icon={<CreditScoreIcon sx={{ mb: 0.5 }} />} 
                    label={tabLabels.creditScore}
                  />
                </Tabs>

                <Box sx={{ p: 4 }}>
                  {renderTipsList()}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Chat Dialog */}
      <Dialog
        open={showChat}
        onClose={() => setShowChat(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0d0d0eff, #42a5f5)',
          color: 'white',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatIcon sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Chat Assistant
            </Typography>
          </Box>
          <IconButton onClick={() => setShowChat(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 0,
          bgcolor: '#f8f9fa'
        }}>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            {chatHistory.length === 0 && (
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: 'text.secondary'
              }}>
                <ChatIcon sx={{ fontSize: '3rem', mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">
                  Start a conversation with our AI assistant
                </Typography>
              </Box>
            )}
            {chatHistory.map((msg, index) => (
              <Fade in={true} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '75%',
                      bgcolor: msg.type === 'user' ? 'primary.main' : 'white',
                      color: msg.type === 'user' ? 'white' : 'text.primary',
                      borderRadius: msg.type === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Typography variant="body1">
                      {msg.message}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            ))}
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!chatMessage.trim()}
              sx={{
                minWidth: 'auto',
                px: 2,
                borderRadius: 3,
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              <SendIcon />
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{ 
            width: '100%',
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Text to Speech Component */}
      {speechText && (
        <TextSpeech text={speechText} onEnd={() => setSpeechText('')} />
      )}

      {/* Voice Guidance Dialog */}
      <Dialog
        open={showVoiceDialog}
        onClose={() => setShowVoiceDialog(false)}
        maxWidth="xs"
      >
        <DialogTitle>
          <VoiceIcon sx={{ mr: 1, color: '#384edcff' }} />
          Voice Guidance
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {speechText}
          </Typography>
          <TextSpeech text={speechText} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoiceDialog(false)} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FinancialTips;