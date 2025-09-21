import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as UserIcon,
  Business as BusinessIcon,
  DirectionsCar as CarIcon,
  School as EducationIcon,
  CheckCircle as EligibilityIcon,
  Send as ApplyIcon,
  Close as CloseIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const LoanCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  }
}));

const loanTypes = [
  {
    id: 'home',
    title: 'Home Loan',
    description: 'Finance your dream home with competitive rates',
    icon: <HomeIcon />,
    rate: '5.75% - 7.25%',
    term: '15-30 years',
    maxAmount: '$500,000',
    exitOptions: [
      'Early repayment with 2% fee',
      'Refinancing options available after 2 years',
      'Loan term extension with credit review'
    ]
  },
  {
    id: 'personal',
    title: 'Personal Loan',
    description: 'Fast access to funds for your personal needs',
    icon: <UserIcon />,
    rate: '8.99% - 15.99%',
    term: '1-7 years',
    maxAmount: '$50,000',
    exitOptions: [
      'Full early repayment with no penalty after 6 months',
      'Partial prepayments allowed (up to 20% annually)',
      'Balance transfer option available'
    ]
  },
  {
    id: 'business',
    title: 'Business Loan',
    description: 'Grow your business with flexible financing',
    icon: <BusinessIcon />,
    rate: '7.50% - 12.00%',
    term: '1-10 years',
    maxAmount: '$250,000',
    exitOptions: [
      'Early repayment with decreasing penalty',
      'Business performance-based adjustments',
      'Option to convert to line of credit'
    ]
  },
  {
    id: 'auto',
    title: 'Auto Loan',
    description: 'Drive away with great rates on auto financing',
    icon: <CarIcon />,
    rate: '6.25% - 9.50%',
    term: '3-7 years',
    maxAmount: '$75,000',
    exitOptions: [
      'Vehicle trade-in program with no penalty',
      'Early payoff with no fee after 12 months',
      'Loan transfer option with approved buyer'
    ]
  },
  {
    id: 'education',
    title: 'Education Loan',
    description: 'Invest in your future with education financing',
    icon: <EducationIcon />,
    rate: '4.99% - 7.99%',
    term: '5-15 years',
    maxAmount: '$100,000',
    exitOptions: [
      'Income-based repayment plans available',
      'Deferment options for continued education',
      'Loan forgiveness for public service'
    ]
  }
];

const LoanTypes = () => {
  const navigate = useNavigate();
  
  // ✅ Use the useAuth hook instead of useContext
  const { isAuthenticated, loading } = useAuth();
  
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [loanDetails, setLoanDetails] = useState({
    amount: 50000,
    term: 5,
    creditScore: 700,
    income: 60000,
    employment: 'full-time',
    purpose: ''
  });

  // ✅ Handle loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const openEligibilityCheck = (loan) => {
    setSelectedLoan(loan);
    setIsEligibilityModalOpen(true);
  };

  const startLoanApplication = (loan) => {
    if (!isAuthenticated) {
      setSelectedLoan(loan);
      setIsLoginPromptOpen(true);
    } else {
      setSelectedLoan(loan);
      setIsApplyModalOpen(true);
    }
  };

  const handleLoginRedirect = () => {
    setIsLoginPromptOpen(false);
    navigate('/login', { state: { returnTo: '/', selectedLoan: selectedLoan?.id } });
  };

  const handleSignupRedirect = () => {
    setIsLoginPromptOpen(false);
    navigate('/signup', { state: { returnTo: '/', selectedLoan: selectedLoan?.id } });
  };

  const handleLoanDetailChange = (prop) => (event) => {
    setLoanDetails({
      ...loanDetails,
      [prop]: event.target.value
    });
  };

  const handleEligibilityCheck = () => {
    // Optionally pass loan details via state or params
   
    navigate('/loan-eligibility');
  };

  const handleApplySubmit = () => {
    alert('Thank you for your application! Our team will contact you within 1-2 business days.');
    setIsApplyModalOpen(false);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Our Loan Options
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
        Explore our range of loan products tailored to your needs
      </Typography>
      
      <Grid container spacing={3}>
        {loanTypes.map((loan) => (
          <Grid item xs={12} sm={6} md={4} key={loan.id}>
            <LoanCard>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 1, color: 'primary.main' }}>{loan.icon}</Box>
                  <Typography variant="h6">{loan.title}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {loan.description}
                </Typography>
                <Typography variant="body2">
                  <strong>Rate:</strong> {loan.rate}
                </Typography>
                <Typography variant="body2">
                  <strong>Term:</strong> {loan.term}
                </Typography>
                <Typography variant="body2">
                  <strong>Max Amount:</strong> {loan.maxAmount}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto', p: 2 }}>
                <Button
                  startIcon={<EligibilityIcon />}
                  onClick={() => openEligibilityCheck(loan)}
                  variant="outlined"
                  size="small"
                >
                  Check Eligibility
                </Button>
                <Button
                  startIcon={<ApplyIcon />}
                  onClick={() => startLoanApplication(loan)}
                  variant="contained"
                  size="small"
                >
                  Apply Now
                </Button>
              </CardActions>
            </LoanCard>
          </Grid>
        ))}
      </Grid>

      {/* Eligibility Check Modal */}
      <Dialog 
        open={isEligibilityModalOpen} 
        onClose={() => setIsEligibilityModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Check Eligibility for {selectedLoan?.title}
          <IconButton
            onClick={() => setIsEligibilityModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Loan Amount"
              type="number"
              value={loanDetails.amount}
              onChange={handleLoanDetailChange('amount')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Credit Score"
              type="number"
              value={loanDetails.creditScore}
              onChange={handleLoanDetailChange('creditScore')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Annual Income"
              type="number"
              value={loanDetails.income}
              onChange={handleLoanDetailChange('income')}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Employment Status</InputLabel>
              <Select
                value={loanDetails.employment}
                onChange={handleLoanDetailChange('employment')}
                label="Employment Status"
              >
                <MenuItem value="full-time">Full-Time</MenuItem>
                <MenuItem value="part-time">Part-Time</MenuItem>
                <MenuItem value="self-employed">Self-Employed</MenuItem>
                <MenuItem value="unemployed">Unemployed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEligibilityModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEligibilityCheck} variant="contained">
            Check Eligibility
          </Button>
        </DialogActions>
      </Dialog>

      {/* Login Prompt Modal */}
      <Dialog
        open={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Login Required
          <IconButton
            onClick={() => setIsLoginPromptOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please log in or create an account to apply for {selectedLoan?.title}.
            </Alert>
            <Typography variant="body1" gutterBottom>
              To ensure the security of your loan application and provide you with the best service, you need to be logged in.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', p: 3, gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={handleLoginRedirect}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleSignupRedirect}
          >
            Create Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Apply Now Modal */}
      <Dialog 
        open={isApplyModalOpen} 
        onClose={() => setIsApplyModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Apply for {selectedLoan?.title}
          <IconButton
            onClick={() => setIsApplyModalOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Loan Amount"
              type="number"
              value={loanDetails.amount}
              onChange={handleLoanDetailChange('amount')}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Loan Purpose</InputLabel>
              <Select
                value={loanDetails.purpose}
                onChange={handleLoanDetailChange('purpose')}
                label="Loan Purpose"
              >
                <MenuItem value="home">Home Purchase</MenuItem>
                <MenuItem value="business">Business Expansion</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="vehicle">Vehicle Purchase</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
          <Button onClick={handleApplySubmit} variant="contained">
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoanTypes;