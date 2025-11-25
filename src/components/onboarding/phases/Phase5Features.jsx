import { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import ChipGroup from '../../common/ChipGroup';
import Button from '../../common/Button';
import { FaComments, FaShoppingCart, FaChartBar, FaBell, FaSearch, FaCamera, FaMapMarkedAlt, FaHeart, FaMicrophone } from 'react-icons/fa';

const featureCategories = {
  communication: [
    { value: 'chat', label: 'Real-time Chat', icon: <FaComments />, buildTime: '3-4 days' },
    { value: 'video', label: 'Video Calls', icon: <FaCamera />, buildTime: '5-7 days' },
    { value: 'notifications', label: 'Push Notifications', icon: <FaBell />, buildTime: '2-3 days' }
  ],
  commerce: [
    { value: 'payment', label: 'Payment Gateway', icon: <FaShoppingCart />, buildTime: '3-5 days' },
    { value: 'cart', label: 'Shopping Cart', icon: <FaShoppingCart />, buildTime: '2-3 days' },
    { value: 'wishlist', label: 'Wishlist', icon: <FaHeart />, buildTime: '1-2 days' }
  ],
  analytics: [
    { value: 'dashboard', label: 'Analytics Dashboard', icon: <FaChartBar />, buildTime: '4-6 days' },
    { value: 'reports', label: 'Reports', icon: <FaChartBar />, buildTime: '3-4 days' }
  ],
  features: [
    { value: 'search', label: 'Advanced Search', icon: <FaSearch />, buildTime: '2-3 days' },
    { value: 'maps', label: 'Maps Integration', icon: <FaMapMarkedAlt />, buildTime: '2-3 days' },
    { value: 'voice', label: 'Voice Commands', icon: <FaMicrophone />, buildTime: '4-5 days' }
  ]
};

const Phase5Features = ({ onContinue }) => {
  const { projectData, updatePhaseData } = useProject();
  const [selectedFeatures, setSelectedFeatures] = useState(projectData.features?.selected || []);
  const [customFeatures, setCustomFeatures] = useState(projectData.features?.custom || '');
  const [isRecording, setIsRecording] = useState(false);

  const allFeatures = Object.values(featureCategories).flat();

  const calculateTotalTime = () => {
    const selected = allFeatures.filter(f => selectedFeatures.includes(f.value));
    const days = selected.reduce((sum, feature) => {
      const [min, max] = feature.buildTime.split('-').map(s => parseInt(s));
      return sum + (min + max) / 2;
    }, 0);
    return Math.round(days);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Implement Web Speech API here
    if (!isRecording) {
      console.log('Starting voice recording...');
    } else {
      console.log('Stopping voice recording...');
    }
  };

  const handleSave = async () => {
    await updatePhaseData('features', {
      selected: selectedFeatures,
      custom: customFeatures
    });
  };

  const handleContinue = () => {
    handleSave();
    onContinue();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-3">
          App <span className="gradient-text">Features</span>
        </h1>
        <p className="text-xl text-textSecondary">
          Select pre-built features or describe custom ones
        </p>
      </div>

      {/* Estimated Time */}
      {selectedFeatures.length > 0 && (
        <div className="p-6 bg-popup rounded-xl border-2 border-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textSecondary mb-1">Estimated Build Time</p>
              <p className="text-3xl font-bold gradient-text">{calculateTotalTime()} days</p>
            </div>
            <div>
              <p className="text-sm text-textSecondary mb-1">Features Selected</p>
              <p className="text-3xl font-bold text-white">{selectedFeatures.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Categories */}
      {Object.entries(featureCategories).map(([category, features]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold text-white mb-4 capitalize">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const isSelected = selectedFeatures.includes(feature.value);
              return (
                <button
                  key={feature.value}
                  onClick={() => {
                    const newFeatures = isSelected
                      ? selectedFeatures.filter(f => f !== feature.value)
                      : [...selectedFeatures, feature.value];
                    setSelectedFeatures(newFeatures);
                    updatePhaseData('features', { selected: newFeatures });
                  }}
                  className={`
                    p-4 rounded-xl text-left transition-all
                    ${isSelected
                      ? 'bg-popup border-2 border-green'
                      : 'bg-popup border-2 border-transparent hover:border-darkGray'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`text-3xl ${isSelected ? 'text-green' : 'text-textSecondary'}`}>
                      {feature.icon}
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-green rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-white mb-1">{feature.label}</h4>
                  <p className="text-sm text-textSecondary">{feature.buildTime}</p>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Custom Features */}
      <div>
        <label className="block text-lg font-semibold text-white mb-3">
          Custom Features
        </label>
        <p className="text-textSecondary mb-4">
          Describe any additional features you need that aren't listed above
        </p>
        <div className="relative">
          <textarea
            value={customFeatures}
            onChange={(e) => setCustomFeatures(e.target.value)}
            onBlur={handleSave}
            rows={6}
            className="w-full px-6 py-4 bg-popup border-2 border-darkGray rounded-xl text-white resize-none focus:border-green outline-none transition-colors"
            placeholder="Example: I need a feature that allows users to share their location with friends in real-time, with privacy controls..."
          />
          <button
            onClick={handleVoiceRecord}
            className={`
              absolute bottom-4 right-4 p-3 rounded-full transition-all
              ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-green hover:bg-opacity-80'}
            `}
          >
            <FaMicrophone className="text-white" />
          </button>
        </div>
        {isRecording && (
          <p className="text-sm text-red-500 mt-2 animate-pulse">
            Recording... Click again to stop
          </p>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-between pt-8 border-t border-darkGray">
        <Button onClick={() => {}} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={selectedFeatures.length === 0 && !customFeatures.trim()}
        >
          Continue to Additional Support
        </Button>
      </div>
    </div>
  );
};

export default Phase5Features;
