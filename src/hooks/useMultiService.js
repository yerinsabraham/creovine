import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';

/**
 * Custom hook to handle multi-service onboarding completion
 * 
 * Usage in final step of each service:
 * const handleComplete = useMultiServiceComplete('frontend');
 * 
 * Then call handleComplete(formData) instead of submitProject()
 */
export const useMultiServiceComplete = (serviceId) => {
  const navigate = useNavigate();
  const { 
    projectData, 
    markServiceComplete, 
    getNextIncompleteService, 
    areAllServicesComplete,
    submitProject 
  } = useProject();

  const handleComplete = async (serviceData) => {
    // Mark current service as complete
    await markServiceComplete(serviceId, serviceData);

    // Check if there are more services to complete
    const nextService = getNextIncompleteService();
    
    if (nextService && !areAllServicesComplete()) {
      // Navigate to next service
      navigate(nextService.route);
    } else {
      // All services complete - go to summary page
      navigate('/multi-service-summary');
    }
  };

  return handleComplete;
};

/**
 * Check if we're in multi-service mode
 */
export const useIsMultiService = () => {
  const { projectData } = useProject();
  const hasAddOns = projectData.addOns && projectData.addOns.length > 0;
  return hasAddOns;
};

/**
 * Get progress info for multi-service flow
 */
export const useMultiServiceProgress = () => {
  const { projectData } = useProject();
  
  const totalServices = projectData.primaryService 
    ? 1 + (projectData.addOns?.length || 0) 
    : 0;
  
  const completedCount = projectData.completedServices?.length || 0;
  
  const currentServiceIndex = completedCount;
  const currentService = completedCount === 0 
    ? projectData.primaryService 
    : projectData.addOns?.[completedCount - 1];

  return {
    totalServices,
    completedCount,
    currentServiceIndex,
    currentService,
    progress: totalServices > 0 ? (completedCount / totalServices) * 100 : 0
  };
};
