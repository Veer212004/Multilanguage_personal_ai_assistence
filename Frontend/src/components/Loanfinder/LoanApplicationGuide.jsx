import React, { useState, useEffect } from "react";
import { CreditCard, DollarSign, User, Calendar, Home, Car, GraduationCap, Building } from "lucide-react";
import { ArrowBackIos } from '@mui/icons-material';
const LoanApplicationGuide = () => {
  const [step, setStep] = useState(0);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputFocused, setInputFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({
    creditScore: "",
    income: "",
    employmentType: "",
    age: "",
    loanType: "",
    tenure: "",
  });
  const [filteredBanks, setFilteredBanks] = useState([]);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Veer212004/Loan-data/refs/heads/main/banklist.json"
    )
      .then((res) => res.json())
      .then((data) => {
        setBanks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bank data:", err);
        setLoading(false);
      });
  }, []);

  const questions = [
    { 
      label: "Enter your Credit Score", 
      field: "creditScore", 
      type: "input",
      icon: <CreditCard className="w-6 h-6" />,
      gradient: "from-blue-500 to-purple-600",
      placeholder: "e.g., 750"
    },
    { 
      label: "Enter your Monthly Income (₹)", 
      field: "income", 
      type: "input",
      icon: <DollarSign className="w-6 h-6" />,
      gradient: "from-green-500 to-teal-600",
      placeholder: "e.g., 50000"
    },
    {
      label: "Select Employment Type",
      field: "employmentType",
      type: "select",
      options: ["Salaried", "Self-employed"],
      icon: <User className="w-6 h-6" />,
      gradient: "from-orange-500 to-red-600"
    },
    { 
      label: "Enter your Age", 
      field: "age", 
      type: "input",
      icon: <Calendar className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-600",
      placeholder: "e.g., 30"
    },
    {
      label: "Select Loan Type",
      field: "loanType",
      type: "select",
      options: ["Personal Loan", "Home Loan", "Car Loan", "Education Loan", "Business Loan"],
      icon: <Home className="w-6 h-6" />,
      gradient: "from-indigo-500 to-blue-600"
    },
    { 
      label: "Enter Desired Tenure (Months)", 
      field: "tenure", 
      type: "input",
      icon: <Calendar className="w-6 h-6" />,
      gradient: "from-teal-500 to-green-600",
      placeholder: "e.g., 24"
    },
  ];

  const getLoanTypeIcon = (loanType) => {
    switch(loanType?.toLowerCase()) {
      case 'home loan': return <Home className="w-5 h-5" />;
      case 'car loan': return <Car className="w-5 h-5" />;
      case 'education loan': return <GraduationCap className="w-5 h-5" />;
      case 'business loan': return <Building className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const handleChange = (field, value) => {
    setAnswers({ ...answers, [field]: value });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      applyFilters();
      setSubmitted(true);
    }
  };

  const applyFilters = () => {
    let results = banks.filter((b) => {
      const bankCredit = Number(b.eligibility.creditScore) || 650;
      const bankIncome = Number(b.eligibility.minIncome.replace(/\D/g, "")) || 0;
      const bankMinAge = Number(b.eligibility.minAge) || 18;
      const bankMaxAge = Number(b.eligibility.maxAge) || 60;
      const bankTenureMax = Number(b.eligibility.tenure.split("–")[1]) || 60;

      return (
        (!answers.creditScore || Number(answers.creditScore) >= bankCredit) &&
        (!answers.income || Number(answers.income) >= bankIncome) &&
        (!answers.employmentType ||
          b.eligibility.employmentType.toLowerCase().includes(answers.employmentType.toLowerCase())) &&
        (!answers.age || (Number(answers.age) >= bankMinAge && Number(answers.age) <= bankMaxAge)) &&
        (!answers.loanType || b.loanType.toLowerCase() === answers.loanType.toLowerCase()) &&
        (!answers.tenure || Number(answers.tenure) <= bankTenureMax)
      );
    });

    // Limit results to 15 banks
    setFilteredBanks(results.slice(0, 15));
  };

  const resetForm = () => {
    setStep(0);
    setAnswers({
      creditScore: "",
      income: "",
      employmentType: "",
      age: "",
      loanType: "",
      tenure: "",
    });
    setFilteredBanks([]);
    setSubmitted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600 animate-pulse">Loading bank data...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <ArrowBackIos className="w-6 h-6 text-gray-600 mb-4 cursor-pointer" onClick={() => window.history.back()} />
      <div className="max-w-10xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🏦 Smart Loan Finder</h1>
            <p className="text-1xl">Quickly compare and match the best bank loans for your needs</p>
            <br />
          <p className="text-gray-600 text-3xl">Find the perfect loan tailored just for you!</p>
        </div>

        {!submitted ? (
          /* Question Card */
          <div className="relative">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Progress</span>
                <span className="text-sm text-gray-500">{step + 1} of {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div 
              key={step}
              className={` bg-gradient-to-br from-blue-500 to-black rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-500 ${
                inputFocused ? 'scale-105' : 'hover:scale-102'
              } hover:shadow-3xl border border-gray-100`}
              style={{
                animation: 'slideInUp 0.6s ease-out'
              }}
            >
              <ArrowBackIos className="w-6 h-6 text-white mb-4 cursor-pointer" onClick={() => step > 0 && setStep(step - 1)} />
              {/* Icon and Question */}
              <div className="flex items-center justify-center mb-8">
                <div className={`p-4 rounded-full bg-gradient-to-r ${questions[step].gradient} text-white shadow-lg transform transition-transform duration-300 hover:scale-110`}>
                  {questions[step].icon}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
                {questions[step].label}
              </h2>

              {/* Input Field */}
              <div className="max-w-md mx-auto mb-8">
                {questions[step].type === "select" ? (
                  <div className="space-y-3">
                    {questions[step].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChange(questions[step].field, option)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:scale-105 ${
                          answers[questions[step].field] === option
                            ? `border-transparent bg-gradient-to-r ${questions[step].gradient} text-white shadow-lg`
                            : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="number"
                    placeholder={questions[step].placeholder || "Enter value"}
                    value={answers[questions[step].field]}
                    onChange={(e) => handleChange(questions[step].field, e.target.value)}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    className="w-full p-4 text-xl text-center border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 bg-white shadow-inner"
                  />
                )}
              </div>
              
              {/* Next Button */}
              <div className="text-center">
                <button
                  onClick={handleNext}
                  disabled={!answers[questions[step].field]}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                    answers[questions[step].field]
                      ? `bg-gradient-to-r ${questions[step].gradient} text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {step < questions.length - 1 ? '✨ Next Step' : '🔍 Find My Banks'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="animate-fade-in">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                🎉 Perfect Matches Found!
              </h2>
              <p className="text-gray-600 mb-6">
                Here are the banks that match your criteria
              </p>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🔄 Start Over
              </button>
            </div>

            {/* Results Grid */}
            {filteredBanks.length > 0 ? (
              <div className="grid gap-6 md:gap-8">
                {filteredBanks.map((b, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-102 border border-gray-100 overflow-hidden"
                    style={{
                      animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`
                    }}
                  >
                    {/* Bank Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                            {getLoanTypeIcon(b.loanType)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{b.bankName}</h3>
                            <p className="text-blue-100">{b.loanType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-blue-100">Interest Rate</p>
                          <p className="text-lg font-bold">{b.eligibility.interestRate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Min Income</p>
                            <p className="font-semibold">{b.eligibility.minIncome}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Employment</p>
                            <p className="font-semibold">{b.eligibility.employmentType}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Age Range</p>
                            <p className="font-semibold">{b.eligibility.minAge}–{b.eligibility.maxAge} years</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-500">Tenure</p>
                            <p className="font-semibold">{b.eligibility.tenure} months</p>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <a
                        href={b.eligibility.website}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 no-underline"
                      >
                        🚀 Apply Now at {b.bankName}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">No banks match your criteria</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any banks matching your requirements. Try adjusting your criteria.
                </p>
                <button
                  onClick={resetForm}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  🔄 Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .active\\:scale-95:active {
          transform: scale(0.95);
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        .no-underline {
          text-decoration: none !important;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default LoanApplicationGuide;
