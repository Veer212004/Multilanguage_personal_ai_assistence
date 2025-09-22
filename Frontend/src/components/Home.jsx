import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { 
  Box, 
  Typography, 
  Card, 
  Grid, 
  Button, 
  Container,
  useTheme,
  alpha,
  Fade,
  Zoom,
  TextField,
  IconButton,
  Link,
  Rating,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Slider,
  Chip,
  Tabs,
  Tab,
  CardMedia,
  CardContent,
  Grow,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import { 
  AccountBalance as BankIcon,
  TrendingUp as GrowthIcon,
  Security as SecurityIcon,
  Chat as ChatIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Lightbulb as TipIcon,
  ArrowForward as ArrowIcon,
  Send as SendIcon,
  YouTube as YouTubeIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  PersonAdd as RegisterIcon,
  Assignment as ApplicationIcon,
  VerifiedUser as VerificationIcon,
  AccountBalance as ApprovalIcon,
  Payment as DisbursalIcon,
  Calculate as CalculateIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Support as SupportIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@mui/system';
import LoanTypes from './LoanTypes';
import TextToSpeech from './TextToSpeech';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Stats Card Component
const StatCard = ({ icon: Icon, value, label, color, delay }) => {
  const theme = useTheme();
  
  return (
    <Grow in={true} style={{ transitionDelay: delay }}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${alpha(color, 0.2)}`,
          borderRadius: '20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-10px) scale(1.02)',
            boxShadow: `0 20px 40px ${alpha(color, 0.15)}`,
            border: `1px solid ${alpha(color, 0.4)}`,
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
              mb: 2,
              boxShadow: `0 10px 20px ${alpha(color, 0.3)}`,
            }}
          >
            <Icon sx={{ fontSize: 35, color: 'white' }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: color,
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            <AnimatedCounter end={parseInt(value)} suffix={value.includes('%') ? '%' : '+'} />
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {label}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Original Feature Component
const Feature = ({ icon, title, description, delay }) => {
  const theme = useTheme();
  const IconComponent = icon;


  
  return (
    <Zoom in={true} style={{ transitionDelay: delay }}>
      <Card
        sx={{
          height: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 16px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
            '& .feature-icon': {
              color: theme.palette.primary.main,
              transform: 'scale(1.1)',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            mb: 3,
          }}
        >
          <IconComponent
            className="feature-icon"
            sx={{
              fontSize: 40,
              color: theme.palette.primary.main,
              transition: 'all 0.3s ease',
            }}
          />
        </Box>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Card>
    </Zoom>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ name, role, content, rating, image, delay }) => {
  return (
    <Fade in={true} style={{ transitionDelay: delay }}>
      <Card
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={image}
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          />
          <Box>
            <Typography variant="h6" gutterBottom>
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {role}
            </Typography>
          </Box>
        </Box>
        <Rating value={rating} readOnly sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary" sx={{ flex: 1 }}>
          {content}
        </Typography>
      </Card>
    </Fade>
  );
};

// Main Home Component
const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // All useState declarations should be here, inside the component
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState('');
  const [contactError, setContactError] = useState('');

  // Loan Process State
  const [activeStep, setActiveStep] = useState(0);
  
  // Calculator State
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  // Features Gallery State
  const [selectedTab, setSelectedTab] = useState(0);

  // Handle contact form changes
  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    setContactSuccess('');

    // Basic validation
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please fill in all fields');
      setContactLoading(false);
      return;
    }

    try {
      console.log('🚀 Submitting contact form:', contactForm);
      
      const response = await fetch('https://loanplatform.onrender.com/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (data.success) {
        setContactSuccess(data.message);
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setContactError(data.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Contact form error:', error);
      setContactError(`Network error: ${error.message}`);
    } finally {
      setContactLoading(false);
    }
  };

  // EMI Calculation Effect
  useEffect(() => {
    const monthlyRate = interestRate / (12 * 100);
    const numPayments = tenure;
    
    if (monthlyRate === 0) {
      const calculatedEmi = loanAmount / numPayments;
      setEmi(calculatedEmi);
      setTotalAmount(loanAmount);
      setTotalInterest(0);
    } else {
      const calculatedEmi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                           (Math.pow(1 + monthlyRate, numPayments) - 1);
      setEmi(calculatedEmi);
      setTotalAmount(calculatedEmi * numPayments);
      setTotalInterest((calculatedEmi * numPayments) - loanAmount);
    }
  }, [loanAmount, interestRate, tenure]);

  // Data Arrays
  const stats = [
    {
      icon: PeopleIcon,
      value: '50000',
      label: 'Happy Customers',
      color: theme.palette.primary.main,
      delay: '100ms',
    },
    {
      icon: BankIcon,
      value: '200',
      label: 'Partner Banks',
      color: '#4caf50',
      delay: '200ms',
    },
    {
      icon: TrendingUpIcon,
      value: '95',
      label: 'Approval Rate',
      color: '#ff9800',
      delay: '300ms',
    },
    {
      icon: SpeedIcon,
      value: '24',
      label: 'Hours Processing',
      color: '#e91e63',
      delay: '400ms',
    },
  ];

  const features = [
    {
      icon: AssessmentIcon,
      title: "Smart Loan Eligibility Check",
      description: "Get instant assessment of your loan eligibility using our advanced AI-powered system.",
      delay: '0ms',
    },
    {
      icon: SpeedIcon,
      title: "Quick Loan Processing",
      description: "Experience faster loan approvals with our streamlined digital application process.",
      delay: '100ms',
    },
    {
      icon: SecurityIcon,
      title: "Secure & Confidential",
      description: "Your financial information is protected with bank-grade security measures.",
      delay: '200ms',
    },
    {
      icon: TipIcon,
      title: "Expert Financial Guidance",
      description: "Access personalized financial advice and loan management tips from our AI advisor.",
      delay: '300ms',
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Small Business Owner",
      content: "The AI loan advisor helped me understand my eligibility and guided me through the entire business loan process. Highly recommended!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1",
      delay: '100ms',
    },
    {
      name: "Priya Sharma",
      role: "First-time Home Buyer",
      content: "Thanks to this platform, I got all the information I needed about home loans and got pre-approved within minutes!",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=2",
      delay: '200ms',
    },
    {
      name: "Arun Patel",
      role: "Education Loan Recipient",
      content: "The AI chatbot was incredibly helpful in explaining different education loan options and documentation requirements.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3",
      delay: '300ms',
    },
  ];

  const steps = [
    {
      label: 'Quick Registration',
      description: 'Create your account in just 2 minutes with basic details',
      icon: RegisterIcon,
      image: '/Home_Images/reg.png',
      details: 'Simple form with email, phone, and basic information. No complex documentation required at this stage.',
      color: '#1976d2',
    },
    {
      label: 'Smart LoanMate Application',
      description: 'Our AI guides you through a personalized application process',
      icon: ApplicationIcon,
      image: 'Home_Images/Application.png',
      details: 'AI-powered form that adapts based on your loan type and profile. Get real-time eligibility feedback.',
      color: '#4caf50',
    },
    {
      label: 'Instant Requirement Verification',
      description: 'Automated document verification with simple steps by filling out the form you get verified instantly for the loan',
      icon: VerificationIcon,
      image: 'Home_Images/requirments.png',
      details: 'fill out the required information and go through our secure portal. Our AI verifies authenticity and completeness instantly.',
      color: '#ff9800',
    },
    {
      label: 'AI- Integrated loan Dashboard',
      description: 'you can able to access the all loan related information in one place',
      icon: DisbursalIcon,
      image: 'Home_Images/Dashboard.png',
      details: 'Once logined, feautres are enabled  through secure loanmate platform directly to your Mobile/Desktop.',
      color: '#9c27b0',
    },
    {
      label: 'Guding to get Quick Approval',
      description: 'Get approval decisions within 24 hours',
      icon: ApprovalIcon,
      image: 'https://media.edq.com/49dba1/globalassets/infographics/the-journey-of-a-loan-application.png',
      details: 'Our advanced Feauters assess your details and provide instant pre-approval or quick final decisions.',
      color: '#e91e63',
    },
    {
      label: 'Get Ai Sugestion to Manage your loan from OurFinMate Bot',
      description: 'It will resolve your all queries regarding loans',
      icon: DisbursalIcon,
      image: 'Home_Images/Chatbot.png',
      details: 'Designed to provide instant answers, personalized advice, and step-by-step assistance throughout your loan journey.',
      color: '#9c27b0',
    },
  ];

  const loanTypes = [
    { name: 'Personal', rate: 12.5, color: '#1976d2' },
    { name: 'Home', rate: 8.5, color: '#4caf50' },
    { name: 'Car', rate: 10.5, color: '#ff9800' },
    { name: 'Business', rate: 14.0, color: '#e91e63' },
  ];

  const featureCategories = [
    {
      label: 'Security Features',
      features: [
        {
          title: 'Bank-Grade Security',
          description: 'Your data is protected with the same security standards used by major banks',
          image: 'https://gensparkpublicblob.blob.core.windows.net/user-upload-image/moa_upload_image/77e0064b-e7f8-48c7-9939-b129b166a90d',
          icon: SecurityIcon,
          color: '#1976d2',
        },
        {
          title: 'Encrypted Transactions',
          description: 'All your transactions and personal data are encrypted end-to-end',
          image: 'https://www.apexure.com/uploads/financial-services-website-design.webp',
          icon: SecurityIcon,
          color: '#4caf50',
        },
      ],
    },
    {
      label: 'Smart Processing',
      features: [
        {
          title: 'AI-Powered Assessment',
          description: 'Our AI evaluates your application in real-time for instant decisions',
          image: 'https://gensparkpublicblob.blob.core.windows.net/user-upload-image/moa_upload_image/d29dda3a-e34b-4143-97ec-d3a3497d804a',
          icon: SpeedIcon,
          color: '#ff9800',
        },
        {
          title: 'Quick Approvals',
          description: 'Get loan approvals in as little as 24 hours with our streamlined process',
          image: 'https://images.wondershare.com/edrawmax/article2023/bank-loan-process-flow-chart/bank-loan-process-flowchart-template.jpg',
          icon: SpeedIcon,
          color: '#e91e63',
        },
      ],
    },
    {
      label: 'Customer Support',
      features: [
        {
          title: '24/7 Support',
          description: 'Round-the-clock customer support through chat, phone, and email',
          image: 'https://cdn.prod.website-files.com/63fc977c14aaea404dce4439/66bdb8fc338f1b2857ecfd42_65e83eac6c82c8bf9a510b01_Image%25205.png',
          icon: SupportIcon,
          color: '#9c27b0',
        },
        {
          title: 'Personal Advisor',
          description: 'Dedicated loan advisors to guide you through your entire journey',
          image: 'https://knowledge.hubspot.com/hubfs/financial-website-design-7-20241004-896301.webp',
          icon: SupportIcon,
          color: '#00bcd4',
        },
      ],
    },
  ];

  // Event Handlers
  const handleStepNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % steps.length);
  };

  const handleStepBack = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === 0 ? steps.length - 1 : prevActiveStep - 1
    );
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #383a3dff 30%, #026be3 90%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12},
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        fontWeight: 700,
                        mb: 2,
                        animation: `${floatAnimation} 3s ease-in-out infinite`,
                      }}
                    >
                      Your Smart AI Loan Advisor
                    </Typography>
                    <TextToSpeech text="Your Smart AI Loan Advisor" />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{ mb: 4, opacity: 0.99 }}
                    >
                      Get instant loan eligibility checks, personalized recommendations, and expert financial guidance powered by AI
                    </Typography>
                    <TextToSpeech text="Get instant loan eligibility checks, personalized recommendations, and expert financial guidance powered by AI" />
                  </Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate('/loan-eligibility')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: '30px',
                      fontSize: '1.1rem',
                      animation: `${pulseAnimation} 2s ease-in-out infinite`,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                      },
                    }}
                  >
                    Check Your Eligibility Now
                  </Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in={true} style={{ transitionDelay: '200ms' }}>
                <Box
                  component="img"
                  src="/loan-advisor-hero.svg"
                  alt="AI Loan Advisor"
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    height: 'auto',
                    animation: `${floatAnimation} 3s ease-in-out infinite`,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
                  }}
                />
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>
       
      {/* Interactive Statistics Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Fade in={true}>
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ mb: 6, fontWeight: 700 }}
            >
              Trusted by Thousands of Customers
            </Typography>
          </Fade>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard {...stat} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>





      {/* Interactive Loan Process Journey */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Fade in={true}>
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ mb: 2, fontWeight: 700 }}
            >
              Your Loan Journey Made Simple
            </Typography>
          </Fade>
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
            >
              Experience our streamlined 5-step process designed to get you the funds you need quickly and efficiently
            </Typography>
          </Fade>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stepper activeStep={activeStep} orientation="vertical" sx={{ bgcolor: 'transparent' }}>
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: activeStep === index ? step.color : 'grey.300',
                              color: 'white',
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: `0 5px 15px ${alpha(step.color, 0.4)}`,
                              },
                            }}
                            onClick={() => setActiveStep(index)}
                          >
                            <Icon />
                          </Box>
                        )}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {step.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          {step.details}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button size="small" onClick={handleStepBack}>
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleStepNext}
                            sx={{ bgcolor: step.color }}
                          >
                            Next Step
                          </Button>
                        </Box>
                      </StepContent>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in={true} key={activeStep}>
                <Card
                  sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={steps[activeStep].image}
                    alt={steps[activeStep].label}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: steps[activeStep].color,
                          color: 'white',
                          mr: 2,
                        }}
                      >
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {steps[activeStep].label}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {steps[activeStep].details}
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>




      {/* Interactive Loan Calculator */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Fade in={true}>
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ mb: 2, fontWeight: 700 }}
            >
              Smart Loan Calculator
            </Typography>
          </Fade>
          <Fade in={true} style={{ transitionDelay: '200ms' }}>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
            >
              Calculate your EMI instantly and plan your finances better with our interactive calculator
            </Typography>
          </Fade>

          <Grid container spacing={4}>
            {/* Calculator Input */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 50,
                      height: 50,
                      mr: 2,
                    }}
                  >
                    <CalculateIcon />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Loan Calculator
                  </Typography>
                </Box>

                {/* Loan Type Selection */}
                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                  Choose Loan Type
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {loanTypes.map((type) => (
                    <Chip
                      key={type.name}
                      label={`${type.name} (${type.rate}%)`}
                      onClick={() => setInterestRate(type.rate)}
                      sx={{
                        bgcolor: interestRate === type.rate ? type.color : 'transparent',
                        color: interestRate === type.rate ? 'white' : type.color,
                        border: `2px solid ${type.color}`,
                        '&:hover': {
                          bgcolor: type.color,
                          color: 'white',
                        },
                      }}
                    />
                  ))}
                </Box>

                {/* Loan Amount */}
                <Typography variant="subtitle1" gutterBottom>
                  Loan Amount: ₹{loanAmount.toLocaleString()}
                </Typography>
                <Slider
                  value={loanAmount}
                  onChange={(e, value) => setLoanAmount(value)}
                  min={10000}
                  max={10000000}
                  step={10000}
                  sx={{ mb: 3 }}
                />

                {/* Interest Rate */}
                <Typography variant="subtitle1" gutterBottom>
                  Interest Rate: {interestRate}% per annum
                </Typography>
                <Slider
                  value={interestRate}
                  onChange={(e, value) => setInterestRate(value)}
                  min={5}
                  max={20}
                  step={0.1}
                  sx={{ mb: 3 }}
                />

                {/* Tenure */}
                <Typography variant="subtitle1" gutterBottom>
                  Tenure: {tenure} months
                </Typography>
                <Slider
                  value={tenure}
                  onChange={(e, value) => setTenure(value)}
                  min={6}
                  max={360}
                  step={6}
                  sx={{ mb: 3 }}
                />
              </Card>
            </Grid>

            {/* Results */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                {/* EMI Card */}
                <Grid item xs={12}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                      color: 'white',
                      boxShadow: `0 15px 35px ${alpha(theme.palette.primary.main, 0.3)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MoneyIcon sx={{ mr: 2, fontSize: 30 }} />
                      <Typography variant="h6">Monthly EMI</Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                      ₹{Math.round(emi).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>

                {/* Total Amount */}
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, #4caf50 0%, ${alpha('#4caf50', 0.8)} 100%)`,
                      color: 'white',
                      boxShadow: `0 15px 35px ${alpha('#4caf50', 0.3)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Total Amount</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      ₹{Math.round(totalAmount).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>

                {/* Total Interest */}
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, #ff9800 0%, ${alpha('#ff9800', 0.8)} 100%)`,
                      color: 'white',
                      boxShadow: `0 15px 35px ${alpha('#ff9800', 0.3)}`,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimeIcon sx={{ mr: 1 }} />
                      <Typography variant="subtitle1">Total Interest</Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      ₹{Math.round(totalInterest).toLocaleString()}
                    </Typography>
                  </Card>
                </Grid>

                {/* Action Button */}
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 2,
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.8)} 100%)`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 25px ${alpha(theme.palette.secondary.main, 0.4)}`,
                      },
                    }}
                  >
                    Apply for This Loan
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Our AI Loan Advisor?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Feature {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>


      {/* Loan Types Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Explore The Loan Types And Get Know Your Eligibility
          </Typography>
          <LoanTypes />
        </Container>
      </Box>

      Testimonials Section
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            Success Stories from Our Users
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <TestimonialCard {...testimonial} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

     {/* Contact Section - Updated Form */}
<Container maxWidth="lg" sx={{ py: 8 }}>
  <Grid container spacing={4} alignItems="center">
    <Grid item xs={12} md={6}>
      {/* Contact Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Get Expert Loan Advice
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            mb: 3,
            lineHeight: 1.6
          }}
        >
          Fill out this form and get personalized solutions to your loan queries from our financial experts
        </Typography>
      </Box>

      {/* Features List */}
      <Box sx={{ mb: 4 }}>
        {[
          { icon: '💡', title: 'Expert Guidance', desc: 'Get advice from certified loan specialists' },
          { icon: '⚡', title: 'Quick Response', desc: 'Receive solutions within 24 hours' },
          { icon: '🔒', title: 'Secure & Confidential', desc: 'Your information is completely protected' },
          { icon: '💰', title: 'Best Rates', desc: 'Access to competitive loan rates and terms' }
        ].map((feature, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              p: 2,
              borderRadius: '12px',
              bgcolor: 'rgba(25, 118, 210, 0.05)',
              border: '1px solid rgba(25, 118, 210, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <Box 
              sx={{ 
                fontSize: '24px', 
                mr: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white'
              }}
            >
              {feature.icon}
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'primary.main',
                  fontSize: '1.1rem' 
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.9rem' 
                }}
              >
                {feature.desc}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Trust Indicators */}
      <Box 
        sx={{ 
          p: 3,
          borderRadius: '12px',
          bgcolor: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)',
          border: '2px solid rgba(25, 118, 210, 0.1)'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 600, 
            mb: 1,
            textAlign: 'center'
          }}
        >
          Providing the Best Solutions to your Problems
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            textAlign: 'center',
            fontSize: '0.9rem'
          }}
        >
          Join thousands who have found their perfect loan solution with our expert guidance
        </Typography>
      </Box>
    </Grid>
    
    <Grid item xs={12} md={6}>
      <Card
        sx={{
          p: 4,
          boxShadow: '0 12px 32px rgba(25, 118, 210, 0.15)',
          borderRadius: '20px',
          border: '1px solid rgba(25, 118, 210, 0.1)',
          bgcolor: 'white',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)',
            borderRadius: '22px',
            zIndex: -1
          }
        }}
      >
        {/* Form Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 1
            }}
          >
            Get Your Free Support
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.9rem'
            }}
          >
            Fill out the form below and our experts will contact you with personalized loan solutions
          </Typography>
        </Box>

        {/* Success Message */}
        {contactSuccess && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                p: 2,
                bgcolor: 'success.light',
                color: 'success.contrastText',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 500
              }}
            >
              {contactSuccess}
            </Typography>
          </Box>
        )}

        {/* Error Message */}
        {contactError && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                p: 2,
                bgcolor: 'error.light',
                color: 'error.contrastText',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 500
              }}
            >
              {contactError}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleContactSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                variant="outlined"
                required
                disabled={contactLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Email"
                name="email"
                value={contactForm.email}
                onChange={handleContactChange}
                variant="outlined"
                type="email"
                required
                disabled={contactLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How can we help you? (Loan type, amount, purpose, etc.)"
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                variant="outlined"
                multiline
                rows={4}
                required
                disabled={contactLoading}
                placeholder="Tell us about your loan requirements, preferred amount, purpose, and any specific questions you have..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  }
                }}
              />
            </Grid>
            
            {/* Privacy Notice */}
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(25, 118, 210, 0.1)'
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.75rem'
                  }}
                >
                  <span style={{ marginRight: '4px' }}>🔒</span>
                  Your information is secure and will only be used to provide you with loan advice. We respect your privacy.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={contactLoading}
                startIcon={contactLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{
                  height: 56,
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: contactLoading ? 'none' : 'translateY(-3px)',
                    boxShadow: contactLoading ? 'none' : '0 12px 28px rgba(25, 118, 210, 0.4)',
                    background: contactLoading ? undefined : 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                  },
                  '&:disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                  }
                }}
              >
                {contactLoading ? 'Sending Your Request...' : 'Get Free Loan Support'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Additional Info */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.75rem'
            }}
          >
            📞 Need immediate help? Call us at{' '}
            <Box 
              component="span" 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 600 
              }}
            >
              8880717978
            </Box>
          </Typography>
        </Box>
      </Card>
    </Grid>
  </Grid>
</Container>
</Box>
  );
};

export default Home;