import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useAdmin } from './context/AdminContext';
import LandingPageClean from './pages/LandingPageClean';
import SolutionHub from './pages/SolutionHub';
import FAQPage from './pages/FAQPage';
import ExpertsPage from './pages/ExpertsPage';
import ExpertChatPage from './pages/ExpertChatPage';
import Phase1Page from './pages/onboarding/Phase1PageNew';
import Phase2Page from './pages/onboarding/Phase2PageNew';
import LandingPageStep1 from './pages/onboarding/LandingPageStep1';
import Phase3Page from './pages/onboarding/Phase3PageNew';
import Phase4Page from './pages/onboarding/Phase4PageNew';
import Phase5Page from './pages/onboarding/Phase5PageNew';
import Phase6Page from './pages/onboarding/Phase6PageNew';
import PlaceholderOnboarding from './pages/onboarding/PlaceholderOnboarding';
import FrontendStep1 from './pages/onboarding/frontend/FrontendStep1';
import FrontendStep2 from './pages/onboarding/frontend/FrontendStep2';
import FrontendStep3 from './pages/onboarding/frontend/FrontendStep3';
import FrontendStep4 from './pages/onboarding/frontend/FrontendStep4';
import BackendStep1 from './pages/onboarding/backend/BackendStep1';
import BackendStep2 from './pages/onboarding/backend/BackendStep2';
import BackendStep3 from './pages/onboarding/backend/BackendStep3';
import BackendStep4 from './pages/onboarding/backend/BackendStep4';
import LandingPageOnboardingStep1 from './pages/onboarding/landingpage/LandingPageStep1';
import LandingPageOnboardingStep2 from './pages/onboarding/landingpage/LandingPageStep2';
import LandingPageOnboardingStep3 from './pages/onboarding/landingpage/LandingPageStep3';
import DesignStep1 from './pages/onboarding/design/DesignStep1';
import DesignStep2 from './pages/onboarding/design/DesignStep2';
import DesignStep3 from './pages/onboarding/design/DesignStep3';
import ContractStep1 from './pages/onboarding/contract/ContractStep1';
import ContractStep2 from './pages/onboarding/contract/ContractStep2';
import ContractStep3 from './pages/onboarding/contract/ContractStep3';
import ContractStep4 from './pages/onboarding/contract/ContractStep4';
import BugfixStep1 from './pages/onboarding/bugfix/BugfixStep1';
import BugfixStep2 from './pages/onboarding/bugfix/BugfixStep2';
import ApiStep1 from './pages/onboarding/api/ApiStep1';
import ApiStep2 from './pages/onboarding/api/ApiStep2';
import ApiStep3 from './pages/onboarding/api/ApiStep3';
import QRCodeStep1 from './pages/onboarding/qrcode/QRCodeStep1';
import QRCodeStep2 from './pages/onboarding/qrcode/QRCodeStep2';
import QRCodeStep3 from './pages/onboarding/qrcode/QRCodeStep3';
import DatabaseStep1 from './pages/onboarding/database/DatabaseStep1';
import DatabaseStep2 from './pages/onboarding/database/DatabaseStep2';
import DatabaseStep3 from './pages/onboarding/database/DatabaseStep3';
import AuthStep1 from './pages/onboarding/auth/AuthStep1';
import AuthStep2 from './pages/onboarding/auth/AuthStep2';
import AuthStep3 from './pages/onboarding/auth/AuthStep3';
import PaymentStep1 from './pages/onboarding/payment/PaymentStep1';
import PaymentStep2 from './pages/onboarding/payment/PaymentStep2';
import PaymentStep3 from './pages/onboarding/payment/PaymentStep3';
import DeploymentStep1 from './pages/onboarding/deployment/DeploymentStep1';
import DeploymentStep2 from './pages/onboarding/deployment/DeploymentStep2';
import RefactorStep1 from './pages/onboarding/refactor/RefactorStep1';
import RefactorStep2 from './pages/onboarding/refactor/RefactorStep2';
import RefactorStep3 from './pages/onboarding/refactor/RefactorStep3';
import WebsiteUpgradeStep1 from './pages/onboarding/website-upgrade/WebsiteUpgradeStep1';
import WebsiteUpgradeStep2 from './pages/onboarding/website-upgrade/WebsiteUpgradeStep2';
import WebsiteUpgradeStep3 from './pages/onboarding/website-upgrade/WebsiteUpgradeStep3';
import AdminDashboard from './pages/AdminDashboard';
import SuccessPage from './pages/SuccessPage';
import ProjectSubmittedPage from './pages/ProjectSubmittedPage';
import MultiServiceSummary from './pages/MultiServiceSummary';
import ProjectQuotePage from './pages/ProjectQuotePage';
import UserDashboard from './pages/UserDashboard';
import ExpertConsultationPage from './pages/ExpertConsultationPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/" />;
};

