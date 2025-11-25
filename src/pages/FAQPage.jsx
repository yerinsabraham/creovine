import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useIsMobile } from '../hooks/useMediaQuery';
import logo from '../assets/logo.png';
import { FAQItem } from '../components/landing/LandingComponents';
import { useState } from 'react';

const FAQPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#15293A' }}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(21, 41, 58, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1000,
          padding: '20px 0'
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <img 
            src={logo} 
            alt="Creovine" 
            onClick={() => navigate('/')}
            style={{
              height: '32px',
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '140px',
              cursor: 'pointer'
            }}
          />
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                style={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                Admin Dashboard
              </motion.button>
            )}
            
            {currentUser ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/onboarding')}
                  style={{
                    background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(41, 189, 152, 0.3)'
                  }}
                >
                  Dashboard
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                style={{
                  background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                  color: 'white',
                  padding: '12px 32px',
                  borderRadius: '50px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(41, 189, 152, 0.3)'
                }}
              >
                Get Started
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* FAQ Content */}
      <section style={{
        padding: isMobile ? '120px 20px 80px' : '160px 20px 120px',
        minHeight: '100vh'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 style={{
              fontSize: isMobile ? '40px' : '64px',
              fontWeight: '900',
              textAlign: 'center',
              color: '#FFFFFF',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Frequently Asked Questions
            </h1>
            
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '64px',
              maxWidth: '700px',
              margin: '0 auto 64px auto'
            }}>
              Everything you need to know about Creovine and our development process
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <FAQItem
              question="Is this just AI-generated sloppy code?"
              answer="No. We use AI as a force multiplier, but expert developers review, architect, and refine everything. You get production-grade code, not prototypes. Every project is thoroughly tested and follows best practices."
            />
            <FAQItem
              question="Can I actually modify the code later?"
              answer="Absolutely. We deliver clean, documented, modular code with full GitHub access. You can hire any developer to continue building on it. There are no restrictions, no licensing issues, and no vendor lock-in."
            />
            <FAQItem
              question="What if something breaks?"
              answer="Every project includes 2 weeks of bug fixes and support. After that, you can hire us for maintenance or any developer of your choice since you own the code completely."
            />
            <FAQItem
              question="How is this different from no-code?"
              answer="No-code tools are great for quick prototypes, but you hit walls fast. With real code, you can scale infinitely, integrate anything, and never pay monthly platform fees. Plus, you're not stuck when the no-code platform changes their pricing or features."
            />
            <FAQItem
              question="Do you actually build it in 3-5 days?"
              answer="Yes. Simple apps (landing pages, portfolios) in 24-72 hours. Complex apps (marketplaces, SaaS) in 5-7 days. We've proven this dozens of times. The key is our AI-enhanced vibe coding approach combined with expert oversight."
            />
            <FAQItem
              question="What technologies do you use?"
              answer="We use modern, proven tech stacks: React/Next.js for frontend, Node.js/Firebase for backend, and industry-standard databases. Everything is chosen based on your specific needs and optimized for performance and scalability."
            />
            <FAQItem
              question="What's included in the 2 weeks of support?"
              answer="We provide bug fixes, minor adjustments, and technical support for 2 weeks after delivery. This ensures your app runs smoothly and any issues discovered during initial use are resolved quickly."
            />
            <FAQItem
              question="Can you integrate with my existing systems?"
              answer="Yes! We can integrate with most APIs, databases, and third-party services. Just let us know what you need during the questionnaire phase, and we'll ensure seamless integration."
            />
            <FAQItem
              question="Do I really get the GitHub repository?"
              answer="Yes, absolutely. You get a private GitHub repository with full access. All code, documentation, and deployment configurations are yours to keep, modify, and use however you want."
            />
            <FAQItem
              question="What if I need changes after the 2-week support period?"
              answer="You have several options: hire us for additional work, hire any developer since you own the code, or make the changes yourself. There's no lock-in whatsoever."
            />
            <FAQItem
              question="How do payments work?"
              answer="We typically require 50% upfront to begin work and 50% upon delivery. For larger projects, we can discuss custom payment terms. We accept all major payment methods."
            />
            <FAQItem
              question="Can I see examples of your work?"
              answer="Yes! Contact us and we'll share relevant case studies and live examples of projects we've built. We respect our clients' privacy, so some projects may be under NDA."
            />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            style={{
              marginTop: '80px',
              padding: isMobile ? '40px 24px' : '60px 48px',
              background: 'linear-gradient(135deg, rgba(41, 189, 152, 0.1) 0%, rgba(36, 151, 249, 0.1) 100%)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <h3 style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: '800',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              Still have questions?
            </h3>
            <p style={{
              fontSize: isMobile ? '16px' : '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '32px'
            }}>
              Get in touch with our team and we'll be happy to help
            </p>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #29BD98 0%, #2497F9 100%)',
                color: 'white',
                padding: isMobile ? '16px 32px' : '20px 48px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                boxShadow: '0 8px 32px rgba(41, 189, 152, 0.4)'
              }}
            >
              Start Your Project
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px'
        }}>
          © 2025 Creovine. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FAQPage;
