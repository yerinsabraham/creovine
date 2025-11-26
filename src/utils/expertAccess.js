/**
 * Expert Access Control System
 * Manages tiered access to experts based on user engagement level
 */

// Access levels
export const ACCESS_LEVELS = {
  PUBLIC: 'public', // Anyone can access
  PROJECT_SUBMITTED: 'project-submitted', // Must submit a project
  PROJECT_APPROVED: 'project-approved', // Project must be approved/paid
  PREMIUM: 'premium' // Special access tier
};

// Expert categories
export const EXPERT_CATEGORIES = {
  SUPPORT: 'support',
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  MOBILE: 'mobile',
  DESIGN: 'design',
  PRODUCT: 'product',
  MARKETING: 'marketing',
  FULLSTACK: 'fullstack'
};

/**
 * Check if user can access a specific expert
 * @param {Object} expert - Expert object with accessLevel
 * @param {Object} user - User object (can be null)
 * @param {Object} userProjects - User's project data from Firestore
 * @returns {Object} { canAccess: boolean, reason: string, unlockPath: string }
 */
export const checkExpertAccess = (expert, user, userProjects = null) => {
  // Always allow support expert access
  if (expert.category === EXPERT_CATEGORIES.SUPPORT) {
    return {
      canAccess: true,
      reason: 'always-available',
      unlockPath: null
    };
  }

  // User must be logged in for non-support experts
  if (!user) {
    return {
      canAccess: false,
      reason: 'login-required',
      unlockPath: 'login',
      message: 'Please sign in to access specialized experts'
    };
  }

  const accessLevel = expert.accessLevel || ACCESS_LEVELS.PROJECT_SUBMITTED;

  // Check access based on level
  switch (accessLevel) {
    case ACCESS_LEVELS.PUBLIC:
      return {
        canAccess: true,
        reason: 'public-access',
        unlockPath: null
      };

    case ACCESS_LEVELS.PROJECT_SUBMITTED:
      // Check if user has submitted any project
      const hasSubmittedProject = userProjects?.hasSubmittedProject || false;
      
      if (hasSubmittedProject) {
        // Check if they submitted a relevant project for this expert
        const relevantProject = checkRelevantProject(expert.category, userProjects);
        return {
          canAccess: true,
          reason: 'project-submitted',
          unlockPath: null,
          isNewlyUnlocked: relevantProject?.isNew || false
        };
      }

      return {
        canAccess: false,
        reason: 'no-project',
        unlockPath: 'submit-project',
        message: 'Submit a project to unlock this expert',
        suggestedAction: 'Start by chatting with Support, then submit your project'
      };

    case ACCESS_LEVELS.PROJECT_APPROVED:
      const hasApprovedProject = userProjects?.hasApprovedProject || false;
      
      if (hasApprovedProject) {
        return {
          canAccess: true,
          reason: 'project-approved',
          unlockPath: null
        };
      }

      return {
        canAccess: false,
        reason: 'project-not-approved',
        unlockPath: 'await-approval',
        message: 'Available after project approval',
        suggestedAction: 'Your project is under review. You\'ll get access once approved!'
      };

    case ACCESS_LEVELS.PREMIUM:
      const hasPremiumAccess = userProjects?.isPremium || false;
      
      if (hasPremiumAccess) {
        return {
          canAccess: true,
          reason: 'premium-access',
          unlockPath: null
        };
      }

      return {
        canAccess: false,
        reason: 'premium-required',
        unlockPath: 'upgrade-premium',
        message: 'Premium expert - Available with approved projects',
        suggestedAction: 'Submit and pay for a project to unlock premium experts'
      };

    default:
      return {
        canAccess: false,
        reason: 'unknown',
        unlockPath: 'contact-support',
        message: 'Contact support for access'
      };
  }
};

/**
 * Check if user has submitted a relevant project for the expert category
 * @param {string} expertCategory - Expert's category
 * @param {Object} userProjects - User's project data
 * @returns {Object|null} Relevant project if found
 */
const checkRelevantProject = (expertCategory, userProjects) => {
  if (!userProjects?.projects) return null;

  const categoryMapping = {
    [EXPERT_CATEGORIES.FRONTEND]: ['frontend', 'fullstack', 'landingPage'],
    [EXPERT_CATEGORIES.BACKEND]: ['backend', 'fullstack', 'api', 'database'],
    [EXPERT_CATEGORIES.MOBILE]: ['mobile', 'fullstack'],
    [EXPERT_CATEGORIES.DESIGN]: ['design', 'frontend', 'landingPage'],
    [EXPERT_CATEGORIES.FULLSTACK]: ['frontend', 'backend', 'fullstack']
  };

  const relevantServices = categoryMapping[expertCategory] || [];
  
  // Check if user has submitted a project with relevant services
  const relevantProject = userProjects.projects.find(project => {
    const projectServices = project.services || [];
    return relevantServices.some(service => projectServices.includes(service));
  });

  return relevantProject;
};

/**
 * Get unlock instructions for locked expert
 * @param {string} unlockPath - Path/reason for unlock
 * @param {string} expertName - Name of the expert
 * @returns {Object} { title: string, steps: Array, cta: string }
 */
