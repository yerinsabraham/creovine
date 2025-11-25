import { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import ChipGroup from '../../common/ChipGroup';
import Button from '../../common/Button';
import confetti from 'canvas-confetti';
import { FaShieldAlt, FaBug, FaBroom, FaCalendar, FaRocket } from 'react-icons/fa';

const additionalServices = [
  { 
    value: 'audit', 
    label: 'Smart Contract Audit', 
    icon: <FaShieldAlt />,
    price: '+$999',
    description: 'Security audit for blockchain smart contracts'
  },
  { 
    value: 'bugfix', 
    label: 'Bug Fixing Support', 
    icon: <FaBug />,
    price: '+$299/mo',
    description: '30 days of priority bug fixes'
  },
  { 
    value: 'cleanup', 
    label: 'Code Cleanup', 
    icon: <FaBroom />,
    price: '+$499',
    description: 'Code optimization and refactoring'
  }
];

const Phase6Additional = ({ onContinue }) => {
  const { projectData, updatePhaseData, submitProject } = useProject();
  const [selectedServices, setSelectedServices] = useState(projectData.additional?.services || []);
  const [bookingCall, setBookingCall] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    await updatePhaseData('additional', {
      services: selectedServices
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await handleSave();
    
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    setTimeout(async () => {
      await submitProject();
      onContinue();
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-3">
          Additional <span className="gradient-text">Support</span>
        </h1>
        <p className="text-xl text-textSecondary">
          Optional services to enhance your project
        </p>
      </div>

      {/* Additional Services */}
      <div>
        <label className="block text-lg font-semibold text-white mb-4">
          Optional Add-ons
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalServices.map((service) => {
            const isSelected = selectedServices.includes(service.value);
            return (
              <button
                key={service.value}
                onClick={() => {
                  const newServices = isSelected
                    ? selectedServices.filter(s => s !== service.value)
                    : [...selectedServices, service.value];
                  setSelectedServices(newServices);
                  updatePhaseData('additional', { services: newServices });
                }}
                className={`
                  p-6 rounded-xl text-left transition-all
                  ${isSelected
                    ? 'bg-popup border-2 border-green'
                    : 'bg-popup border-2 border-transparent hover:border-darkGray'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`text-4xl ${isSelected ? 'text-green' : 'text-textSecondary'}`}>
                    {service.icon}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-green rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <h4 className="font-semibold text-white mb-2 text-lg">{service.label}</h4>
                <p className="text-sm text-textSecondary mb-3">{service.description}</p>
                <p className="text-green font-semibold">{service.price}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meeting Booking */}
      <div className="p-8 bg-gradient-to-r from-popup to-darkBg rounded-2xl border-2 border-green">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-green bg-opacity-20 rounded-xl">
            <FaCalendar className="text-4xl text-green" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Book a Consultation Call
            </h3>
            <p className="text-textSecondary mb-6">
              Want to discuss your project in detail? Book a free 30-minute consultation with our team
            </p>
            <Button
              onClick={() => setBookingCall(true)}
              icon={<FaCalendar />}
              variant="primary"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 bg-darkBg rounded-xl border-2 border-darkGray">
        <h4 className="font-semibold text-white mb-4">Project Summary</h4>
        <div className="space-y-3 text-textSecondary">
          <div className="flex justify-between">
            <span>App Type:</span>
            <span className="text-white font-medium">
              {projectData.frontend?.appTypes?.join(', ') || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Backend:</span>
            <span className="text-white font-medium">
              {projectData.backend?.backend || 'Not specified'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Features Selected:</span>
            <span className="text-white font-medium">
              {projectData.features?.selected?.length || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Additional Services:</span>
            <span className="text-white font-medium">
              {selectedServices.length}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-between pt-8 border-t border-darkGray">
        <Button onClick={() => {}} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          size="lg"
          icon={<FaRocket />}
          loading={submitting}
          className="bg-rate-gradient"
        >
          {submitting ? 'Submitting...' : 'Submit Project'}
        </Button>
      </div>
    </div>
  );
};

export default Phase6Additional;
