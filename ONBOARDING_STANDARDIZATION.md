# Onboarding Flow Standardization Guide

This document outlines all the standardized updates that should be implemented across ALL service selection onboarding flows (Frontend, Backend, Landing Page, Design, Smart Contracts, Bug Fix, API, Database, Deployment, Refactor, Website Upgrade, and Full-Stack App).

## Table of Contents
1. [Save & Exit Functionality](#save--exit-functionality)
2. [Navigation Button Layout](#navigation-button-layout)
3. [Assisted Service Pattern](#assisted-service-pattern)
4. [Timeline Selector (Final Step)](#timeline-selector-final-step)
5. [Project Estimate Modal (Final Step)](#project-estimate-modal-final-step)
6. [Submit Button & Workflow (Final Step)](#submit-button--workflow-final-step)
7. [Dashboard Integration](#dashboard-integration)
8. [Implementation Checklist](#implementation-checklist)

---

## 1. Save & Exit Functionality

### Purpose
Allow users to save their progress at any step and return later to continue from where they left off.

### Implementation

#### Step 1: Add handleSaveAndExit Function
Place this **before** the handleContinue/handleSubmit function:

```javascript
const handleSaveAndExit = async () => {
  await updatePhaseData('serviceName', { 
    ...projectData?.serviceName, 
    ...formData, 
    currentStep: X  // Replace X with current step number (1, 2, 3, 4, etc.)
  });
  navigate('/dashboard');
};
```

**Important Notes:**
- Replace `'serviceName'` with actual service key: `'frontend'`, `'backend'`, `'landingPage'`, `'design'`, `'contract'`, `'bugfix'`, `'api'`, `'database'`, `'deployment'`, `'refactor'`, `'websiteUpgrade'`
- Replace `X` with the current step number
- For full-stack app phases, use `currentPhase` instead of `currentStep`

#### Step 2: Update Navigation Buttons
See [Navigation Button Layout](#navigation-button-layout) section below.

---

## 2. Navigation Button Layout

### Three-Button Layout
All onboarding steps should have this navigation pattern:

```jsx
{/* Navigation */}
<div style={{
  display: 'flex',
  gap: '12px',
  marginTop: '48px',
  justifyContent: 'space-between',
  flexWrap: 'wrap'
}}>
  {/* Back Button - Left Side */}
  <button
    onClick={handleBack}  // or navigate to previous step
    style={{
      padding: isMobile ? '14px 24px' : '16px 32px',
      fontSize: isMobile ? '15px' : '16px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.7)',
      backgroundColor: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      cursor: 'pointer'
    }}
  >
    Back
  </button>

  {/* Save & Exit + Continue Buttons - Right Side */}
  <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
    {/* Save & Exit Button */}
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSaveAndExit}
      style={{
        padding: isMobile ? '14px 24px' : '16px 32px',
        fontSize: isMobile ? '15px' : '16px',
        fontWeight: '600',
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        cursor: 'pointer'
      }}
    >
      Save & Exit
    </motion.button>

    {/* Continue/Submit Button */}
    <motion.button
      whileHover={{ scale: isFormValid ? 1.02 : 1 }}
      whileTap={{ scale: isFormValid ? 0.98 : 1 }}
      onClick={handleContinue}  // or handleSubmit for final step
      disabled={!isFormValid}
      style={{
        padding: isMobile ? '14px 32px' : '16px 48px',
        fontSize: isMobile ? '15px' : '16px',
        fontWeight: '700',
        color: '#FFFFFF',
        background: isFormValid
          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'  // Use service-specific gradient
          : 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: '16px',
        cursor: isFormValid ? 'pointer' : 'not-allowed',
        opacity: isFormValid ? 1 : 0.5
      }}
    >
      {isLastStep ? 'Submit Project' : 'Continue to Step X'}
    </motion.button>
  </div>
</div>
```

**Service-Specific Gradients:**
- Frontend: `#29BD98 0%, #2497F9 100%` (teal to blue)
- Backend: `#6366F1 0%, #8B5CF6 100%` (indigo to purple)
- Landing Page: `#F59E0B 0%, #EF4444 100%` (amber to red)
- Design: `#EC4899 0%, #8B5CF6 100%` (pink to purple)
- Smart Contracts: `#10B981 0%, #06B6D4 100%` (green to cyan)
- Bug Fix: `#EF4444 0%, #DC2626 100%` (red gradient)
- API: `#3B82F6 0%, #2563EB 100%` (blue gradient)
- Full-Stack: `#29BD98 0%, #2497F9 100%` (teal to blue)

**Key Points:**
- **NO EMOJI** in Save & Exit button text
- Back button on left, Save & Exit + Continue on right
- Mobile responsive with `flexWrap: 'wrap'`
- Save & Exit has no validation requirement
- Continue button requires form validation

---

## 3. Assisted Service Pattern

### Purpose
Offer users the option to get help from Creovine for tasks they're unsure about, with an additional cost.

### Pattern Structure

#### Toggle Component
Use the `AssistedToggle` component for each assisted service:

```jsx
<AssistedToggle
  label="Service Description"
  tooltip="Explanation of what Creovine will help with"
  price={15}  // Standard price is $15
  value={hasItem('service-assist-id')}
  onChange={(enabled) => {
    if (enabled) {
      addItem({ 
        id: 'service-assist-id', 
        name: 'Service Name Assistance', 
        price: 15 
      });
    } else {
      removeItem('service-assist-id');
    }
  }}
/>
```

#### Two-Button Choice Pattern (Alternative)
For more complex assisted services like framework selection:

```jsx
<div style={{ marginBottom: '32px' }}>
  <label style={{ /* label styles */ }}>
    Choose Framework
    <span
      title="Explanation tooltip"
      style={{ /* tooltip icon styles */ }}
    >
      ❓
    </span>
  </label>

  {/* Two-button choice */}
  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
    <motion.button
      onClick={() => setFormData(prev => ({ ...prev, frameworkChoice: 'provide' }))}
      style={{
        flex: 1,
        padding: '16px',
        background: formData.frameworkChoice === 'provide' 
          ? 'rgba(41, 189, 152, 0.2)' 
          : 'rgba(255, 255, 255, 0.05)',
        border: formData.frameworkChoice === 'provide'
          ? '2px solid #29BD98'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: '#FFFFFF',
        cursor: 'pointer'
      }}
    >
      I will provide
    </motion.button>

    <motion.button
      onClick={() => {
        setFormData(prev => ({ ...prev, frameworkChoice: 'help', framework: '' }));
        addItem({ id: 'framework-consult', name: 'Framework Consultation', price: 15 });
      }}
      style={{
        flex: 1,
        padding: '16px',
        background: formData.frameworkChoice === 'help' 
          ? 'rgba(41, 189, 152, 0.2)' 
          : 'rgba(255, 255, 255, 0.05)',
        border: formData.frameworkChoice === 'help'
          ? '2px solid #29BD98'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: '#FFFFFF',
        cursor: 'pointer'
      }}
    >
      Help me choose the best framework
    </motion.button>
  </div>

  {/* Conditional Input Field */}
  {formData.frameworkChoice === 'provide' && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{ marginTop: '16px' }}
    >
      <select
        value={formData.framework}
        onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value }))}
        style={{ /* select styles */ }}
      >
        <option value="">Select framework...</option>
        <option value="React">React</option>
        <option value="Vue">Vue</option>
        {/* more options */}
      </select>
    </motion.div>
  )}
</div>
```

#### Validation Logic
```javascript
// If user chooses "I will provide", they must fill the field
// If user chooses "Help me", no field required (they paid for assistance)
const isValid = formData.frameworkChoice === 'help' || 
                (formData.frameworkChoice === 'provide' && formData.framework);

// Or using cart items
const hasAssist = hasItem('service-assist-id');
const isValid = hasAssist || formData.requiredField.trim();
```

**Key Points:**
- Assisted services add items to cart via `addItem()`
- When assistance is selected, related input fields become optional
- Standard assistance price: **$15**
- Always include tooltip explanation
- Input field disappears when "Help me" is selected

---

## 4. Timeline Selector (Final Step)

### Purpose
Let users choose their desired delivery timeline, which affects pricing with a multiplier.

### Implementation

Import the component:
```javascript
import TimelineSelector from '../../components/common/TimelineSelector';
```

Add to form state:
```javascript
const [formData, setFormData] = useState({
  timeline: { amount: '', unit: 'weeks' },
  timelineMultiplier: 1.0,
  // ... other fields
});
```

Use in JSX:
```jsx
<div style={{ marginBottom: '32px' }}>
  <label style={{
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '12px'
  }}>
    Delivery Timeline *
  </label>
  <TimelineSelector
    value={formData.timeline}
    onChange={(timeline, multiplier) => {
      setFormData(prev => ({
        ...prev,
        timeline,
        timelineMultiplier: multiplier
      }));
    }}
  />
</div>
```

Validation:
```javascript
const isTimelineValid = formData.timeline && formData.timeline.amount > 0;
```

**Timeline Multipliers:**
- Rush (≤5 days for medium complexity): 1.5x
- Fast (6-10 days for medium complexity): 1.2x
- Standard (11+ days): 1.0x

**Important UI Note:**
- **DO NOT display percentage fees** (e.g., "+50% Rush Fee") in the timeline selector
- Only show: emoji + label (e.g., "⚡ RUSH", "🚀 FAST", "⏱️ STANDARD")
- Reason: Displaying rush fees upfront can discourage users from selecting faster timelines even when genuinely needed
- Users will see accurate final pricing in the estimate modal after submission
- Timeline selector should focus on urgency need, not price psychology

**Display Format:**
```
⚡ RUSH     (shows red, no fee percentage)
🚀 FAST     (shows orange, no fee percentage)
⏱️ STANDARD (shows green, no fee percentage)
```

---

## 5. Project Estimate Modal (Final Step)

### Purpose
Show users the calculated project cost based on their selections, location, and timeline.

### Implementation

#### Step 1: Import Dependencies
```javascript
import { useLocation as useLocationContext } from '../../context/LocationContext';
import { useCart } from '../../context/CartContext';
import { calculateProjectEstimate } from '../../utils/pricingCalculator';
import ProjectEstimateModal from '../../components/common/ProjectEstimateModal';
```

#### Step 2: Add State & Context
```javascript
const location = useLocationContext();
const { cart } = useCart();
const [estimate, setEstimate] = useState(null);
const [showEstimateModal, setShowEstimateModal] = useState(false);
```

#### Step 3: Calculate Estimate in handleSubmit
```javascript
const handleSubmit = async () => {
  try {
    setSubmitting(true);
    
    // Save the final phase data
    const serviceData = { ...projectData.serviceName, ...formData };
    await updatePhaseData('serviceName', serviceData);
    
    if (isMultiService) {
      // Multi-service mode: mark complete and navigate
      await handleMultiServiceComplete(serviceData);
    } else {
      // Single service mode: Calculate estimate and submit
      const countryCode = location?.country || 'US';
      const timelineMultiplier = formData.timelineMultiplier || 1.0;
      const calculatedEstimate = calculateProjectEstimate(
        projectData, 
        countryCode, 
        timelineMultiplier, 
        cart
      );
      setEstimate(calculatedEstimate);
      
      // Submit project to Firestore
      await submitProject();
      
      // Block browser back button to prevent resubmission
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function() {
        window.history.pushState(null, '', window.location.href);
      };
      
      // Show the estimate modal
      setShowEstimateModal(true);
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error submitting project. Please try again. Error: ' + error.message);
  } finally {
    setSubmitting(false);
  }
};
```

#### Step 4: Add Modal Component
```jsx
{/* Project Estimate Modal */}
{showEstimateModal && estimate && (
  <ProjectEstimateModal
    estimate={estimate}
    onClose={() => {
      setShowEstimateModal(false);
      navigate('/dashboard');
    }}
  />
)}
```

**Key Points:**
- Calculate estimate BEFORE submitting to Firestore
- Use `location.country` for location-based pricing
- Use `formData.timelineMultiplier` for timeline adjustments
- Include cart items in calculation
- Block back button after submission to prevent duplicate submissions
- Modal automatically shows confetti animation

---

## 6. Submit Button & Workflow (Final Step)

### Complete Final Step Structure

```javascript
const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    // 1. Combine all form data
    const serviceData = { 
      ...projectData?.serviceName, 
      ...formData 
    };
    
    // 2. Save to Firestore
    await updatePhaseData('serviceName', serviceData);
    
    // 3. Check if multi-service or single-service
    if (isMultiService) {
      // Multi-service: Navigate to next service or summary
      await handleMultiServiceComplete(serviceData);
    } else {
      // Single-service workflow:
      
      // 4. Calculate project estimate
      const countryCode = location?.country || 'US';
      const timelineMultiplier = formData.timelineMultiplier || 1.0;
      const calculatedEstimate = calculateProjectEstimate(
        projectData,
        countryCode,
        timelineMultiplier,
        cart
      );
      setEstimate(calculatedEstimate);
      
      // 5. Submit project (changes status from draft to submitted)
      await submitProject();
      
      // 6. Block browser back button
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function() {
        window.history.pushState(null, '', window.location.href);
      };
      
      // 7. Show estimate modal with confetti
      setShowEstimateModal(true);
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Error submitting project. Please try again. Error: ' + error.message);
  } finally {
    setIsSubmitting(false);
  }
};
```

**Submit Button States:**
```jsx
<motion.button
  whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
  whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
  onClick={handleSubmit}
  disabled={!isFormValid || isSubmitting}
  style={{
    padding: isMobile ? '14px 32px' : '16px 48px',
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: '700',
    color: '#FFFFFF',
    background: isFormValid && !isSubmitting
      ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '16px',
    cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
    opacity: isFormValid && !isSubmitting ? 1 : 0.5
  }}
>
  {isSubmitting ? 'Submitting...' : 'Submit Project'}
</motion.button>
```

---

## 7. Dashboard Integration

### Project Name Display
Update `UserDashboard.jsx` to show service-specific names:

```javascript
const getProjectName = (project) => {
  // Try different possible locations for project name
  const projectName = project.phases?.identity?.projectName || 
                      project.phases?.vision?.projectName || 
                      project.identity?.projectName ||
                      project.vision?.projectName;
  
  if (projectName) {
    return projectName;
  }
  
  // If no project name, use service-friendly name based on what data exists
  if (project.frontend) return 'Frontend Development';
  if (project.backend) return 'Backend Development';
  if (project.landingPage) return 'Landing Page';
  if (project.design) return 'UI/UX Design';
  if (project.contract) return 'Smart Contract';
  if (project.bugfix) return 'Bug Fix';
  if (project.api) return 'API Integration';
  if (project.database) return 'Database Setup';
  if (project.deployment) return 'Deployment Help';
  if (project.refactor) return 'Code Refactoring';
  if (project.websiteUpgrade) return 'Website Upgrade';
  if (project.phases) return 'Full-Stack App';
  
  return 'Untitled Project';
};
```

### Resume Functionality
Update `handleProjectClick` to route to correct service step:

```javascript
const handleProjectClick = (project) => {
  setSelectedProject(project);
  
  // If draft, navigate to continue where they left off
  if (project.status === 'draft') {
    // Check which service type and route accordingly
    if (project.frontend) {
      const step = project.frontend.currentStep || 1;
      navigate(`/onboarding/frontend/step${step}`);
    } else if (project.backend) {
      const step = project.backend.currentStep || 1;
      navigate(`/onboarding/backend/step${step}`);
    } else if (project.landingPage) {
      const step = project.landingPage.currentStep || 1;
      navigate(`/onboarding/landing-page/step${step}`);
    } else if (project.design) {
      const step = project.design.currentStep || 1;
      navigate(`/onboarding/design/step${step}`);
    } else if (project.contract) {
      const step = project.contract.currentStep || 1;
      navigate(`/onboarding/smart-contract/step${step}`);
    } else if (project.bugfix) {
      const step = project.bugfix.currentStep || 1;
      navigate(`/onboarding/bugfix/step${step}`);
    } else if (project.api) {
      const step = project.api.currentStep || 1;
      navigate(`/onboarding/api/step${step}`);
    } else if (project.database) {
      const step = project.database.currentStep || 1;
      navigate(`/onboarding/database/step${step}`);
    } else if (project.deployment) {
      const step = project.deployment.currentStep || 1;
      navigate(`/onboarding/deployment/step${step}`);
    } else if (project.refactor) {
      const step = project.refactor.currentStep || 1;
      navigate(`/onboarding/refactor/step${step}`);
    } else if (project.websiteUpgrade) {
      const step = project.websiteUpgrade.currentStep || 1;
      navigate(`/onboarding/website-upgrade/step${step}`);
    } else if (project.currentPhase) {
      // Full-stack app with phases
      navigate(`/onboarding/phase${project.currentPhase}`);
    }
  }
};
```

---

## 8. Implementation Checklist

Use this checklist when implementing updates to any service selection:

### For Each Step (1, 2, 3, etc.)

- [ ] **Save & Exit Function Added**
  - [ ] Function defined before handleContinue
  - [ ] Saves `currentStep` with form data
  - [ ] Navigates to `/dashboard`

- [ ] **Navigation Buttons Updated**
  - [ ] Three-button layout implemented
  - [ ] Back button on left
  - [ ] Save & Exit + Continue on right in flex container
  - [ ] Mobile responsive with `flexWrap: 'wrap'`
  - [ ] Save & Exit has NO emoji
  - [ ] Proper service-specific gradient colors

- [ ] **Assisted Services Implemented**
  - [ ] AssistedToggle or two-button pattern used
  - [ ] Adds item to cart when enabled
  - [ ] Price set to $15 (standard)
  - [ ] Tooltip explanation included
  - [ ] Conditional input fields work correctly
  - [ ] Validation accounts for assisted mode

### For Final Step Only

- [ ] **Timeline Selector Added**
  - [ ] TimelineSelector component imported
  - [ ] `timeline` and `timelineMultiplier` in form state
  - [ ] Validation checks timeline.amount > 0

- [ ] **Estimate Calculation Implemented**
  - [ ] LocationContext imported and used
  - [ ] CartContext imported and used
  - [ ] calculateProjectEstimate imported
  - [ ] Estimate calculated before submission
  - [ ] Uses location, timeline, and cart data

- [ ] **Project Estimate Modal Added**
  - [ ] ProjectEstimateModal component imported
  - [ ] Modal state variables added
  - [ ] Modal rendered conditionally
  - [ ] Confetti animation shows on open

- [ ] **Submit Workflow Complete**
  - [ ] Saves service data
  - [ ] Checks multi-service mode
  - [ ] Calculates estimate (single-service)
  - [ ] Calls submitProject()
  - [ ] Blocks back button
  - [ ] Shows estimate modal
  - [ ] Button shows "Submitting..." state

### Dashboard Updates (Once for All Services)

- [ ] **getProjectName Function Updated**
  - [ ] Includes check for new service type
  - [ ] Returns service-friendly name

- [ ] **handleProjectClick Updated**
  - [ ] Routes to correct service path
  - [ ] Uses currentStep from service data
  - [ ] Handles service-specific routing

---

## Code Reference: Complete Final Step Example

Here's a complete example of a properly implemented final step:

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useLocation as useLocationContext } from '../../../context/LocationContext';
import { calculateProjectEstimate } from '../../../utils/pricingCalculator';
import OnboardingLayout from '../../../components/common/OnboardingLayout';
import TimelineSelector from '../../../components/common/TimelineSelector';
import ProjectEstimateModal from '../../../components/common/ProjectEstimateModal';
import useMediaQuery from '../../../hooks/useMediaQuery';

export default function ServiceStep4() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { projectData, updatePhaseData, submitProject } = useProject();
  const { cart, hasItem } = useCart();
  const location = useLocationContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { isMultiService, handleMultiServiceComplete } = useMultiService();
  
  const [formData, setFormData] = useState({
    deliverableFormat: projectData?.serviceName?.deliverableFormat || '',
    timeline: projectData?.serviceName?.timeline || { amount: '', unit: 'weeks' },
    timelineMultiplier: projectData?.serviceName?.timelineMultiplier || 1.0,
    additionalNotes: projectData?.serviceName?.additionalNotes || ''
  });
  
  const [estimate, setEstimate] = useState(null);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndExit = async () => {
    await updatePhaseData('serviceName', {
      ...projectData?.serviceName,
      ...formData,
      currentStep: 4
    });
    navigate('/dashboard');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const serviceData = { ...projectData?.serviceName, ...formData };
      await updatePhaseData('serviceName', serviceData);
      
      if (isMultiService) {
        await handleMultiServiceComplete(serviceData);
      } else {
        const countryCode = location?.country || 'US';
        const timelineMultiplier = formData.timelineMultiplier || 1.0;
        const calculatedEstimate = calculateProjectEstimate(
          projectData,
          countryCode,
          timelineMultiplier,
          cart
        );
        setEstimate(calculatedEstimate);
        
        await submitProject();
        
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function() {
          window.history.pushState(null, '', window.location.href);
        };
        
        setShowEstimateModal(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/serviceName/step3');
  };

  // Validation
  const isTimelineValid = formData.timeline && formData.timeline.amount > 0;
  const isFormatValid = formData.deliverableFormat.trim();
  const isFormValid = isTimelineValid && isFormatValid;

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={4}
      title="Service Name - Final Details"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Form Fields */}
        <div style={{ marginBottom: '32px' }}>
          <label>Deliverable Format *</label>
          <input
            type="text"
            value={formData.deliverableFormat}
            onChange={(e) => handleChange('deliverableFormat', e.target.value)}
            placeholder="e.g., Source code via GitHub"
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label>Delivery Timeline *</label>
          <TimelineSelector
            value={formData.timeline}
            onChange={(timeline, multiplier) => {
              setFormData(prev => ({
                ...prev,
                timeline,
                timelineMultiplier: multiplier
              }));
            }}
          />
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '48px',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <button onClick={handleBack}>Back</button>
          
          <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveAndExit}
            >
              Save & Exit
            </motion.button>

            <motion.button
              whileHover={{ scale: isFormValid && !isSubmitting ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid && !isSubmitting ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Project Estimate Modal */}
      {showEstimateModal && estimate && (
        <ProjectEstimateModal
          estimate={estimate}
          onClose={() => {
            setShowEstimateModal(false);
            navigate('/dashboard');
          }}
        />
      )}
    </OnboardingLayout>
  );
}
```

---

## Service-Specific Details

### Service Data Keys
When using `updatePhaseData()`, use these exact keys:

| Service | Data Key | Route Base |
|---------|----------|------------|
| Frontend Development | `'frontend'` | `/onboarding/frontend/stepX` |
| Backend Development | `'backend'` | `/onboarding/backend/stepX` |
| Landing Page | `'landingPage'` | `/onboarding/landing-page/stepX` |
| UI/UX Design | `'design'` | `/onboarding/design/stepX` |
| Smart Contracts | `'contract'` | `/onboarding/smart-contract/stepX` |
| Bug Fix | `'bugfix'` | `/onboarding/bugfix/stepX` |
| API Integration | `'api'` | `/onboarding/api/stepX` |
| Database Setup | `'database'` | `/onboarding/database/stepX` |
| Deployment Help | `'deployment'` | `/onboarding/deployment/stepX` |
| Code Refactoring | `'refactor'` | `/onboarding/refactor/stepX` |
| Website Upgrade | `'websiteUpgrade'` | `/onboarding/website-upgrade/stepX` |
| Full-Stack App | `phases` object | `/onboarding/phaseX` |

### Number of Steps per Service
- Frontend Development: 4 steps
- Backend Development: 4 steps
- Landing Page: 3 steps
- UI/UX Design: 3 steps
- Smart Contracts: 4 steps
- Bug Fix: 2 steps
- API Integration: 3 steps
- Database Setup: 3 steps
- Deployment Help: 2 steps
- Code Refactoring: 3 steps
- Website Upgrade: 3 steps
- Full-Stack App: 6 phases

---

## Status Update Summary

### ✅ Fully Updated Services
- **Frontend Development** (4/4 steps)
  - Save & Exit: ✅
  - Navigation Layout: ✅
  - Assisted Services: ✅
  - Timeline Selector: ✅
  - Estimate Modal: ✅
  - Submit Workflow: ✅

- **Backend Development** (4/4 steps)
  - Save & Exit: ✅
  - Navigation Layout: ✅
  - Assisted Services: ❓ (needs verification)
  - Timeline Selector: ❓ (needs verification)
  - Estimate Modal: ❓ (needs verification)
  - Submit Workflow: ✅

- **Full-Stack App** (6/6 phases)
  - All features implemented with different code structure

### 🔄 Partially Updated Services
- **Landing Page** (0/3 steps updated)
- **UI/UX Design** (0/3 steps updated)
- **Smart Contracts** (0/4 steps updated)
- **Bug Fix** (0/2 steps updated)
- **API Integration** (0/3 steps updated)
- **Database Setup** (0/3 steps updated)
- **Deployment Help** (0/2 steps updated)
- **Code Refactoring** (0/3 steps updated)
- **Website Upgrade** (0/3 steps updated)

---

## Quick Implementation Steps

When starting a new service:

1. **Read this document thoroughly**
2. **Identify the service** (data key, route, step count)
3. **Go through each step file** (Step1.jsx, Step2.jsx, etc.)
4. **For each step, verify:**
   - Save & Exit function exists
   - Navigation has three buttons in correct layout
   - Assisted services use correct pattern
5. **For the final step, verify:**
   - Timeline selector is present
   - Estimate calculation is implemented
   - Modal shows after submission
   - Submit workflow is complete
6. **Update dashboard** (if not already done)
7. **Test the complete flow:**
   - Fill out forms
   - Click Save & Exit
   - Verify draft appears in dashboard
   - Resume and complete submission
   - Verify modal shows with correct estimate

---

*Last Updated: November 30, 2025*
