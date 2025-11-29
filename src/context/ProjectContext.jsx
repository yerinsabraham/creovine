import { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentPhase, setCurrentPhase] = useState(1);
  const [projectData, setProjectData] = useState({
    // Service Category Selection (from Solution Hub)
    serviceCategory: '', // 'full-app', 'landing-page', 'smart-contract', etc.
    serviceName: '',
    // Multi-select: Primary service and add-ons
    primaryService: null, // { id, name, route }
    addOns: [], // [{ id, name }, { id, name }]
    
    // Multi-service tracking
    completedServices: [], // [{ id, name, data: {...} }]
    currentServiceIndex: 0, // Index in the service flow (0 = primary, 1+ = add-ons)
    
    // Phase 1: App Vision
    vision: {
      appType: '',
      corePurpose: '',
      keyFeatures: [],
      inspiration: ''
    },
    // Phase 2: Target Users
    users: {
      targetAudience: '',
      userTypes: [],
      userJourney: ''
    },
    // Phase 3: Features & Functionality
    functionality: {
      authentication: [],
      userAccounts: [],
      coreFeatures: [],
      additionalFeatures: []
    },
    // Phase 4: Backend & Data
    backend: {
      databaseNeeds: [],
      integrations: [],
      fileStorage: [],
      realtimeFeatures: []
    },
    // Phase 5: Identity & Design
    identity: {
      projectName: '',
      tagline: '',
      description: '',
      primaryColor: '#29BD98',
      secondaryColor: '#2497F9',
      designStyle: '',
      logoFile: null,
      logoURL: ''
    },
    // Phase 6: Deployment & Support
    deployment: {
      deploymentPlatform: '',
      customDomain: '',
      domainOwnership: false,
      launchTimeline: '',
      supportNeeds: ''
    }
  });
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load project data from Firestore
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const projectRef = doc(db, 'projects', `${currentUser.uid}_draft`);
    
    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Merge phases with root-level metadata (primaryService, addOns, etc.)
        const mergedData = {
          ...(data.phases || {}),
          primaryService: data.primaryService,
          addOns: data.addOns,
          serviceCategory: data.serviceCategory,
          serviceName: data.serviceName,
          completedServices: data.completedServices,
          currentServiceIndex: data.currentServiceIndex
        };
        setProjectData(mergedData);
        setCurrentPhase(data.currentPhase || 1);
        setProjectId(docSnap.id);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading project:', error);
      setLoading(false); // Continue even if error
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Auto-save to Firestore with file upload support
  const updatePhaseData = async (phase, data) => {
    if (!currentUser) return;

    // Handle logo file upload if present
    let updatedData = { ...data };
    if (data.logoFile && data.logoFile instanceof File) {
      try {
        const logoRef = ref(storage, `logos/${currentUser.uid}/${Date.now()}_${data.logoFile.name}`);
        await uploadBytes(logoRef, data.logoFile);
        const logoURL = await getDownloadURL(logoRef);
        updatedData.logoURL = logoURL;
        delete updatedData.logoFile; // Remove file object, keep URL
      } catch (error) {
        console.error('Error uploading logo:', error);
      }
    }

    // Handle additional file uploads if present
    if (data.files && Array.isArray(data.files)) {
      const uploadedFiles = [];
      for (const file of data.files) {
        if (file instanceof File) {
          try {
            const fileRef = ref(storage, `documents/${currentUser.uid}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            const fileURL = await getDownloadURL(fileRef);
            uploadedFiles.push({ name: file.name, url: fileURL });
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }
      }
      updatedData.uploadedFiles = uploadedFiles;
      delete updatedData.files; // Remove file objects, keep URLs
    }

    const updatedProjectData = {
      ...projectData,
      [phase]: { ...projectData[phase], ...updatedData }
    };

    setProjectData(updatedProjectData);

    // Filter out metadata fields (primaryService, addOns, etc.) from phases
    const { primaryService, addOns, serviceCategory, serviceName, completedServices, currentServiceIndex, ...phasesOnly } = updatedProjectData;

    // Save to Firestore
    const projectRef = doc(db, 'projects', `${currentUser.uid}_draft`);
    await setDoc(projectRef, {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || currentUser.email,
      phases: phasesOnly,
      currentPhase,
      status: 'draft',
      updatedAt: serverTimestamp()
    }, { merge: true });
  };

  // Navigate to phase
  const goToPhase = async (phaseNumber) => {
    setCurrentPhase(phaseNumber);
    
    if (currentUser) {
      const projectRef = doc(db, 'projects', `${currentUser.uid}_draft`);
      await setDoc(projectRef, {
        currentPhase: phaseNumber,
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
  };

  // Mark a service as complete and move to next
  const markServiceComplete = async (serviceId, serviceData) => {
    const updatedCompletedServices = [
      ...(projectData.completedServices || []),
      { id: serviceId, data: serviceData, completedAt: new Date().toISOString() }
    ];

    const updatedProjectData = {
      ...projectData,
      completedServices: updatedCompletedServices,
      currentServiceIndex: (projectData.currentServiceIndex || 0) + 1
    };

    setProjectData(updatedProjectData);

    // Filter out metadata fields from phases
    const { primaryService, addOns, serviceCategory, serviceName, completedServices, currentServiceIndex, ...phasesOnly } = updatedProjectData;

    // Save to Firestore
    if (currentUser) {
      const projectRef = doc(db, 'projects', `${currentUser.uid}_draft`);
      await setDoc(projectRef, {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        phases: phasesOnly,
        currentPhase,
        status: 'draft',
        updatedAt: serverTimestamp(),
        // Save metadata at root level
        completedServices: updatedCompletedServices,
        currentServiceIndex: (projectData.currentServiceIndex || 0) + 1
      }, { merge: true });
    }

    return updatedProjectData;
  };

  // Get next incomplete service
  const getNextIncompleteService = () => {
    const { primaryService, addOns, completedServices = [] } = projectData;
    const allServices = primaryService ? [primaryService, ...(addOns || [])] : [];
    
    const completedIds = completedServices.map(s => s.id);
    const nextService = allServices.find(service => !completedIds.includes(service.id));
    
    return nextService;
  };

  // Check if all services are complete
  const areAllServicesComplete = () => {
    const { primaryService, addOns, completedServices = [] } = projectData;
    const allServices = primaryService ? [primaryService, ...(addOns || [])] : [];
    
    if (allServices.length === 0) return false;
    
    const completedIds = completedServices.map(s => s.id);
    return allServices.every(service => completedIds.includes(service.id));
  };

  // Update root-level project data (for service selections, etc.)
  const updateProjectMetadata = async (updates) => {
    if (!currentUser) return;

    // Don't merge updates into projectData state (they're root-level metadata, not phase data)
    // Just update Firestore with the metadata at root level
    const projectRef = doc(db, 'projects', `${currentUser.uid}_draft`);
    await setDoc(projectRef, {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || currentUser.email,
      currentPhase,
      status: 'draft',
      updatedAt: serverTimestamp(),
      ...updates // Service metadata at root level
    }, { merge: true });
  };

  // Submit project
  const submitProject = async (finalData) => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const dataToSubmit = finalData || projectData;
    
    // Filter out metadata fields from phases
    const { primaryService, addOns, serviceCategory, serviceName, completedServices, currentServiceIndex, ...phasesOnly } = dataToSubmit;

    // Create submitted project with userId in document ID for Firestore rules
    const submittedProjectId = `${currentUser.uid}_submitted_${Date.now()}`;
    const projectRef = doc(db, 'projects', submittedProjectId);
    
    // Build submission data - only include defined fields
    const submissionData = {
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName || currentUser.email,
      phases: phasesOnly,
      status: 'submitted',
      createdAt: serverTimestamp(),
      submittedAt: serverTimestamp()
    };

    // Only add metadata if it exists
    if (primaryService) submissionData.primaryService = primaryService;
    if (addOns && addOns.length > 0) submissionData.addOns = addOns;
    if (serviceCategory) submissionData.serviceCategory = serviceCategory;
    if (serviceName) submissionData.serviceName = serviceName;
    if (completedServices && completedServices.length > 0) submissionData.completedServices = completedServices;
    if (typeof currentServiceIndex === 'number') submissionData.currentServiceIndex = currentServiceIndex;
    
    try {
      await setDoc(projectRef, submissionData);

      // Update user onboarding status
      await setDoc(doc(db, 'users', currentUser.uid), {
        onboardingComplete: true,
        email: currentUser.email,
        displayName: currentUser.displayName || currentUser.email,
        lastSubmittedAt: serverTimestamp()
      }, { merge: true });
      
      console.log('Project submitted successfully:', submittedProjectId);
    } catch (error) {
      console.error('Error submitting project:', error);
      throw error;
    }
  };

  const value = {
    currentPhase,
    projectData,
    loading,
    updatePhaseData,
    updateProjectData: updatePhaseData, // Alias for backward compatibility
    updateProjectMetadata,
    goToPhase,
    submitProject,
    markServiceComplete,
    getNextIncompleteService,
    areAllServicesComplete
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
