import React, { useEffect, useState, Suspense, lazy } from "react";
import {BrowserRouter as Router,Routes,Route,useLocation,} from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Loader from "./pages/Loader";
import LazyWrapper from "./components/LazyWrapper";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Lazy load heavy components for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const OTPLogin = lazy(() => import("./pages/OTPLogin"));
const MultiStepLogin = lazy(() => import("./pages/MultiStepLogin"));
const Signup = lazy(() => import("./pages/Signup"));
const Calculator = lazy(() => import("./pages/Calculator"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const MutualFund = lazy(() => import("./pages/MutualFund"));
const OurHistory = lazy(() => import("./pages/OurHistory"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const MutualFunds = lazy(() => import("./pages/MutualFunds"));
const MutualFundPlanDetails = lazy(() => import("./pages/MutualFundPlanDetails"));
const FundDetailsPage = lazy(() => import("./pages/FundDetailsPage"));
const InvestmentPage = lazy(() => import("./pages/InvestmentPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminLanding = lazy(() => import("./pages/AdminLanding"));
const PlansManagement = lazy(() => import("./pages/PlansManagement"));
const HealthInsurance = lazy(() => import("./pages/HealthInsurance"));
const HealthInsuranceDetails = lazy(() => import("./pages/HealthInsuranceDetails"));
const GeneralInsurance = lazy(() => import("./pages/GeneralInsurance"));
const GeneralInsuranceDetails = lazy(() => import("./pages/GeneralInsuranceDetails"));
const Contact = lazy(() => import("./pages/Contact"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Services = lazy(() => import("./pages/Services"));
const LumpsumCalculator = lazy(() => import("./pages/LumpsumCalculator"));
const SIPCalculator = lazy(() => import("./pages/SIPCalculator"));
const RetirementCalculator = lazy(() => import("./pages/RetirementCalculator"));
const ChildrenEducationCalculator = lazy(() => import("./pages/ChildrenEducationCalculator"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Profile = lazy(() => import("./pages/Profile"));
const Deposite = lazy(() => import("./pages/Deposite"));

const AppRoutes = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false); // Changed to false to prevent loading issues

  useEffect(() => {
    // Only show loading for initial page load, not for na  vigation
    if (location.pathname === '/') {
      setLoading(true);
      // Remove artificial delay for better performance
      setLoading(false);
    }
  }, []); // Only run on mount, not on every location change

  return loading ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LazyWrapper><HomePage /></LazyWrapper>} />
        <Route path="/login" element={<LazyWrapper><OTPLogin /></LazyWrapper>} />
        <Route path="/signup" element={<LazyWrapper><Signup /></LazyWrapper>} />
        <Route path="/otp-login" element={<LazyWrapper><OTPLogin /></LazyWrapper>} />
        <Route path="/multi-step-login" element={<LazyWrapper><MultiStepLogin /></LazyWrapper>} />
        <Route path="/calculator" element={<LazyWrapper><Calculator /></LazyWrapper>} />
        <Route path="/about-us" element={<LazyWrapper><AboutUs /></LazyWrapper>} />
        <Route path="/chatbot" element={<LazyWrapper><ChatBot /></LazyWrapper>} />
        <Route path="/dashboard" element={<LazyWrapper><Dashboard /></LazyWrapper>} />
        <Route path="/about" element={<LazyWrapper><About /></LazyWrapper>} />
        <Route path="/mutual-fund" element={<LazyWrapper><MutualFund /></LazyWrapper>} />
        <Route path="/our-history" element={<LazyWrapper><OurHistory /></LazyWrapper>} />
        <Route path="/blog/*" element={<LazyWrapper><Blog /></LazyWrapper>} />
        <Route path="/mutual-funds" element={<LazyWrapper><MutualFunds /></LazyWrapper>} />
        <Route path="/mutual-fund-plan-details" element={<LazyWrapper><MutualFundPlanDetails /></LazyWrapper>} />
        <Route path="/fund-details/:id" element={<LazyWrapper><FundDetailsPage /></LazyWrapper>} />
        <Route path="/invest/:id" element={<LazyWrapper><InvestmentPage /></LazyWrapper>} />
        <Route path="/admin" element={<LazyWrapper><AdminLanding /></LazyWrapper>} />
        <Route path="/admin-login" element={<LazyWrapper><AdminLogin /></LazyWrapper>} />
        <Route path="/admin-dashboard" element={
          <LazyWrapper>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </LazyWrapper>
        } />
        <Route path="/plans-management" element={
          <LazyWrapper>
            <AdminRoute>
              <PlansManagement />
            </AdminRoute>
          </LazyWrapper>
        } />
        <Route path="/services" element={<LazyWrapper><Services /></LazyWrapper>} />
        <Route path="/health-insurance" element={<LazyWrapper><HealthInsurance /></LazyWrapper>} />
        <Route path="/health-insurance-details" element={<LazyWrapper><HealthInsuranceDetails /></LazyWrapper>} />
        <Route path="/general-insurance" element={<LazyWrapper><GeneralInsurance /></LazyWrapper>} />
        <Route path="/general-insurance-details" element={<LazyWrapper><GeneralInsuranceDetails /></LazyWrapper>} />
        <Route path="/contact" element={<LazyWrapper><Contact /></LazyWrapper>} />
        <Route path="/contact-us" element={<LazyWrapper><ContactUs /></LazyWrapper>} />
        <Route path="/calculator/lumpsum" element={<LazyWrapper><LumpsumCalculator /></LazyWrapper>} />
        <Route path="/calculator/sip" element={<LazyWrapper><SIPCalculator /></LazyWrapper>} />
        <Route path="/calculator/retirement-planning" element={<LazyWrapper><RetirementCalculator /></LazyWrapper>} />
        <Route path="/calculator/children-education" element={<LazyWrapper><ChildrenEducationCalculator /></LazyWrapper>} />
        <Route path="/privacy-policy" element={<LazyWrapper><PrivacyPolicy /></LazyWrapper>} />
        <Route path="/profile" element={
          <LazyWrapper>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </LazyWrapper>
        } />
        <Route path="/deposits" element={<LazyWrapper><Deposite /></LazyWrapper>} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<LazyWrapper><HomePage /></LazyWrapper>} />
      </Routes>
    </Suspense>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <Router>
            <AppRoutes />
            <ScrollToTop />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
