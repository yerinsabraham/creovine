import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { formatCurrency } from '../utils/pricingCalculator';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { projectData } = useProject();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (currentUser) {
      fetchUserProjects();
    }
  }, [currentUser]);

  const fetchUserProjects = async () => {
    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const userProjects = [];
      querySnapshot.forEach((doc) => {
        userProjects.push({ id: doc.id, ...doc.data() });
      });
      setProjects(userProjects);
      if (userProjects.length > 0 && !selectedProject) {
        setSelectedProject(userProjects[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (project) => {
    // Get from project data or default to 0
    return project.progressPercentage || 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return '#FFA500';
      case 'submitted': return '#2497F9';
      case 'in-progress': return '#29BD98';
      case 'review': return '#9B59B6';
      case 'completed': return '#27AE60';
      case 'on-hold': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'in-progress': return 'In Progress';
      case 'review': return 'Under Review';
      case 'completed': return 'Completed';
      case 'on-hold': return 'On Hold';
      default: return 'Unknown';
    }
  };

  const handleChatWithExpert = () => {
    if (!selectedProject) return;
    
    // Navigate to expert chat with project context
    const primaryService = selectedProject.phases?.primaryService;
    navigate(`/expert-consultation`, {
      state: {
        projectId: selectedProject.id,
        primaryService
      }
    });
  };

  const handleEditRequest = () => {
    setEditMode(true);
    // In real implementation, this would notify the admin/expert
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
        <div style={{ color: '#FFFFFF', fontSize: '18px' }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F1C2E'
    }}>
      
      {/* Header / Navigation */}
      <header style={{
        backgroundColor: '#15293A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '16px 20px' : '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '700',
            color: '#FFFFFF'
          }}>
            My Dashboard
          </h1>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              {currentUser?.displayName || currentUser?.email}
            </div>
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
        </div>
      </header>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '40px'
      }}>
        
        {/* Start New Project Banner - Always visible at top */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'linear-gradient(135deg, rgba(41, 189, 152, 0.1) 0%, rgba(36, 151, 249, 0.1) 100%)',
              border: '2px solid rgba(41, 189, 152, 0.3)',
              borderRadius: '16px',
              padding: isMobile ? '20px' : '24px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <h3 style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '4px'
              }}>
                🚀 Ready to build something new?
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                Start a new project and we'll build it in days
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/get-started')}
              style={{
                backgroundColor: '#29BD98',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50px',
                padding: isMobile ? '14px 28px' : '16px 32px',
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(41, 189, 152, 0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              + Start New Project
            </motion.button>
          </motion.div>
        )}
        
        {projects.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#15293A',
            borderRadius: '16px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '24px'
            }}>📋</div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              No Projects Yet
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '32px'
            }}>
              Start your first project to see it here
            </p>
            <button
              onClick={() => navigate('/get-started')}
              style={{
                backgroundColor: '#29BD98',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Start New Project
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
            gap: '24px'
          }}>
            
            {/* Projects Sidebar */}
            <div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Your Projects
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedProject(project)}
                    style={{
                      backgroundColor: selectedProject?.id === project.id ? '#15293A' : 'rgba(255, 255, 255, 0.03)',
                      border: selectedProject?.id === project.id ? '2px solid #29BD98' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      marginBottom: '8px'
                    }}>
                      {project.phases?.vision?.projectName || 'Untitled Project'}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(project.status)
                      }} />
                      <span style={{
                        fontSize: '13px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      {new Date(project.createdAt?.toDate?.() || project.createdAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
                
                <button
                  onClick={() => navigate('/get-started')}
                  style={{
                    backgroundColor: 'rgba(41, 189, 152, 0.1)',
                    border: '2px dashed rgba(41, 189, 152, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    color: '#29BD98',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  + New Project
                </button>
              </div>
            </div>

            {/* Main Content */}
            {selectedProject && (
              <div>
                
                {/* Project Header */}
                <div style={{
                  backgroundColor: '#15293A',
                  borderRadius: '16px',
                  padding: isMobile ? '24px 20px' : '32px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{
                        fontSize: isMobile ? '24px' : '32px',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        marginBottom: '8px'
                      }}>
                        {selectedProject.phases?.vision?.projectName || 'Untitled Project'}
                      </h2>
                      <p style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        {selectedProject.phases?.vision?.description || 'No description'}
                      </p>
                    </div>
                    
                    <div style={{
                      backgroundColor: `${getStatusColor(selectedProject.status)}20`,
                      border: `2px solid ${getStatusColor(selectedProject.status)}`,
                      borderRadius: '50px',
                      padding: '8px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: getStatusColor(selectedProject.status)
                    }}>
                      {getStatusLabel(selectedProject.status)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}>
                        Project Progress
                      </span>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#29BD98'
                      }}>
                        {getProgressPercentage(selectedProject)}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '12px',
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '50px',
                      overflow: 'hidden'
                    }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage(selectedProject)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #29BD98 0%, #2497F9 100%)',
                          borderRadius: '50px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChatWithExpert}
                    style={{
                      backgroundColor: '#29BD98',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    💬 Chat with Expert
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEditRequest}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Request Changes
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/project/${selectedProject.id}/details`)}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    📄 View Details
                  </motion.button>
                </div>

                {/* Project Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: '24px'
                }}>
                  
                  {/* Services */}
                  <div style={{
                    backgroundColor: '#15293A',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Services
                    </h3>
                    
                    {selectedProject.phases?.primaryService && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          display: 'inline-block',
                          backgroundColor: 'rgba(41, 189, 152, 0.1)',
                          border: '1px solid rgba(41, 189, 152, 0.3)',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '14px',
                          color: '#29BD98',
                          fontWeight: '600'
                        }}>
                          {selectedProject.phases.primaryService.name}
                        </div>
                      </div>
                    )}
                    
                    {selectedProject.phases?.addOns?.length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginTop: '12px'
                      }}>
                        {selectedProject.phases.addOns.map((addon, idx) => (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '13px',
                              color: 'rgba(255, 255, 255, 0.8)'
                            }}
                          >
                            {addon.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Billing */}
                  <div style={{
                    backgroundColor: '#15293A',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Billing
                    </h3>
                    
                    {selectedProject.phases?.estimate ? (
                      <div>
                        <div style={{
                          fontSize: '32px',
                          fontWeight: '800',
                          color: '#29BD98',
                          marginBottom: '8px'
                        }}>
                          {formatCurrency(selectedProject.phases.estimate.total)}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginBottom: '16px'
                        }}>
                          {selectedProject.phases.estimate.serviceCount} service{selectedProject.phases.estimate.serviceCount > 1 ? 's' : ''}
                          {selectedProject.phases.estimate.discount > 0 && 
                            ` • ${formatCurrency(selectedProject.phases.estimate.discount)} saved`
                          }
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }}>
                          Estimated timeline: {selectedProject.phases.estimate.timeline?.display || 'TBD'}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }}>
                        Quote not yet generated
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div style={{
                    backgroundColor: '#15293A',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Contact Info
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          marginBottom: '4px'
                        }}>
                          Email
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#FFFFFF'
                        }}>
                          {selectedProject.email || currentUser?.email}
                        </div>
                      </div>
                      
                      {selectedProject.phoneNumber && (
                        <div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '4px'
                          }}>
                            Phone
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#FFFFFF'
                          }}>
                            {selectedProject.phoneNumber}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div style={{
                    backgroundColor: '#15293A',
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Timeline
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.5)',
                          marginBottom: '4px'
                        }}>
                          Created
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#FFFFFF'
                        }}>
                          {new Date(selectedProject.createdAt?.toDate?.() || selectedProject.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {selectedProject.submittedAt && (
                        <div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            marginBottom: '4px'
                          }}>
                            Submitted
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#FFFFFF'
                          }}>
                            {new Date(selectedProject.submittedAt?.toDate?.() || selectedProject.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
