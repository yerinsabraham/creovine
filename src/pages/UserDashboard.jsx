import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import { formatCurrency } from '../utils/pricingCalculator';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import MessagesPanel from '../components/common/MessagesPanel';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { projectData, deleteProject } = useProject();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (currentUser) {
      fetchUserProjects();
      subscribeToMessages();
    }
  }, [currentUser]);

  const subscribeToMessages = () => {
    const q = query(
      collection(db, 'user_messages'),
      where('userId', '==', currentUser.uid),
      where('read', '==', false)
    );
    
    return onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });
  };

  const fetchUserProjects = async () => {
    try {
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const userProjects = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userProjects.push({ id: doc.id, ...data });
      });
      
      // Sort by newest first (submitted or created date)
      userProjects.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.submittedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB - dateA;
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
      case 'payment-pending': return '#FFA500';
      case 'payment-confirmed': return '#29BD98';
      case 'in-progress': return '#29BD98';
      case 'review': return '#9B59B6';
      case 'completed': return '#27AE60';
      case 'on-hold': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'draft': return 'Incomplete';
      case 'submitted': return 'Awaiting Review';
      case 'payment-pending': return 'Payment Pending';
      case 'payment-confirmed': return 'Payment Confirmed';
      case 'in-progress': return 'In Progress';
      case 'review': return 'Under Review';
      case 'completed': return 'Completed';
      case 'on-hold': return 'On Hold';
      default: return 'Unknown';
    }
  };

  const getProjectName = (project) => {
    // Try different possible locations for project name
    return project.phases?.identity?.projectName || 
           project.phases?.vision?.projectName || 
           project.identity?.projectName ||
           project.vision?.projectName ||
           'Untitled Project';
  };

  const getProjectDescription = (project) => {
    return project.phases?.identity?.description ||
           project.phases?.vision?.corePurpose ||
           project.identity?.description ||
           project.vision?.corePurpose ||
           'No description';
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    
    // If draft, navigate to continue where they left off
    if (project.status === 'draft' && project.currentPhase) {
      navigate(`/onboarding/phase${project.currentPhase}`);
    }
  };

  const handleChatWithExpert = () => {
    // Navigate to experts page where user can select expert to chat with
    navigate('/experts', {
      state: {
        projectId: selectedProject?.id
      }
    });
  };

  // Helper to check if project can be deleted
  const canDeleteProject = (status) => {
    if (!status) return false;
    
    // Allow deletion for: draft, submitted, payment-pending
    // Lock for: payment-confirmed, in-progress, review, completed
    const deletableStatuses = ['draft', 'submitted', 'payment-pending'];
    return deletableStatuses.includes(status);
  };

  // Delete project before payment is confirmed
  const handleDeleteSubmittedProject = async () => {
    const confirmed = window.confirm(
      `Delete "${getProjectName(selectedProject)}"?\n\nThis project will be permanently removed. This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      // Create notification for admin
      await addDoc(collection(db, 'adminNotifications'), {
        type: 'project-deleted',
        projectId: selectedProject.id,
        projectName: getProjectName(selectedProject),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || currentUser.email,
        status: selectedProject.status,
        createdAt: serverTimestamp()
      });

      // Delete the project
      await deleteProject(selectedProject.id);
      
      // Refresh projects
      await fetchUserProjects();
      
      alert('Project deleted successfully.');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleDeleteProject = (projectId, projectName) => {
    const project = projects.find(p => p.id === projectId);
    setProjectToDelete({ id: projectId, name: projectName, status: project?.status });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      // Create notification for admin if not a draft
      const project = projects.find(p => p.id === projectToDelete.id);
      if (project && project.status !== 'draft') {
        await addDoc(collection(db, 'adminNotifications'), {
          type: 'project-deleted',
          projectId: projectToDelete.id,
          projectName: projectToDelete.name,
          userId: currentUser.uid,
          userEmail: currentUser.email,
          userName: currentUser.displayName || currentUser.email,
          status: project.status,
          createdAt: serverTimestamp()
        });
      }

      await deleteProject(projectToDelete.id);
      
      // Refresh the projects list
      await fetchUserProjects();
      
      // If deleted project was selected, select another one
      if (selectedProject?.id === projectToDelete.id) {
        setSelectedProject(projects.length > 1 ? projects.find(p => p.id !== projectToDelete.id) : null);
      }
      
      setShowDeleteModal(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
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
    <>
    <MessagesPanel
      userId={currentUser?.uid}
      isOpen={showMessages}
      onClose={() => setShowMessages(false)}
    />
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F1C2E'
    }}>
      
      {/* Header / Navigation */}
      <header style={{
        backgroundColor: '#15293A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: isMobile ? '16px 20px' : '20px 40px',
        position: 'relative'
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
          
          {/* Desktop Menu */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {/* Messages Button with Badge */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMessages(true)}
                style={{
                  position: 'relative',
                  backgroundColor: 'rgba(41, 189, 152, 0.1)',
                  border: '1px solid rgba(41, 189, 152, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: '#29BD98',
                  fontSize: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                📬
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600'
                }}>Messages</span>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#E74C3C',
                    color: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              
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
          )}
          
          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                style={{
                  position: 'relative',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '28px',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                {showMobileMenu ? '✕' : '☰'}
                {unreadCount > 0 && !showMobileMenu && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: '#E74C3C',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    minWidth: '18px',
                    textAlign: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              
              {/* Mobile Dropdown Menu */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: '20px',
                      backgroundColor: '#0F1C2E',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '8px',
                      minWidth: '250px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                      zIndex: 1000,
                      marginTop: '8px'
                    }}
                  >
                    {/* User Info */}
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        marginBottom: '4px'
                      }}>
                        {currentUser?.displayName || 'User'}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }}>
                        {currentUser?.email}
                      </div>
                    </div>
                    
                    {/* Messages */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowMessages(true);
                        setShowMobileMenu(false);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: '#FFFFFF',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '20px' }}>📬</span>
                        <span>Messages</span>
                      </div>
                      {unreadCount > 0 && (
                        <span style={{
                          backgroundColor: '#E74C3C',
                          color: '#FFFFFF',
                          borderRadius: '10px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {unreadCount}
                        </span>
                      )}
                    </motion.button>
                    
                    {/* Logout */}
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        logout();
                        setShowMobileMenu(false);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        border: '1px solid rgba(231, 76, 60, 0.2)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        color: '#E74C3C',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '8px'
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>🚪</span>
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </header>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: isMobile ? '24px 20px' : '40px'
      }}>
        

        
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
                    onClick={() => handleProjectClick(project)}
                    style={{
                      backgroundColor: selectedProject?.id === project.id ? '#15293A' : 'rgba(255, 255, 255, 0.03)',
                      border: selectedProject?.id === project.id ? '2px solid #29BD98' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Delete button for all deletable projects */}
                    {(() => {
                      const canDelete = canDeleteProject(project.status);
                      console.log('Project:', getProjectName(project), 'Status:', project.status, 'Can Delete:', canDelete);
                      return canDelete;
                    })() && (
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id, getProjectName(project));
                        }}
                        title="Delete project"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '32px',
                          height: '32px',
                          background: 'rgba(231, 76, 60, 0.1)',
                          border: '1.5px solid rgba(231, 76, 60, 0.4)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          color: '#E74C3C',
                          cursor: 'pointer',
                          zIndex: 1000,
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#E74C3C';
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.borderColor = '#E74C3C';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)';
                          e.currentTarget.style.color = '#E74C3C';
                          e.currentTarget.style.borderColor = 'rgba(231, 76, 60, 0.4)';
                        }}
                      >
                        🗑️
                      </motion.button>
                    )}
                    
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      marginBottom: '8px',
                      paddingRight: '40px'
                    }}>
                      {getProjectName(project)}
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
                    {project.status === 'draft' && (
                      <div style={{
                        fontSize: '11px',
                        padding: '4px 10px',
                        backgroundColor: 'rgba(255, 165, 0, 0.2)',
                        border: '1px solid rgba(255, 165, 0, 0.4)',
                        borderRadius: '6px',
                        color: '#FFA500',
                        display: 'inline-block',
                        marginBottom: '8px'
                      }}>
                        Click to continue
                      </div>
                    )}
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      {(() => {
                        try {
                          const date = project.createdAt?.toDate?.() || new Date(project.createdAt);
                          return isNaN(date.getTime()) ? 'Recently created' : date.toLocaleDateString();
                        } catch {
                          return 'Recently created';
                        }
                      })()}
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
                
                {/* Project Policy Info Banner */}
                {(selectedProject.status === 'submitted' || selectedProject.status === 'payment-pending') && (
                  <div style={{
                    backgroundColor: 'rgba(41, 189, 152, 0.1)',
                    border: '1px solid rgba(41, 189, 152, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>ℹ️</span>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        lineHeight: '1.6'
                      }}>
                        {selectedProject.status === 'submitted' ? (
                          <><strong>Under review.</strong> Our team will send you a payment link soon. You can delete this project now if needed. Once payment is confirmed, the project will be locked.</>
                        ) : (
                          <><strong>Payment link sent.</strong> You can still delete this project before making payment. Once payment is confirmed by our team, the project will be locked and cannot be cancelled.</>
                        )}
                      </p>
                    </div>
                  </div>
                )}
                
                {(selectedProject.status === 'payment-confirmed' || selectedProject.status === 'in-progress' || selectedProject.status === 'review') && (
                  <div style={{
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    border: '1px solid rgba(231, 76, 60, 0.3)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>🔒</span>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        lineHeight: '1.6'
                      }}>
                        <strong>Project is locked.</strong> Payment has been received and work is in progress. 
                        This project cannot be cancelled or refunded. For urgent concerns, please chat with our team.
                      </p>
                    </div>
                  </div>
                )}
                
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
                        {getProjectName(selectedProject)}
                      </h2>
                      <p style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        {getProjectDescription(selectedProject)}
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
                  gridTemplateColumns: isMobile ? '1fr' : selectedProject.status === 'draft' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  {selectedProject.status === 'draft' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/onboarding/phase${selectedProject.currentPhase || 1}`)}
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
                      ▶️ Continue Project
                    </motion.button>
                  ) : (
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
                  )}
                  
                  {/* Delete button for projects before payment confirmation */}
                  {canDeleteProject(selectedProject.status) && selectedProject.status !== 'draft' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDeleteSubmittedProject}
                      style={{
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        color: '#E74C3C',
                        border: '1px solid rgba(231, 76, 60, 0.3)',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️ Delete Project
                    </motion.button>
                  )}
                  
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
                  
                  {/* Project Type */}
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
                      Project Type
                    </h3>
                    
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(41, 189, 152, 0.1)',
                      border: '1px solid rgba(41, 189, 152, 0.3)',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '16px',
                      color: '#29BD98',
                      fontWeight: '600'
                    }}>
                      {selectedProject.phases?.vision ? 'Full-Stack Application' : 'Custom Project'}
                    </div>
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

    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {showDeleteModal && projectToDelete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={cancelDelete}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1A2332',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%'
            }}
          >
            {/* Warning Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(231, 76, 60, 0.1)',
              border: '2px solid rgba(231, 76, 60, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>
              ⚠️
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: '12px'
            }}>
              Delete Project?
            </h2>

            {/* Project Name */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '8px'
              }}>
                Project Name
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}>
                {projectToDelete.name}
              </div>
            </div>

            {/* Warning Message */}
            <p style={{
              fontSize: '15px',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              This action cannot be undone. All project data will be permanently deleted.
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={cancelDelete}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmDelete}
                style={{
                  flex: 1,
                  backgroundColor: '#E74C3C',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Yes, Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

export default UserDashboard;
