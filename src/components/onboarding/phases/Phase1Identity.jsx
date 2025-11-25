import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import ChipGroup from '../../common/ChipGroup';
import FileUploadZone from '../../common/FileUploadZone';
import Button from '../../common/Button';
import { FaWandMagicSparkles, FaPalette } from 'react-icons/fa6';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';

const colorPalettes = [
  { value: 'ocean', label: 'Ocean Blue', colors: ['#0077BE', '#00A8E8', '#00C9FF'] },
  { value: 'sunset', label: 'Sunset', colors: ['#FF6B6B', '#FFA500', '#FFD700'] },
  { value: 'forest', label: 'Forest Green', colors: ['#2E7D32', '#4CAF50', '#8BC34A'] },
  { value: 'purple', label: 'Royal Purple', colors: ['#6A1B9A', '#9C27B0', '#BA68C8'] },
  { value: 'modern', label: 'Modern Gray', colors: ['#212121', '#424242', '#757575'] },
  { value: 'vibrant', label: 'Vibrant', colors: ['#E91E63', '#9C27B0', '#2196F3'] }
];

const Phase1Identity = ({ onContinue }) => {
  const { currentUser } = useAuth();
  const { projectData, updatePhaseData } = useProject();
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPalette, setSelectedPalette] = useState(projectData.identity?.colorPalette || '');
  const [customColors, setCustomColors] = useState(projectData.identity?.customColors || ['#000000', '#FFFFFF', '#FF0000']);
  const [brandName, setBrandName] = useState(projectData.identity?.brandName || '');
  const [tagline, setTagline] = useState(projectData.identity?.tagline || '');

  const handleLogoUpload = async (file) => {
    try {
      setUploading(true);
      setLogoFile(file);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `users/${currentUser.uid}/brand-assets/logo-${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updatePhaseData('identity', { logoUrl: downloadURL });
      setUploading(false);
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  const handlePaletteSelect = async (palette) => {
    setSelectedPalette(palette);
    await updatePhaseData('identity', { colorPalette: palette });
  };

  const handleSave = async () => {
    await updatePhaseData('identity', {
      brandName,
      tagline,
      colorPalette: selectedPalette,
      customColors
    });
  };

  const handleContinue = () => {
    handleSave();
    onContinue();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-3">
          Identity & <span className="gradient-text">Design</span>
        </h1>
        <p className="text-xl text-textSecondary">
          Let's establish your brand identity and visual style
        </p>
      </div>

      {/* Brand Name */}
      <div>
        <label className="block text-lg font-semibold text-white mb-3">
          Brand Name *
        </label>
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          onBlur={handleSave}
          className="w-full px-6 py-4 bg-popup border-2 border-darkGray rounded-xl text-white text-lg focus:border-green outline-none transition-colors"
          placeholder="Enter your brand name"
          required
        />
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-lg font-semibold text-white mb-3">
          Tagline (Optional)
        </label>
        <input
          type="text"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          onBlur={handleSave}
          className="w-full px-6 py-4 bg-popup border-2 border-darkGray rounded-xl text-white text-lg focus:border-green outline-none transition-colors"
          placeholder="A catchy tagline for your brand"
        />
      </div>

      {/* Logo Upload */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-lg font-semibold text-white">
            Logo
          </label>
          <Button
            variant="outline"
            size="sm"
            icon={<FaWandMagicSparkles />}
          >
            Generate for Me
          </Button>
        </div>
        <FileUploadZone
          onUpload={handleLogoUpload}
          accept="image/*"
          label="Upload Your Logo"
          preview={true}
        />
        {uploading && (
          <p className="text-sm text-green mt-2">Uploading...</p>
        )}
      </div>

      {/* Color Palette */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-lg font-semibold text-white">
            Color Palette
          </label>
          <button className="flex items-center gap-2 text-sm text-green hover:text-white transition-colors">
            <FaPalette />
            Custom Colors
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {colorPalettes.map((palette) => (
            <motion.button
              key={palette.value}
              onClick={() => handlePaletteSelect(palette.value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${selectedPalette === palette.value
                  ? 'border-green bg-popup'
                  : 'border-darkGray bg-popup hover:border-green'
                }
              `}
            >
              <div className="flex gap-2 mb-3">
                {palette.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-12 rounded-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-white">{palette.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-8 border-t border-darkGray">
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={!brandName}
        >
          Continue to Frontend
        </Button>
      </div>
    </div>
  );
};

export default Phase1Identity;
