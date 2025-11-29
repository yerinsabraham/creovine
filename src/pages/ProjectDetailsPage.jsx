import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { formatCurrency } from '../utils/pricingCalculator';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId && currentUser) {
      fetchProjectDetails();
    }
  }, [projectId, currentUser]);

  const fetchProjectDetails = async () => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);
      
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        if (data.userId === currentUser.uid) {
          setProject({ id: projectSnap.id, ...data });
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F1C2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#FFFFFF', fontSize: '18px' }}>Loading project details...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0F1C2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#FFFFFF', fontSize: '18px' }}>Project not found</div>
      </div>
    );
  }

  const phases = project.phases || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F1C2E' }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: '#15293A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '16px 20px' : '20px 40px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          
          <button
            onClick={logout}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: '#FFFFFF',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '40px'
      }}>
        
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: '#15293A',
            borderRadius: '24px',
            padding: isMobile ? '32px 24px' : '48px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <h1 style={{
            fontSize: isMobile ? '28px' : '40px',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            {phases.vision?.projectName || phases.identity?.projectName || 'Project Details'}
          </h1>
          
          {phases.identity?.tagline && (
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '24px'
            }}>
              {phases.identity.tagline}
            </p>
          )}
          
          {phases.identity?.description && (
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6'
            }}>
              {phases.identity.description}
            </p>
          )}
        </motion.div>

        {/* Phase 1: Vision */}
        {phases.vision && (
          <DetailSection
            title="Vision & Purpose"
            icon="🎯"
            isMobile={isMobile}
          >
            {phases.vision.appType && (
              <DetailItem label="App Type" value={phases.vision.appType} />
            )}
            {phases.vision.corePurpose && (
              <DetailItem label="Core Purpose" value={phases.vision.corePurpose} />
            )}
            {phases.vision.keyFeatures && phases.vision.keyFeatures.length > 0 && (
              <DetailItem
                label="Key Features"
                value={
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {phases.vision.keyFeatures.map((feature, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(41, 189, 152, 0.1)',
                          border: '1px solid rgba(41, 189, 152, 0.3)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          color: '#29BD98'
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                }
              />
            )}
            {phases.vision.inspiration && (
              <DetailItem label="Inspiration" value={phases.vision.inspiration} />
            )}
          </DetailSection>
        )}

        {/* Phase 2: Target Users */}
        {phases.users && (
          <DetailSection
            title="Target Users"
            icon="👥"
            isMobile={isMobile}
          >
            {phases.users.targetAudience && (
              <DetailItem label="Target Audience" value={phases.users.targetAudience} />
            )}
            {phases.users.userTypes && phases.users.userTypes.length > 0 && (
              <DetailItem
                label="User Types"
                value={
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {phases.users.userTypes.map((type, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: 'rgba(36, 151, 249, 0.1)',
                          border: '1px solid rgba(36, 151, 249, 0.3)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '14px',
                          color: '#2497F9'
                        }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                }
              />
            )}
            {phases.users.userJourney && (
              <DetailItem label="User Journey" value={phases.users.userJourney} />
            )}
          </DetailSection>
        )}

        {/* Phase 3: Features & Functionality */}
        {phases.functionality && (
          <DetailSection
            title="Features & Functionality"
            icon="⚡"
            isMobile={isMobile}
          >
            {phases.functionality.authentication && phases.functionality.authentication.length > 0 && (
              <DetailItem
                label="Authentication Methods"
                value={phases.functionality.authentication.join(', ')}
              />
            )}
            {phases.functionality.coreFeatures && phases.functionality.coreFeatures.length > 0 && (
              <DetailItem
                label="Core Features"
                value={
                  <ul style={{ margin: '8px 0', paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {phases.functionality.coreFeatures.map((feature, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{feature}</li>
                    ))}
                  </ul>
                }
              />
            )}
            {phases.functionality.additionalFeatures && phases.functionality.additionalFeatures.length > 0 && (
              <DetailItem
                label="Additional Features"
                value={
                  <ul style={{ margin: '8px 0', paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {phases.functionality.additionalFeatures.map((feature, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{feature}</li>
                    ))}
                  </ul>
                }
              />
            )}
          </DetailSection>
        )}

        {/* Phase 4: Backend & Data */}
        {phases.backend && (
          <DetailSection
            title="Backend & Data"
            icon="🗄️"
            isMobile={isMobile}
          >
            {phases.backend.databaseNeeds && phases.backend.databaseNeeds.length > 0 && (
              <DetailItem
                label="Database Needs"
                value={phases.backend.databaseNeeds.join(', ')}
              />
            )}
            {phases.backend.integrations && phases.backend.integrations.length > 0 && (
              <DetailItem
                label="Integrations"
                value={phases.backend.integrations.join(', ')}
              />
            )}
            {phases.backend.fileStorage && phases.backend.fileStorage.length > 0 && (
              <DetailItem
                label="File Storage"
                value={phases.backend.fileStorage.join(', ')}
              />
            )}
            {phases.backend.realtimeFeatures && phases.backend.realtimeFeatures.length > 0 && (
              <DetailItem
                label="Real-time Features"
                value={phases.backend.realtimeFeatures.join(', ')}
              />
            )}
          </DetailSection>
        )}

        {/* Phase 5: Identity & Design */}
        {phases.identity && (
          <DetailSection
            title="Brand Identity & Design"
            icon="🎨"
            isMobile={isMobile}
          >
            {phases.identity.projectName && (
              <DetailItem label="Project Name" value={phases.identity.projectName} />
            )}
            {phases.identity.tagline && (
              <DetailItem label="Tagline" value={phases.identity.tagline} />
            )}
            {phases.identity.primaryColor && (
              <DetailItem
                label="Primary Color"
                value={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: phases.identity.primaryColor,
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                    <span>{phases.identity.primaryColor}</span>
                  </div>
                }
              />
            )}
            {phases.identity.secondaryColor && (
              <DetailItem
                label="Secondary Color"
                value={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: phases.identity.secondaryColor,
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}
                    />
                    <span>{phases.identity.secondaryColor}</span>
                  </div>
                }
              />
            )}
            {phases.identity.designStyle && (
              <DetailItem label="Design Style" value={phases.identity.designStyle} />
            )}
            {phases.identity.logoURL && (
              <DetailItem
                label="Logo"
                value={
                  <img
                    src={phases.identity.logoURL}
                    alt="Project Logo"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  />
                }
              />
            )}
          </DetailSection>
        )}

        {/* Phase 6: Deployment */}
        {phases.deployment && (
          <DetailSection
            title="Deployment & Timeline"
            icon="🚀"
            isMobile={isMobile}
          >
            {phases.deployment.deploymentPlatform && (
              <DetailItem label="Deployment Platform" value={phases.deployment.deploymentPlatform} />
            )}
            {phases.deployment.customDomain && (
              <DetailItem label="Custom Domain" value={phases.deployment.customDomain} />
            )}
            {phases.deployment.launchTimeline && (
              <DetailItem
                label="Launch Timeline"
                value={`${phases.deployment.launchTimeline.amount} ${phases.deployment.launchTimeline.unit}`}
              />
            )}
            {phases.deployment.supportNeeds && (
              <DetailItem label="Support Needs" value={phases.deployment.supportNeeds} />
            )}
          </DetailSection>
        )}

        {/* Project Metadata */}
        <DetailSection
          title="Project Information"
          icon="📋"
          isMobile={isMobile}
        >
          <DetailItem
            label="Status"
            value={
              <span style={{
                backgroundColor: project.status === 'submitted' ? 'rgba(36, 151, 249, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                border: `1px solid ${project.status === 'submitted' ? 'rgba(36, 151, 249, 0.4)' : 'rgba(255, 165, 0, 0.4)'}`,
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '14px',
                color: project.status === 'submitted' ? '#2497F9' : '#FFA500',
                fontWeight: '600'
              }}
              >
                {project.status === 'submitted' ? 'Submitted' : 'Draft'}
              </span>
            }
          />
          {project.createdAt && (
            <DetailItem
              label="Created"
              value={new Date(project.createdAt?.toDate?.() || project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
          )}
          {project.submittedAt && (
            <DetailItem
              label="Submitted"
              value={new Date(project.submittedAt?.toDate?.() || project.submittedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            />
          )}
        </DetailSection>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '32px',
          flexWrap: 'wrap'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              minWidth: '200px',
              backgroundColor: '#29BD98',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/experts')}
            style={{
              flex: 1,
              minWidth: '200px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            💬 Chat with Expert
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Section Component
const DetailSection = ({ title, icon, children, isMobile }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      backgroundColor: '#15293A',
      borderRadius: '16px',
      padding: isMobile ? '24px 20px' : '32px',
      marginBottom: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}
  >
    <h2 style={{
      fontSize: isMobile ? '20px' : '24px',
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      {title}
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {children}
    </div>
  </motion.div>
);

// Item Component
const DetailItem = ({ label, value }) => (
  <div>
    <div style={{
      fontSize: '13px',
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: '1.6'
    }}>
      {value || 'Not specified'}
    </div>
  </div>
);

export default ProjectDetailsPage;
