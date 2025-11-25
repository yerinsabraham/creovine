import { useState } from 'react';
import { motion } from 'framer-motion';

// Floating Code Snippet Component
const FloatingCode = () => {
  const codeSnippets = [
    'const app = () => {}',
    'import React from "react"',
    'firebase.auth()',
    'async function build()',
    '<Component />',
    'export default App',
    'npm run build',
    'git push origin',
    'useEffect(() => {})',
    'return <div />',
    'const [state, setState]',
    'await fetch(api)',
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      opacity: 0.1
    }}>
      {codeSnippets.map((snippet, index) => (
        <motion.div
          key={index}
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: -50,
            opacity: 0
          }}
          animate={{ 
            y: window.innerHeight + 50,
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            fontSize: '14px',
            fontFamily: 'monospace',
            color: '#29BD98',
            whiteSpace: 'nowrap'
          }}
        >
          {snippet}
        </motion.div>
      ))}
    </div>
  );
};

// Terminal Demo Component
export const TerminalDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    '$ creovine build --app your-saas',
    '✓ Analyzing requirements...',
    '✓ Generating React components...',
    '✓ Setting up Firebase backend...',
    '✓ Configuring authentication...',
    '✓ Building payment integration...',
    '✓ Deploying to production...',
    '✅ App ready in 3 days, 14 hours'
  ];

  useState(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#0D1117',
      borderRadius: '12px',
      padding: '24px',
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#58A6FF',
      maxWidth: '100%',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
    }}>
      {steps.slice(0, currentStep + 1).map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            marginBottom: '8px',
            color: step.includes('✓') || step.includes('✅') ? '#3FB950' : '#58A6FF'
          }}
        >
          {step}
        </motion.div>
      ))}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        style={{ color: '#58A6FF' }}
      >
        _
      </motion.span>
    </div>
  );
};

// Comparison Table Component
export const ComparisonTable = ({ title, subtitle, items }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      width: '100%',
      maxWidth: '500px'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '8px',
        textAlign: 'center',
        color: '#FFFFFF'
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        {subtitle}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '12px',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '8px'
            }}
          >
            <div style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'right'
            }}>
              {item.left}
            </div>
            <div style={{
              fontSize: '16px',
              color: '#29BD98',
              fontWeight: '700'
            }}>
              vs
            </div>
            <div style={{
              fontSize: '13px',
              color: '#29BD98',
              textAlign: 'left',
              fontWeight: '600'
            }}>
              {item.right}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Feature Card Component
export const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
      <h4 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: '8px'
      }}>
        {title}
      </h4>
      <p style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: '1.6'
      }}>
        {description}
      </p>
    </motion.div>
  );
};

// Pricing Card Component
export const PricingCard = ({ tier, price, duration, features, popular, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      style={{
        backgroundColor: popular ? 'rgba(41, 189, 152, 0.1)' : 'rgba(255, 255, 255, 0.03)',
        borderRadius: '20px',
        padding: '32px',
        border: popular ? '2px solid #29BD98' : '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        maxWidth: '350px',
        width: '100%'
      }}
    >
      {popular && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#29BD98',
          color: '#FFFFFF',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Most Popular
        </div>
      )}
      
      <h3 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: '8px'
      }}>
        {tier}
      </h3>
      
      <div style={{ marginBottom: '24px' }}>
        <span style={{
          fontSize: '48px',
          fontWeight: '800',
          color: '#FFFFFF'
        }}>
          ${price.toLocaleString()}
        </span>
        <span style={{
          fontSize: '16px',
          color: 'rgba(255, 255, 255, 0.6)',
          marginLeft: '8px'
        }}>
          one-time
        </span>
      </div>
      
      <div style={{
        fontSize: '14px',
        color: '#29BD98',
        fontWeight: '600',
        marginBottom: '24px'
      }}>
        Delivered in {duration}
      </div>
      
      <ul style={{
        listStyle: 'none',
        padding: 0,
        marginBottom: '32px'
      }}>
        {features.map((feature, index) => (
          <li key={index} style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <span style={{ color: '#29BD98', flexShrink: 0 }}>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSelect}
        style={{
          width: '100%',
          padding: '16px',
          background: popular 
            ? 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)'
            : 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: '12px',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
};

// FAQ Item Component
export const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      marginBottom: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '20px 24px',
          background: 'none',
          border: 'none',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontSize: '20px' }}
        >
          ▼
        </motion.span>
      </button>
      
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{
          padding: '0 24px 20px 24px',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: '1.6',
          margin: 0
        }}>
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

// Testimonial Card Component
export const TestimonialCard = ({ quote, name, role, rating }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        maxWidth: '400px'
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        {[...Array(rating)].map((_, i) => (
          <span key={i} style={{ color: '#FFD700', fontSize: '20px' }}>★</span>
        ))}
      </div>
      
      <p style={{
        fontSize: '16px',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: '1.6',
        marginBottom: '20px',
        fontStyle: 'italic'
      }}>
        "{quote}"
      </p>
      
      <div>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: '4px'
        }}>
          {name}
        </div>
        <div style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          {role}
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingCode;
export { FloatingCode };
