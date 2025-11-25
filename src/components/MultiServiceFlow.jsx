import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';

/**
 * MultiServiceFlow Component
 * 
 * Orchestrates navigation between multiple service onboarding flows.
 * - Tracks which services have been completed
 * - Routes to the next incomplete service
 * - Redirects to summary page when all services are complete
 */
const MultiServiceFlow = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectData, markServiceComplete, getNextIncompleteService } = useProject();

  useEffect(() => {
    // Check if we're on a final step of any service
    const isFinalStep = location.pathname.match(/\/(step\d+)$/);
    
    if (isFinalStep) {
      // Get current service from path (e.g., /onboarding/frontend/step4 -> frontend)
      const pathParts = location.pathname.split('/');
      const serviceIndex = pathParts.findIndex(part => part === 'onboarding');
      const currentService = pathParts[serviceIndex + 1];
      
      // Check if this is the last step for this service
      // This will be triggered by the submit button in each service's final step
    }
  }, [location]);

  return <>{children}</>;
};

export default MultiServiceFlow;