// Admin-only Route Component
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const { isAdmin } = useAdmin();
  
  if (!currentUser) return <Navigate to="/" />;
  if (!isAdmin) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageClean />} />
        <Route path="/get-started" element={<SolutionHub />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/experts" element={<ExpertsPage />} />
        <Route path="/chat/:expertId" element={<ExpertChatPage />} />
        
        {/* Landing Page Flow */}
        <Route path="/onboarding/landingpage/step1" element={<ProtectedRoute><LandingPageOnboardingStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/landingpage/step2" element={<ProtectedRoute><LandingPageOnboardingStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/landingpage/step3" element={<ProtectedRoute><LandingPageOnboardingStep3 /></ProtectedRoute>} />
        
        {/* Frontend Development Flow */}
        <Route path="/onboarding/frontend/step1" element={<ProtectedRoute><FrontendStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/frontend/step2" element={<ProtectedRoute><FrontendStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/frontend/step3" element={<ProtectedRoute><FrontendStep3 /></ProtectedRoute>} />
        <Route path="/onboarding/frontend/step4" element={<ProtectedRoute><FrontendStep4 /></ProtectedRoute>} />
        
        {/* Backend Development Flow */}
        <Route path="/onboarding/backend/step1" element={<ProtectedRoute><BackendStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/backend/step2" element={<ProtectedRoute><BackendStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/backend/step3" element={<ProtectedRoute><BackendStep3 /></ProtectedRoute>} />
        <Route path="/onboarding/backend/step4" element={<ProtectedRoute><BackendStep4 /></ProtectedRoute>} />
        
        {/* UI/UX Design Flow */}
        <Route path="/onboarding/design/step1" element={<ProtectedRoute><DesignStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/design/step2" element={<ProtectedRoute><DesignStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/design/step3" element={<ProtectedRoute><DesignStep3 /></ProtectedRoute>} />
        
        {/* Smart Contract Flow */}
        <Route path="/onboarding/contract/step1" element={<ProtectedRoute><ContractStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/contract/step2" element={<ProtectedRoute><ContractStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/contract/step3" element={<ProtectedRoute><ContractStep3 /></ProtectedRoute>} />
        <Route path="/onboarding/contract/step4" element={<ProtectedRoute><ContractStep4 /></ProtectedRoute>} />
        
        {/* Bug Fix Flow */}
        <Route path="/onboarding/bugfix/step1" element={<ProtectedRoute><BugfixStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/bugfix/step2" element={<ProtectedRoute><BugfixStep2 /></ProtectedRoute>} />
        
        {/* API Integration Flow */}
        <Route path="/onboarding/api/step1" element={<ProtectedRoute><ApiStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/api/step2" element={<ProtectedRoute><ApiStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/api/step3" element={<ProtectedRoute><ApiStep3 /></ProtectedRoute>} />
        
        {/* QR Code System Flow */}
        <Route path="/onboarding/qrcode/step1" element={<ProtectedRoute><QRCodeStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/qrcode/step2" element={<ProtectedRoute><QRCodeStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/qrcode/step3" element={<ProtectedRoute><QRCodeStep3 /></ProtectedRoute>} />
        
        {/* Database Setup Flow */}
        <Route path="/onboarding/database/step1" element={<ProtectedRoute><DatabaseStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/database/step2" element={<ProtectedRoute><DatabaseStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/database/step3" element={<ProtectedRoute><DatabaseStep3 /></ProtectedRoute>} />
        
        {/* Authentication Flow */}
        <Route path="/onboarding/auth/step1" element={<ProtectedRoute><AuthStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/auth/step2" element={<ProtectedRoute><AuthStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/auth/step3" element={<ProtectedRoute><AuthStep3 /></ProtectedRoute>} />
        
        {/* Payment Integration Flow */}
        <Route path="/onboarding/payment/step1" element={<ProtectedRoute><PaymentStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/payment/step2" element={<ProtectedRoute><PaymentStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/payment/step3" element={<ProtectedRoute><PaymentStep3 /></ProtectedRoute>} />
        
        {/* Deployment Help Flow */}
        <Route path="/onboarding/deployment/step1" element={<ProtectedRoute><DeploymentStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/deployment/step2" element={<ProtectedRoute><DeploymentStep2 /></ProtectedRoute>} />
        
        {/* Code Refactoring Flow */}
        <Route path="/onboarding/refactor/step1" element={<ProtectedRoute><RefactorStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/refactor/step2" element={<ProtectedRoute><RefactorStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/refactor/step3" element={<ProtectedRoute><RefactorStep3 /></ProtectedRoute>} />
        
        {/* Website Update/Upgrade Flow */}
        <Route path="/onboarding/website-upgrade/step1" element={<ProtectedRoute><WebsiteUpgradeStep1 /></ProtectedRoute>} />
        <Route path="/onboarding/website-upgrade/step2" element={<ProtectedRoute><WebsiteUpgradeStep2 /></ProtectedRoute>} />
        <Route path="/onboarding/website-upgrade/step3" element={<ProtectedRoute><WebsiteUpgradeStep3 /></ProtectedRoute>} />
        
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/onboarding/phase1" 
          element={
            <ProtectedRoute>
              <Phase1Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding/phase2" 
          element={
            <ProtectedRoute>
              <Phase2Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding/phase3" 
          element={
            <ProtectedRoute>
              <Phase3Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding/phase4" 
          element={
            <ProtectedRoute>
              <Phase4Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding/phase5" 
          element={
            <ProtectedRoute>
              <Phase5Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding/phase6" 
          element={
            <ProtectedRoute>
              <Phase6Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <Phase1Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/success" 
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/project-submitted" 
          element={
            <ProtectedRoute>
              <ProjectSubmittedPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/multi-service-summary" 
          element={
            <ProtectedRoute>
              <MultiServiceSummary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quote" 
          element={
            <ProtectedRoute>
              <ProjectQuotePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expert-consultation" 
          element={
            <ProtectedRoute>
              <ExpertConsultationPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
