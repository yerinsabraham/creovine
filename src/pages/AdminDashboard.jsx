import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import logo from '../assets/logo.png';

// Utility functions for data export
const exportToCSV = (projects) => {
  const headers = [
    'Submitted Date',
    'Project Name',
    'Tagline',
    'Status',
    'User Name',
    'User Email',
    'App Type',
    'Core Purpose',
    'Key Features',
    'Target Audience',
    'User Types',
    'User Journey',
    'Authentication Methods',
    'Core Features',
    'Database Needs',
    'Integrations',
    'Realtime Features',
    'Primary Color',
    'Secondary Color',
    'Design Style',
    'Deployment Platform',
    'Custom Domain',
    'Launch Timeline',
    'Support Needs'
  ];

  const rows = projects.map(project => {
    const phases = project.phases || {};
    const vision = phases.vision || {};
    const users = phases.users || {};
    const functionality = phases.functionality || {};
    const backend = phases.backend || {};
    const identity = phases.identity || {};
    const deployment = phases.deployment || {};

    return [
      project.submittedAt?.toDate?.()?.toLocaleString() || 'N/A',
      identity.projectName || project.projectName || 'Untitled',
      identity.tagline || project.tagline || 'N/A',
      project.status || 'submitted',
      project.userName || 'N/A',
      project.userEmail || 'N/A',
      vision.appType || 'N/A',
      vision.corePurpose || 'N/A',
      Array.isArray(vision.keyFeatures) ? vision.keyFeatures.join('; ') : 'N/A',
      users.targetAudience || 'N/A',
      Array.isArray(users.userTypes) ? users.userTypes.join('; ') : 'N/A',
      users.userJourney || 'N/A',
      Array.isArray(functionality.authentication) ? functionality.authentication.join('; ') : 'N/A',
      Array.isArray(functionality.coreFeatures) ? functionality.coreFeatures.join('; ') : 'N/A',
      Array.isArray(backend.databaseNeeds) ? backend.databaseNeeds.join('; ') : 'N/A',
      Array.isArray(backend.integrations) ? backend.integrations.join('; ') : 'N/A',
      Array.isArray(backend.realtimeFeatures) ? backend.realtimeFeatures.join('; ') : 'N/A',
      identity.primaryColor || 'N/A',
      identity.secondaryColor || 'N/A',
      identity.designStyle || 'N/A',
      deployment.deploymentPlatform || 'N/A',
      deployment.customDomain || 'N/A',
      deployment.launchTimeline || 'N/A',
      deployment.supportNeeds || 'N/A'
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `projects_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProjects();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, filterStatus]);

  const fetchProjects = async () => {
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProjects(projectsList);
      setLoadingProjects(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoadingProjects(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      setProjects(projects.map(p => 
        p.id === projectId ? { ...p, status: newStatus } : p
      ));
      
      if (selectedProject?.id === projectId) {
        setSelectedProject({ ...selectedProject, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const stats = {
    total: projects.length,
    submitted: projects.filter(p => p.status === 'submitted').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length
  };

  if (loading || !isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#15293A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '24px',
          color: '#FFFFFF',
          fontWeight: '700'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(21, 41, 58, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 40px'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <img 
              src={logo} 
              alt="Creovine" 
              style={{
                height: '32px',
                width: 'auto',
                objectFit: 'contain',
                maxWidth: '140px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
            <div style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              color: '#FFFFFF'
            }}>
              👑 ADMIN
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 16px',
              backgroundColor: '#214055',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Profile"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #29BD98'
                  }}
                />
              ) : (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFFFFF'
                }}>
                  {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'A'}
                </div>
              )}
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}>
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#29BD98';
                e.target.style.backgroundColor = 'rgba(41, 189, 152, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '48px 40px'
      }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, #29BD98 0%, #22A67E 100%)',
              borderRadius: '20px',
              padding: '32px',
              color: '#FFFFFF'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📊</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>
              Total Projects
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, #2497F9 0%, #1E7AC7 100%)',
              borderRadius: '20px',
              padding: '32px',
              color: '#FFFFFF'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>📝</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
              {stats.submitted}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>
              Submitted
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              borderRadius: '20px',
              padding: '32px',
              color: '#FFFFFF'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>⚙️</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
              {stats.inProgress}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>
              In Progress
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
              borderRadius: '20px',
              padding: '32px',
              color: '#FFFFFF'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>✅</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>
              {stats.completed}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}>
              Completed
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: '#214055',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Search and View Toggle */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '24px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search by project name, email, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  color: '#FFFFFF',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#29BD98';
                  e.target.style.boxShadow = '0 0 0 3px rgba(41, 189, 152, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', gap: '8px', backgroundColor: '#15293A', borderRadius: '12px', padding: '4px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    background: viewMode === 'grid' ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)' : 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📊 Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    background: viewMode === 'table' ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)' : 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  📋 Table
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={() => exportToCSV(filteredProjects)}
                disabled={filteredProjects.length === 0}
                style={{
                  background: filteredProjects.length > 0 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : '#15293A',
                  border: 'none',
                  color: '#FFFFFF',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '700',
                  borderRadius: '12px',
                  cursor: filteredProjects.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  opacity: filteredProjects.length > 0 ? 1 : 0.5
                }}
                onMouseEnter={(e) => {
                  if (filteredProjects.length > 0) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                📥 Export CSV
              </button>
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {['all', 'submitted', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    background: filterStatus === status 
                      ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                      : '#15293A',
                    border: filterStatus === status ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {status === 'in-progress' ? 'In Progress' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects List */}
        {loadingProjects ? (
          <div style={{
            backgroundColor: '#214055',
            borderRadius: '20px',
            padding: '64px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              ⏳
            </div>
            <div style={{
              fontSize: '20px',
              color: '#FFFFFF',
              fontWeight: '600'
            }}>
              Loading projects...
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{
            backgroundColor: '#214055',
            borderRadius: '20px',
            padding: '64px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              📭
            </div>
            <div style={{
              fontSize: '20px',
              color: '#FFFFFF',
              fontWeight: '600'
            }}>
              No projects found
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* TABLE VIEW */
          <div style={{
            backgroundColor: '#214055',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflowX: 'auto'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              color: '#FFFFFF'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#15293A',
                  borderBottom: '2px solid rgba(41, 189, 152, 0.3)'
                }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>Project Name</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>User</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>Email</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>App Type</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>Core Purpose</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>Target Audience</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>Timeline</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: '700', whiteSpace: 'nowrap' }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontWeight: '700', whiteSpace: 'nowrap' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project, index) => {
                  const phases = project.phases || {};
                  const vision = phases.vision || {};
                  const users = phases.users || {};
                  const identity = phases.identity || {};
                  const deployment = phases.deployment || {};

                  return (
                    <tr
                      key={project.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? 'rgba(21, 41, 58, 0.5)' : 'transparent',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(41, 189, 152, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(21, 41, 58, 0.5)' : 'transparent';
                      }}
                      onClick={() => setSelectedProject(project)}
                    >
                      <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                        {project.submittedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', fontWeight: '600', color: '#29BD98' }}>
                        {identity.projectName || project.projectName || 'Untitled'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {project.userName || 'Unknown'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <a 
                          href={`mailto:${project.userEmail}`}
                          style={{ color: '#2497F9', textDecoration: 'none' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {project.userEmail}
                        </a>
                      </td>
                      <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                        {vision.appType || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {vision.corePurpose || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {users.targetAudience || 'N/A'}
                      </td>
                      <td style={{ padding: '16px', whiteSpace: 'nowrap' }}>
                        {deployment.launchTimeline || 'N/A'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{
                          padding: '6px 12px',
                          background: project.status === 'completed' 
                            ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                            : project.status === 'in-progress'
                            ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                            : 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#FFFFFF',
                          textTransform: 'capitalize',
                          whiteSpace: 'nowrap',
                          display: 'inline-block'
                        }}>
                          {project.status === 'in-progress' ? 'In Progress' : project.status || 'Submitted'}
                        </div>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          style={{
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* GRID VIEW */
          <div style={{
            display: 'grid',
            gap: '20px'
          }}>
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedProject(project)}
                style={{
                  backgroundColor: '#214055',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)';
                  e.currentTarget.style.borderColor = '#29BD98';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: '24px',
                  alignItems: 'center'
                }}>
                  {/* User Avatar */}
                  <div>
                    {project.userPhotoURL ? (
                      <img
                        src={project.userPhotoURL}
                        alt={project.userName}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          border: '3px solid #29BD98'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#FFFFFF'
                      }}>
                        {project.userName?.[0] || project.userEmail?.[0] || '?'}
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      marginBottom: '8px'
                    }}>
                      {project.phases?.identity?.projectName || project.projectName || 'Untitled Project'}
                    </h3>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '12px'
                    }}>
                      <strong>{project.userName || 'Unknown User'}</strong> • {project.userEmail}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      {project.phases?.identity?.tagline || project.tagline || 'No tagline provided'}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    alignItems: 'flex-end'
                  }}>
                    <div style={{
                      padding: '8px 16px',
                      background: project.status === 'completed' 
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                        : project.status === 'in-progress'
                        ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                        : 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#FFFFFF',
                      textTransform: 'capitalize'
                    }}>
                      {project.status === 'in-progress' ? 'In Progress' : project.status || 'Submitted'}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                      {project.submittedAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '40px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#214055',
                borderRadius: '24px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '48px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                ✕
              </button>

              {/* Project Details */}
              <h2 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#FFFFFF',
                marginBottom: '32px'
              }}>
                {selectedProject.phases?.identity?.projectName || selectedProject.projectName || 'Untitled Project'}
              </h2>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* User Info */}
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px'
                  }}>
                    Contact Information
                  </h4>
                  <div style={{
                    backgroundColor: '#15293A',
                    padding: '20px',
                    borderRadius: '16px'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ color: '#FFFFFF' }}>Name:</strong>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '12px' }}>
                        {selectedProject.userName || 'Not provided'}
                      </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <strong style={{ color: '#FFFFFF' }}>Email:</strong>
                      <a 
                        href={`mailto:${selectedProject.userEmail}`}
                        style={{ 
                          color: '#29BD98', 
                          marginLeft: '12px',
                          textDecoration: 'none',
                          fontWeight: '600'
                        }}
                      >
                        {selectedProject.userEmail}
                      </a>
                    </div>
                    <div>
                      <strong style={{ color: '#FFFFFF' }}>Submitted:</strong>
                      <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '12px' }}>
                        {selectedProject.submittedAt?.toDate?.()?.toLocaleString() || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Selection (Multi-Service Support) */}
                {(selectedProject.phases?.primaryService || selectedProject.phases?.serviceCategory) && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Service Selection
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {selectedProject.phases?.primaryService && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Primary Service:</strong>
                          <span style={{ 
                            color: '#29BD98', 
                            marginLeft: '12px',
                            fontWeight: '600',
                            padding: '4px 12px',
                            backgroundColor: 'rgba(41, 189, 152, 0.1)',
                            borderRadius: '8px',
                            display: 'inline-block'
                          }}>
                            {selectedProject.phases.primaryService.name || selectedProject.phases.serviceName}
                          </span>
                        </div>
                      )}
                      {selectedProject.phases?.addOns && selectedProject.phases.addOns.length > 0 && (
                        <div>
                          <strong style={{ color: '#FFFFFF' }}>Additional Services:</strong>
                          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {selectedProject.phases.addOns.map((addon, idx) => (
                              <span 
                                key={idx}
                                style={{ 
                                  color: 'rgba(255, 255, 255, 0.9)', 
                                  padding: '4px 12px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                  borderRadius: '8px',
                                  fontSize: '14px'
                                }}
                              >
                                {addon.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases?.completedServices && selectedProject.phases.completedServices.length > 0 && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <strong style={{ color: '#FFFFFF' }}>Completed Services: {selectedProject.phases.completedServices.length}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Service-Specific Data - Frontend */}
                {selectedProject.phases?.frontend && Object.keys(selectedProject.phases.frontend).length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Frontend Development
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {Object.entries(selectedProject.phases.frontend).map(([key, value]) => {
                        if (!value || key === 'files') return null;
                        return (
                          <div key={key} style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </strong>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service-Specific Data - Backend */}
                {selectedProject.phases?.backend && Object.keys(selectedProject.phases.backend).length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Backend Development
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {Object.entries(selectedProject.phases.backend).map(([key, value]) => {
                        if (!value || key === 'files') return null;
                        return (
                          <div key={key} style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </strong>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service-Specific Data - Landing Page */}
                {selectedProject.phases?.landingPage && Object.keys(selectedProject.phases.landingPage).length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Landing Page
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {Object.entries(selectedProject.phases.landingPage).map(([key, value]) => {
                        if (!value || key === 'files') return null;
                        return (
                          <div key={key} style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </strong>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service-Specific Data - Design */}
                {selectedProject.phases?.design && Object.keys(selectedProject.phases.design).length > 0 && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      UI/UX Design
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {Object.entries(selectedProject.phases.design).map(([key, value]) => {
                        if (!value || key === 'files') return null;
                        return (
                          <div key={key} style={{ marginBottom: '12px' }}>
                            <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </strong>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Service-Specific Data - All Other Services */}
                {['contract', 'bugfix', 'api', 'qrcode', 'database', 'auth', 'payment', 'deployment', 'refactor'].map(serviceKey => {
                  if (!selectedProject.phases?.[serviceKey] || Object.keys(selectedProject.phases[serviceKey]).length === 0) return null;
                  const serviceName = {
                    contract: 'Smart Contract',
                    bugfix: 'Bug Fix',
                    api: 'API Integration',
                    qrcode: 'QR Code System',
                    database: 'Database Setup',
                    auth: 'Authentication',
                    payment: 'Payment Integration',
                    deployment: 'Deployment',
                    refactor: 'Code Refactoring'
                  }[serviceKey];

                  return (
                    <div key={serviceKey}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'rgba(255, 255, 255, 0.5)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '12px'
                      }}>
                        {serviceName}
                      </h4>
                      <div style={{
                        backgroundColor: '#15293A',
                        padding: '20px',
                        borderRadius: '16px'
                      }}>
                        {Object.entries(selectedProject.phases[serviceKey]).map(([key, value]) => {
                          if (!value || key === 'files') return null;
                          return (
                            <div key={key} style={{ marginBottom: '12px' }}>
                              <strong style={{ color: '#FFFFFF', textTransform: 'capitalize' }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </strong>
                              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Phase 1: App Vision */}
                {selectedProject.phases?.vision && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Phase 1: App Vision
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {selectedProject.phases.vision.appType && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>App Type:</strong>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '12px', textTransform: 'capitalize' }}>
                            {selectedProject.phases.vision.appType}
                          </span>
                        </div>
                      )}
                      {selectedProject.phases.vision.corePurpose && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Core Purpose:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', lineHeight: '1.6' }}>
                            {selectedProject.phases.vision.corePurpose}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.vision.keyFeatures && selectedProject.phases.vision.keyFeatures.length > 0 && (
                        <div>
                          <strong style={{ color: '#FFFFFF' }}>Key Features:</strong>
                          <ul style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', paddingLeft: '20px' }}>
                            {selectedProject.phases.vision.keyFeatures.map((feature, idx) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase 2: Target Users */}
                {selectedProject.phases?.users && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Phase 2: Target Users
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {selectedProject.phases.users.targetAudience && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Target Audience:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', lineHeight: '1.6' }}>
                            {selectedProject.phases.users.targetAudience}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.users.userTypes && selectedProject.phases.users.userTypes.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>User Types:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.users.userTypes.join(', ')}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.users.userJourney && (
                        <div>
                          <strong style={{ color: '#FFFFFF' }}>User Journey:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', lineHeight: '1.6' }}>
                            {selectedProject.phases.users.userJourney}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase 3: Features & Functionality */}
                {selectedProject.phases?.functionality && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Phase 3: Features & Functionality
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {selectedProject.phases.functionality.authentication && selectedProject.phases.functionality.authentication.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Authentication:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.functionality.authentication.join(', ')}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.functionality.userAccounts && selectedProject.phases.functionality.userAccounts.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>User Accounts:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.functionality.userAccounts.join(', ')}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.functionality.coreFeatures && selectedProject.phases.functionality.coreFeatures.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Core Features:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.functionality.coreFeatures.join(', ')}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.functionality.additionalFeatures && selectedProject.phases.functionality.additionalFeatures.length > 0 && (
                        <div>
                          <strong style={{ color: '#FFFFFF' }}>Additional Features:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.functionality.additionalFeatures.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase 4: Backend & Data */}
                {selectedProject.phases?.backend && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Phase 4: Backend & Data
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {selectedProject.phases.backend.databaseNeeds && selectedProject.phases.backend.databaseNeeds.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Database Needs:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.backend.databaseNeeds.join(', ')}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.backend.integrations && selectedProject.phases.backend.integrations.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Integrations:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.backend.integrations.join(', ')}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.backend.fileStorage && selectedProject.phases.backend.fileStorage.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>File Storage:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.backend.fileStorage.join(', ')}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.backend.realtimeFeatures && selectedProject.phases.backend.realtimeFeatures.length > 0 && (
                        <div>
                          <strong style={{ color: '#FFFFFF' }}>Realtime Features:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.backend.realtimeFeatures.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase 5: Identity & Design */}
                {selectedProject.phases?.identity && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Phase 5: Identity & Design
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {selectedProject.phases.identity.tagline && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Tagline:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>
                            {selectedProject.phases.identity.tagline}
                          </div>
                        </div>
                      )}
                      {selectedProject.phases.identity.description && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Description:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', lineHeight: '1.6' }}>
                            {selectedProject.phases.identity.description}
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {selectedProject.phases.identity.primaryColor && (
                          <div>
                            <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Primary Color:</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: selectedProject.phases.identity.primaryColor,
                                border: '2px solid rgba(255, 255, 255, 0.2)'
                              }} />
                              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {selectedProject.phases.identity.primaryColor}
                              </span>
                            </div>
                          </div>
                        )}
                        {selectedProject.phases.identity.secondaryColor && (
                          <div>
                            <strong style={{ color: '#FFFFFF', fontSize: '14px' }}>Secondary Color:</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: selectedProject.phases.identity.secondaryColor,
                                border: '2px solid rgba(255, 255, 255, 0.2)'
                              }} />
                              <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {selectedProject.phases.identity.secondaryColor}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      {selectedProject.phases.identity.designStyle && (
                        <div style={{ marginTop: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Design Style:</strong>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '12px', textTransform: 'capitalize' }}>
                            {selectedProject.phases.identity.designStyle}
                          </span>
                        </div>
                      )}
                      {selectedProject.phases.identity.logoURL && (
                        <div style={{ marginTop: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Logo:</strong>
                          <div style={{ marginTop: '8px' }}>
                            <img 
                              src={selectedProject.phases.identity.logoURL} 
                              alt="Logo" 
                              style={{ maxWidth: '200px', maxHeight: '100px', borderRadius: '8px' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phase 6: Deployment & Support */}
                {selectedProject.phases?.deployment && (
                  <div>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'rgba(255, 255, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '12px'
                    }}>
                      Phase 6: Deployment & Support
                    </h4>
                    <div style={{
                      backgroundColor: '#15293A',
                      padding: '20px',
                      borderRadius: '16px'
                    }}>
                      {selectedProject.phases.deployment.deploymentPlatform && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Platform:</strong>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '12px', textTransform: 'capitalize' }}>
                            {selectedProject.phases.deployment.deploymentPlatform}
                          </span>
                        </div>
                      )}
                      {selectedProject.phases.deployment.customDomain && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Custom Domain:</strong>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '12px' }}>
                            {selectedProject.phases.deployment.customDomain}
                          </span>
                        </div>
                      )}
                      {selectedProject.phases.deployment.launchTimeline && (
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ color: '#FFFFFF' }}>Launch Timeline:</strong>
                          <span style={{ color: 'rgba(255, 255, 255, 0.7)', marginLeft: '12px', textTransform: 'capitalize' }}>
                            {selectedProject.phases.deployment.launchTimeline}
                          </span>
                        </div>
                      )}
                      {selectedProject.phases.deployment.supportNeeds && (
                        <div>
                          <strong style={{ color: '#FFFFFF' }}>Support Needs:</strong>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', lineHeight: '1.6' }}>
                            {selectedProject.phases.deployment.supportNeeds}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Status Update Actions */}
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px'
                  }}>
                    Update Status
                  </h4>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => updateProjectStatus(selectedProject.id, 'submitted')}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: selectedProject.status === 'submitted'
                          ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                          : '#15293A',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '700',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Submitted
                    </button>
                    <button
                      onClick={() => updateProjectStatus(selectedProject.id, 'in-progress')}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: selectedProject.status === 'in-progress'
                          ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                          : '#15293A',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '700',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateProjectStatus(selectedProject.id, 'completed')}
                      style={{
                        flex: 1,
                        padding: '16px',
                        background: selectedProject.status === 'completed'
                          ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                          : '#15293A',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: '700',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {/* Calendly Integration */}
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '12px'
                  }}>
                    Schedule Meeting
                  </h4>
                  <a
                    href={`https://calendly.com/your-calendly-link?name=${selectedProject.userName}&email=${selectedProject.userEmail}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                      borderRadius: '16px',
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>📅</span>
                    Schedule Meeting with {selectedProject.userName}
                  </a>
                  <div style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textAlign: 'center'
                  }}>
                    Opens Calendly to book a meeting
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
