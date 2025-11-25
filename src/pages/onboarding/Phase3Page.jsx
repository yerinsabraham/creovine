import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import logo from '../../assets/logo.png';

const Phase3Page = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updateProjectData } = useProject();

  const [formData, setFormData] = useState({
    backend: projectData?.backend || '',
    database: projectData?.database || '',
    hosting: projectData?.hosting || '',
    apiType: projectData?.apiType || 'rest'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    await updateProjectData(formData);
    navigate('/onboarding/phase4');
  };

  const handleBack = () => {
    navigate('/onboarding/phase2');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const backends = [
    { id: 'nodejs', name: 'Node.js', icon: '🟢', description: 'JavaScript runtime' },
    { id: 'python', name: 'Python', icon: '🐍', description: 'Django or Flask' },
    { id: 'java', name: 'Java', icon: '☕', description: 'Spring Boot' },
    { id: 'php', name: 'PHP', icon: '🐘', description: 'Laravel or Symfony' },
    { id: 'ruby', name: 'Ruby', icon: '💎', description: 'Ruby on Rails' },
    { id: 'go', name: 'Go', icon: '🔵', description: 'Fast & efficient' }
  ];

  const databases = [
    { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', description: 'Relational database' },
    { id: 'mysql', name: 'MySQL', icon: '🐬', description: 'Popular SQL database' },
    { id: 'mongodb', name: 'MongoDB', icon: '🍃', description: 'NoSQL document store' },
    { id: 'firebase', name: 'Firebase', icon: '🔥', description: 'Google cloud database' },
    { id: 'supabase', name: 'Supabase', icon: '⚡', description: 'Open source Firebase' },
    { id: 'sqlite', name: 'SQLite', icon: '📦', description: 'Lightweight SQL' }
  ];

  const hostingOptions = [
    { id: 'vercel', name: 'Vercel', icon: '▲', description: 'Frontend & serverless' },
    { id: 'netlify', name: 'Netlify', icon: '🌐', description: 'JAMstack hosting' },
    { id: 'aws', name: 'AWS', icon: '☁️', description: 'Amazon cloud services' },
    { id: 'heroku', name: 'Heroku', icon: '🟣', description: 'Easy deployment' },
    { id: 'digitalocean', name: 'DigitalOcean', icon: '🌊', description: 'VPS hosting' },
    { id: 'firebase', name: 'Firebase Hosting', icon: '🔥', description: 'Google hosting' }
  ];

  const isFormValid = formData.backend && formData.database;

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
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: '600'
            }}>
              Phase 3 of 6
            </div>
            
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
                  {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                </div>
              )}
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}>
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
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

      {/* Progress Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 40px 0'
      }}>
        <div style={{
          height: '8px',
          backgroundColor: '#214055',
          borderRadius: '24px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: '33.33%' }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #29BD98 0%, #2497F9 100%)',
              borderRadius: '24px'
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '16px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '600'
        }}>
          <span>3/6 Complete</span>
          <span>~9 minutes remaining</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '64px 40px 120px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title Section */}
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}>
              Backend & Infrastructure
            </h1>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.6)',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Select your backend technology, database, and hosting platform
            </p>
          </div>

          {/* Backend Selection */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Backend Technology *
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {backends.map((backend) => (
                <motion.div
                  key={backend.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect('backend', backend.id)}
                  style={{
                    backgroundColor: formData.backend === backend.id ? '#214055' : '#1A3548',
                    border: formData.backend === backend.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.backend === backend.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{backend.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {backend.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {backend.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Database Selection */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Database *
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {databases.map((db) => (
                <motion.div
                  key={db.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect('database', db.id)}
                  style={{
                    backgroundColor: formData.database === db.id ? '#214055' : '#1A3548',
                    border: formData.database === db.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.database === db.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{db.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {db.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {db.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Hosting Selection */}
          <div style={{ marginBottom: '56px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              Hosting Platform
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {hostingOptions.map((host) => (
                <motion.div
                  key={host.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect('hosting', host.id)}
                  style={{
                    backgroundColor: formData.hosting === host.id ? '#214055' : '#1A3548',
                    border: formData.hosting === host.id ? '3px solid #29BD98' : '3px solid transparent',
                    borderRadius: '20px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.hosting === host.id ? '0 8px 24px rgba(41, 189, 152, 0.2)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>{host.icon}</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    marginBottom: '8px'
                  }}>
                    {host.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.5'
                  }}>
                    {host.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* API Type Selection */}
          <div style={{
            backgroundColor: '#214055',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '56px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#FFFFFF',
              marginBottom: '24px'
            }}>
              API Architecture
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('apiType', 'rest')}
                style={{
                  background: formData.apiType === 'rest' 
                    ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                    : '#15293A',
                  border: formData.apiType === 'rest' ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                REST API
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('apiType', 'graphql')}
                style={{
                  background: formData.apiType === 'graphql' 
                    ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                    : '#15293A',
                  border: formData.apiType === 'graphql' ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '700',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                GraphQL
              </motion.button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '18px 48px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ← Back
            </motion.button>

            <motion.button
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              onClick={handleContinue}
              disabled={!isFormValid}
              style={{
                background: isFormValid 
                  ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: isFormValid ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                padding: '18px 64px',
                fontSize: '18px',
                fontWeight: '700',
                borderRadius: '24px',
                cursor: isFormValid ? 'pointer' : 'not-allowed',
                boxShadow: isFormValid ? '0 8px 24px rgba(41, 189, 152, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Continue to Auth →
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Phase3Page;
