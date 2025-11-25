import { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import ChipGroup from '../../common/ChipGroup';
import Button from '../../common/Button';
import { FaFire, FaNodeJs, FaPython, FaDatabase, FaKey, FaFingerprint, FaShieldAlt } from 'react-icons/fa';
import { SiPostgresql, SiMongodb, SiMysql } from 'react-icons/si';

const backendOptions = [
  { value: 'firebase', label: 'Firebase', icon: <FaFire /> },
  { value: 'nodejs', label: 'Node.js', icon: <FaNodeJs /> },
  { value: 'python', label: 'Python', icon: <FaPython /> },
  { value: 'auto', label: 'Choose for Me', icon: <FaShieldAlt /> }
];

const databaseOptions = [
  { value: 'firestore', label: 'Firestore', icon: <FaDatabase /> },
  { value: 'postgresql', label: 'PostgreSQL', icon: <SiPostgresql /> },
  { value: 'mongodb', label: 'MongoDB', icon: <SiMongodb /> },
  { value: 'mysql', label: 'MySQL', icon: <SiMysql /> }
];

const authOptions = [
  { value: 'email', label: 'Email/Password' },
  { value: 'social', label: 'Social Sign-In' },
  { value: 'biometric', label: 'Biometrics' },
  { value: '2fa', label: 'Two-Factor Auth' },
  { value: 'oauth', label: 'OAuth' }
];

const Phase3Backend = ({ onContinue }) => {
  const { projectData, updatePhaseData } = useProject();
  const [selectedBackend, setSelectedBackend] = useState(projectData.backend?.backend || '');
  const [selectedDatabase, setSelectedDatabase] = useState(projectData.backend?.database || '');
  const [selectedAuth, setSelectedAuth] = useState(projectData.backend?.authentication || []);
  const [smartContract, setSmartContract] = useState(projectData.backend?.smartContract || false);

  // Check if blockchain was selected in Phase 2
  const isBlockchain = projectData.frontend?.appTypes?.includes('blockchain');

  const handleSave = async () => {
    await updatePhaseData('backend', {
      backend: selectedBackend,
      database: selectedDatabase,
      authentication: selectedAuth,
      smartContract
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
          Backend & <span className="gradient-text">Logic</span>
        </h1>
        <p className="text-xl text-textSecondary">
          Choose your backend architecture and data management
        </p>
      </div>

      {/* Backend Architecture */}
      <div>
        <ChipGroup
          label="Backend Architecture"
          options={backendOptions}
          selected={selectedBackend}
          onSelect={(backend) => {
            setSelectedBackend(backend);
            updatePhaseData('backend', { backend });
          }}
          multiSelect={false}
        />
      </div>

      {/* Database */}
      <div>
        <ChipGroup
          label="Database"
          options={databaseOptions}
          selected={selectedDatabase}
          onSelect={(database) => {
            setSelectedDatabase(database);
            updatePhaseData('backend', { database });
          }}
          multiSelect={false}
        />
      </div>

      {/* Authentication */}
      <div>
        <label className="block text-lg font-semibold text-white mb-3">
          Authentication Methods (Select all that apply)
        </label>
        <ChipGroup
          options={authOptions}
          selected={selectedAuth}
          onSelect={(auth) => {
            setSelectedAuth(auth);
            updatePhaseData('backend', { authentication: auth });
          }}
          multiSelect={true}
        />
        {selectedAuth.length > 0 && (
          <div className="mt-4 p-4 bg-popup rounded-lg">
            <p className="text-sm text-textSecondary">
              Estimated complexity:{' '}
              <span className="text-green font-semibold">
                {selectedAuth.length <= 2 ? 'Easy' : selectedAuth.length <= 4 ? 'Medium' : 'Hard'}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Smart Contracts (conditional) */}
      {isBlockchain && (
        <div className="p-6 bg-popup rounded-xl border-2 border-blue">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                Smart Contract Integration
              </h3>
              <p className="text-sm text-textSecondary">
                Include blockchain smart contract functionality
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smartContract}
                onChange={(e) => {
                  setSmartContract(e.target.checked);
                  updatePhaseData('backend', { smartContract: e.target.checked });
                }}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-darkGray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green"></div>
            </label>
          </div>
          {smartContract && (
            <p className="text-sm text-blue">
              ✓ Smart contract development and testing included
            </p>
          )}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-between pt-8 border-t border-darkGray">
        <Button onClick={() => {}} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={!selectedBackend || !selectedDatabase || selectedAuth.length === 0}
        >
          Continue to Accounts
        </Button>
      </div>
    </div>
  );
};

export default Phase3Backend;
