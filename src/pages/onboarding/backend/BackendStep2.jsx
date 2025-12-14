import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';
import ChipGroup from '../../../components/common/ChipGroup';
import logo from '../../../assets/logo.png';

const BackendStep2 = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const { hasItem } = useCart();
  const isMobile = useIsMobile();

  // Check for add-ons
  const addOns = projectData?.addOns || [];
  const hasDatabase = addOns.some(a => a.id === 'database');
  const hasAuthentication = addOns.some(a => a.id === 'authentication');

  const [formData, setFormData] = useState({
    databaseType: projectData?.backend?.databaseType || '',
    databaseName: projectData?.backend?.databaseName || '',
    dataModels: projectData?.backend?.dataModels || [],
    relationships: projectData?.backend?.relationships || '',
    cachingNeeded: projectData?.backend?.cachingNeeded || false,
    cachingType: projectData?.backend?.cachingType || ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAndExit = async () => {
    await updatePhaseData('backend', {
      ...projectData?.backend,
      ...formData,
      currentStep: 2
    });
    navigate('/dashboard');
  };

  const handleContinue = async () => {
    await updatePhaseData('backend', {
      ...projectData?.backend,
      ...formData
    });
    navigate('/onboarding/backend/step3');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Validation
  const isDatabaseValid = formData.databaseType || hasItem('database-design-assist');
  const isFormValid = isDatabaseValid;

  const databaseTypes = [
    { label: 'PostgreSQL', value: 'postgresql' },
    { label: 'MySQL', value: 'mysql' },
    { label: 'MongoDB', value: 'mongodb' },
    { label: 'Firebase/Firestore', value: 'firestore' },
    { label: 'Redis', value: 'redis' },
    { label: 'SQLite', value: 'sqlite' },
    { label: 'DynamoDB', value: 'dynamodb' },
    { label: 'Supabase', value: 'supabase' },
    { label: 'Not sure', value: 'undecided' }
  ];

  const commonModels = [
    'Users',
    'Products',
    'Orders',
    'Payments',
    'Categories',
    'Reviews',
    'Comments',
    'Posts',
    'Messages',
    'Notifications',
    'Sessions',
    'Logs'
  ];

  const cachingOptions = [
    'Redis',
    'Memcached',
    'In-memory',
    'CDN caching'
  ];

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
        padding: isMobile ? '16px 20px' : '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '12px' : '0'
        }}>
          <img 
            src={logo} 
            alt="Creovine" 
            style={{ height: isMobile ? '28px' : '32px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '12px' : '24px',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            flex: 1
          }}>
            {!isMobile && currentUser && (
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {currentUser.email}
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer'
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
        padding: isMobile ? '24px 20px' : '32px 40px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              style={{
                flex: 1,
                height: '8px',
                backgroundColor: step <= 2 ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: isMobile ? '12px' : '14px', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'right' }}>
          Step 2 of 4
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: isMobile ? '0 20px 120px' : '0 40px 120px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ marginBottom: isMobile ? '32px' : '48px' }}>
            <h1 style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '12px'
            }}>
              Data & Database
            </h1>
            <p style={{
              fontSize: isMobile ? '15px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.6'
            }}>
              Tell us about your data storage needs
            </p>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '24px',
            padding: isMobile ? '24px' : '40px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {/* Database Add-on Indicator */}
            {hasDatabase && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                      Database Add-on Selected
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Full database setup will be included in your project
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Database Type */}
            <AssistedToggle
              id="database-design-assist"
              category="Backend"
              label="Need help designing your database?"
              price={40}
              assistedLabel="Design for me"
              tooltipText="We'll analyze your requirements and design an optimal database schema with proper indexing and relationships."
            />

            {!hasItem('database-design-assist') && (
              <div style={{ marginBottom: '32px', marginTop: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  What type of database do you need? *
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {databaseTypes.map(db => (
                    <button
                      key={db.value}
                      onClick={() => handleInputChange('databaseType', db.value)}
                      style={{
                        padding: '12px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: formData.databaseType === db.value ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                        backgroundColor: formData.databaseType === db.value 
                          ? 'rgba(99, 102, 241, 0.2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        border: formData.databaseType === db.value 
                          ? '2px solid #6366F1' 
                          : '2px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {db.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Database Name (if applicable) */}
            {formData.databaseType && formData.databaseType !== 'undecided' && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '12px'
                }}>
                  Database/Collection name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.databaseName}
                  onChange={(e) => handleInputChange('databaseName', e.target.value)}
                  placeholder="e.g., my_app_db"
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    fontSize: '16px',
                    color: '#FFFFFF',
                    backgroundColor: '#15293A',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}

            {/* Data Models */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                What data models/collections do you need? (Optional)
              </label>
              <ChipGroup
                options={commonModels}
                selectedValues={formData.dataModels}
                onChange={(values) => handleInputChange('dataModels', values)}
                multiSelect={true}
              />
            </div>

            {/* Relationships Description */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Describe relationships between models (Optional)
              </label>
              <textarea
                value={formData.relationships}
                onChange={(e) => handleInputChange('relationships', e.target.value)}
                placeholder="e.g., Users have many Orders, Orders belong to Users and contain Products..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  fontSize: '16px',
                  color: '#FFFFFF',
                  backgroundColor: '#15293A',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Caching */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '700',
                color: '#FFFFFF',
                marginBottom: '12px'
              }}>
                Do you need caching?
              </label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                {['Yes', 'No', 'Not sure'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('cachingNeeded', option)}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: formData.cachingNeeded === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      backgroundColor: formData.cachingNeeded === option 
                        ? 'rgba(99, 102, 241, 0.2)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: formData.cachingNeeded === option 
                        ? '2px solid #6366F1' 
                        : '2px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {formData.cachingNeeded === 'Yes' && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px'
                  }}>
                    Caching preference (Optional)
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {cachingOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => handleInputChange('cachingType', option)}
                        style={{
                          padding: '10px 16px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: formData.cachingType === option ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                          backgroundColor: formData.cachingType === option 
                            ? 'rgba(99, 102, 241, 0.2)' 
                            : 'rgba(255, 255, 255, 0.05)',
                          border: formData.cachingType === option 
                            ? '2px solid #6366F1' 
                            : '2px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Authentication Add-on Indicator */}
            {hasAuthentication && (
              <div style={{
                marginBottom: '32px',
                padding: '16px 20px',
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#FFFFFF', marginBottom: '4px' }}>
                      Authentication Add-on Selected
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      User sessions and auth tables will be included in database design
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '48px',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => navigate('/onboarding/backend/step1')}
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

              <div style={{ display: 'flex', gap: '12px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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

                <motion.button
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  onClick={handleContinue}
                  disabled={!isFormValid}
                  style={{
                    padding: isMobile ? '14px 32px' : '16px 48px',
                    fontSize: isMobile ? '15px' : '16px',
                    fontWeight: '700',
                    color: '#FFFFFF',
                    background: isFormValid
                      ? 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                    opacity: isFormValid ? 1 : 0.5
                  }}
              >
                Continue to Step 3
              </motion.button>
            </div>
          </div>
          </div>
        </motion.div>
      </div>

      <CartSummary />
    </div>
  );
};

export default BackendStep2;