export const getUnlockInstructions = (unlockPath, expertName) => {
  const instructions = {
    'login': {
      title: 'Sign In Required',
      steps: [
        '🔐 Create your free account or sign in',
        '💬 Start chatting with Support',
        '📋 Share your project needs',
        `✨ Unlock ${expertName}`
      ],
      cta: 'Sign In to Continue',
      ctaAction: 'login'
    },
    'submit-project': {
      title: 'Submit Your Project First',
      steps: [
        '💬 Chat with our Support team (2 min)',
        '📋 Share your project requirements',
        '✅ Submit your project details',
        `🎯 Unlock ${expertName} immediately`
      ],
      cta: 'Chat with Support',
      ctaAction: 'chat-support',
      secondaryCta: 'Submit Project Directly',
      secondaryAction: 'submit-project'
    },
    'await-approval': {
      title: 'Almost There!',
      steps: [
        '✅ Your project is submitted',
        '👀 Our team is reviewing (< 24hrs)',
        '💰 You\'ll receive a quote soon',
        `🎉 ${expertName} will unlock after approval`
      ],
      cta: 'View Project Status',
      ctaAction: 'view-dashboard',
      note: 'You can chat with Support while waiting!'
    },
    'upgrade-premium': {
      title: 'Premium Expert Access',
      steps: [
        '💼 Submit your project requirements',
        '💰 Approve and pay for your project',
        '🎯 Get dedicated expert support',
        `✨ Access ${expertName} and other premium experts`
      ],
      cta: 'Submit Project',
      ctaAction: 'submit-project'
    },
    'contact-support': {
      title: 'Need Help?',
      steps: [
        '💬 Chat with our Support team',
        '🤝 Discuss your specific needs',
        '🎯 Get matched to the right expert',
        `✨ Get access to ${expertName}`
      ],
      cta: 'Chat with Support',
      ctaAction: 'chat-support'
    }
  };

  return instructions[unlockPath] || instructions['contact-support'];
};

/**
 * Get visual state for expert card
 * @param {boolean} canAccess - Whether user can access expert
 * @param {boolean} isNewlyUnlocked - Whether expert was recently unlocked
 * @returns {Object} Visual properties for the card
 */
export const getExpertCardState = (canAccess, isNewlyUnlocked = false) => {
  if (canAccess) {
    return {
      isLocked: false,
      opacity: 1,
      filter: 'none',
      cursor: 'pointer',
      showBadge: isNewlyUnlocked,
      badgeText: 'NEW!',
      badgeColor: '#29BD98',
      overlayVisible: false
    };
  }

  return {
    isLocked: true,
    opacity: 0.6,
    filter: 'blur(1px)',
    cursor: 'pointer',
    showBadge: true,
    badgeText: '🔒 LOCKED',
    badgeColor: '#EF4444',
    overlayVisible: true
  };
};

/**
 * Prioritize support expert and sort others
 * @param {Array} experts - Array of expert objects
 * @returns {Array} Sorted experts with support first
 */
export const sortExpertsWithSupportFirst = (experts) => {
  return [...experts].sort((a, b) => {
    // Support expert always first
    if (a.category === EXPERT_CATEGORIES.SUPPORT) return -1;
    if (b.category === EXPERT_CATEGORIES.SUPPORT) return 1;
    
    // Then sort by name
    return a.name.localeCompare(b.name);
  });
};

/**
 * Get expert unlock status from user's submitted projects
 * @param {Object} userProjects - User's project data from Firestore
 * @returns {Object} Map of expert categories to unlock status
 */
export const getExpertUnlockStatus = (userProjects) => {
  if (!userProjects?.projects || userProjects.projects.length === 0) {
    return {
      hasAnyProject: false,
      unlockedCategories: [EXPERT_CATEGORIES.SUPPORT]
    };
  }

  const unlockedCategories = new Set([EXPERT_CATEGORIES.SUPPORT]);
  
  userProjects.projects.forEach(project => {
    const services = project.services || [];
    
    // Unlock relevant experts based on submitted services
    if (services.includes('frontend') || services.includes('landingPage')) {
      unlockedCategories.add(EXPERT_CATEGORIES.FRONTEND);
    }
    if (services.includes('backend') || services.includes('api') || services.includes('database')) {
      unlockedCategories.add(EXPERT_CATEGORIES.BACKEND);
    }
    if (services.includes('mobile')) {
      unlockedCategories.add(EXPERT_CATEGORIES.MOBILE);
    }
    if (services.includes('design')) {
      unlockedCategories.add(EXPERT_CATEGORIES.DESIGN);
    }
    if (services.includes('fullstack')) {
      unlockedCategories.add(EXPERT_CATEGORIES.FRONTEND);
      unlockedCategories.add(EXPERT_CATEGORIES.BACKEND);
      unlockedCategories.add(EXPERT_CATEGORIES.FULLSTACK);
    }
  });

  return {
    hasAnyProject: true,
    unlockedCategories: Array.from(unlockedCategories),
    hasApprovedProject: userProjects.hasApprovedProject || false,
    isPremium: userProjects.isPremium || false
  };
};
