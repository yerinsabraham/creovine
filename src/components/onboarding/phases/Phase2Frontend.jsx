import { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import ChipGroup from '../../common/ChipGroup';
import Button from '../../common/Button';
import { FaMobile, FaDesktop, FaShoppingCart, FaUsers, FaGamepad, FaBitcoin } from 'react-icons/fa';

const appTypes = [
  { value: 'mobile', label: 'Mobile App', icon: <FaMobile /> },
  { value: 'web', label: 'Web App', icon: <FaDesktop /> },
  { value: 'ecommerce', label: 'E-Commerce', icon: <FaShoppingCart /> },
  { value: 'social', label: 'Social Platform', icon: <FaUsers /> },
  { value: 'gaming', label: 'Gaming App', icon: <FaGamepad /> },
  { value: 'blockchain', label: 'Blockchain App', icon: <FaBitcoin /> }
];

const stylePreferences = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'bold', label: 'Bold' },
  { value: 'modern', label: 'Modern' },
  { value: 'playful', label: 'Playful' },
  { value: 'professional', label: 'Professional' },
  { value: 'elegant', label: 'Elegant' }
];

const pages = [
  { value: 'home', label: 'Homepage' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'profile', label: 'Profile' },
  { value: 'settings', label: 'Settings' },
  { value: 'search', label: 'Search' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'messages', label: 'Messages' },
  { value: 'shop', label: 'Shop/Store' }
];

const Phase2Frontend = ({ onContinue }) => {
  const { projectData, updatePhaseData } = useProject();
  const [selectedAppTypes, setSelectedAppTypes] = useState(projectData.frontend?.appTypes || []);
  const [selectedStyle, setSelectedStyle] = useState(projectData.frontend?.style || '');
  const [selectedPages, setSelectedPages] = useState(projectData.frontend?.pages || []);
  const [customPage, setCustomPage] = useState('');

  const handleSave = async () => {
    await updatePhaseData('frontend', {
      appTypes: selectedAppTypes,
      style: selectedStyle,
      pages: selectedPages
    });
  };

  const handleContinue = () => {
    handleSave();
    onContinue();
  };

  const handleAddCustomPage = () => {
    if (customPage.trim()) {
      setSelectedPages([...selectedPages, customPage.trim()]);
      setCustomPage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-3">
          Frontend <span className="gradient-text">Experience</span>
        </h1>
        <p className="text-xl text-textSecondary">
          Define your app's type, style, and structure
        </p>
      </div>

      {/* App Type */}
      <div>
        <ChipGroup
          label="App Type (Select all that apply)"
          options={appTypes}
          selected={selectedAppTypes}
          onSelect={(types) => {
            setSelectedAppTypes(types);
            updatePhaseData('frontend', { appTypes: types });
          }}
          multiSelect={true}
        />
      </div>

      {/* Style Preference */}
      <div>
        <ChipGroup
          label="Style Preference"
          options={stylePreferences}
          selected={selectedStyle}
          onSelect={(style) => {
            setSelectedStyle(style);
            updatePhaseData('frontend', { style });
          }}
          multiSelect={false}
        />
      </div>

      {/* Page Structure */}
      <div>
        <label className="block text-lg font-semibold text-white mb-3">
          Page Structure (Select pages to include)
        </label>
        <ChipGroup
          options={pages}
          selected={selectedPages}
          onSelect={(pages) => {
            setSelectedPages(pages);
            updatePhaseData('frontend', { pages });
          }}
          multiSelect={true}
        />
        
        {/* Add Custom Page */}
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={customPage}
            onChange={(e) => setCustomPage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomPage()}
            className="flex-1 px-4 py-3 bg-popup border-2 border-darkGray rounded-lg text-white focus:border-green outline-none transition-colors"
            placeholder="Add custom page name..."
          />
          <Button onClick={handleAddCustomPage} variant="outline">
            Add Page
          </Button>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-between pt-8 border-t border-darkGray">
        <Button onClick={() => updatePhaseData('frontend', {})} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={selectedAppTypes.length === 0 || !selectedStyle}
        >
          Continue to Backend
        </Button>
      </div>
    </div>
  );
};

export default Phase2Frontend;
