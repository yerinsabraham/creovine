import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const ContractStep1 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  
  // Theme color for Smart Contract - purple
  const themeColor = '#8B5CF6';
  
  // Form state
  const [blockchain, setBlockchain] = useState(projectData?.contract?.blockchain || '');
  const [contractType, setContractType] = useState(projectData?.contract?.contractType || '');
  const [standard, setStandard] = useState(projectData?.contract?.standard || '');
  const [existingCode, setExistingCode] = useState(projectData?.contract?.existingCode || '');
  
  // Assisted toggles
  const [blockchainAssist, setBlockchainAssist] = useState(
    items.some(item => item.id === 'blockchain-assist')
  );

  const blockchainOptions = [
    { id: 'ethereum', label: 'Ethereum' },
    { id: 'polygon', label: 'Polygon' },
    { id: 'bsc', label: 'BNB Smart Chain' },
    { id: 'solana', label: 'Solana' },
    { id: 'avalanche', label: 'Avalanche' },
    { id: 'arbitrum', label: 'Arbitrum' },
    { id: 'base', label: 'Base' },
    { id: 'other', label: 'Other' }
  ];

  const contractTypeOptions = [
    { id: 'token', label: 'Token (ERC20/SPL)' },
    { id: 'nft', label: 'NFT (ERC721/ERC1155)' },
    { id: 'defi', label: 'DeFi Protocol' },
    { id: 'dao', label: 'DAO/Governance' },
    { id: 'staking', label: 'Staking Contract' },
    { id: 'marketplace', label: 'NFT Marketplace' },
    { id: 'multisig', label: 'Multi-Sig Wallet' },
    { id: 'custom', label: 'Custom Contract' }
  ];

  const standardOptions = [
    { id: 'erc20', label: 'ERC-20' },
    { id: 'erc721', label: 'ERC-721' },
    { id: 'erc1155', label: 'ERC-1155' },
    { id: 'erc4626', label: 'ERC-4626 (Vault)' },
    { id: 'spl', label: 'SPL Token' },
    { id: 'custom', label: 'Custom Standard' },
    { id: 'none', label: 'Not Sure' }
  ];

  const existingCodeOptions = [
    { id: 'none', label: 'Starting Fresh' },
    { id: 'partial', label: 'Have Some Code' },
    { id: 'complete', label: 'Full Contract to Audit' },
    { id: 'fork', label: 'Forking Existing Project' }
  ];

  useEffect(() => {
    if (blockchainAssist) {
      addItem({
        id: 'blockchain-assist',
        name: 'Blockchain Selection Assistance',
        description: 'Expert help choosing the right blockchain for your use case',
        price: 35,
        category: 'Smart Contract'
      });
    } else {
      removeItem('blockchain-assist');
    }
  }, [blockchainAssist]);

  const handleContinue = () => {
    updateProjectData({
      contract: {
        ...projectData?.contract,
        blockchain,
        contractType,
        standard,
        existingCode
      }
    });
    navigate('/onboarding/contract/step2');
  };

  const isValid = blockchain && contractType;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #eee',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={() => navigate('/get-started')}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666'
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Step 1 of 4
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '25%' }}
          style={{ height: '100%', backgroundColor: themeColor }}
        />
      </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: '40px', maxWidth: '900px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px', color: '#111' }}>
              Blockchain & Contract Type
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              Let's start with the foundation - which blockchain and what type of contract do you need?
            </p>

            {/* Blockchain Selection */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                  Which blockchain?
                </label>
                <AssistedToggle
                  enabled={blockchainAssist}
                  onToggle={setBlockchainAssist}
                  price={35}
                  label="Help me choose"
                />
              </div>
              <ChipGroup
                options={blockchainOptions}
                selected={blockchain}
                onChange={setBlockchain}
                themeColor={themeColor}
              />
            </div>

            {/* Contract Type */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                What type of contract?
              </label>
              <ChipGroup
                options={contractTypeOptions}
                selected={contractType}
                onChange={setContractType}
                themeColor={themeColor}
              />
            </div>

            {/* Token Standard */}
            {(contractType === 'token' || contractType === 'nft') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginBottom: '32px' }}
              >
                <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                  Which token standard?
                </label>
                <ChipGroup
                  options={standardOptions}
                  selected={standard}
                  onChange={setStandard}
                  themeColor={themeColor}
                />
              </motion.div>
            )}

            {/* Existing Code */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                Do you have existing code?
              </label>
              <ChipGroup
                options={existingCodeOptions}
                selected={existingCode}
                onChange={setExistingCode}
                themeColor={themeColor}
              />
            </div>

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: isValid ? 1.02 : 1 }}
              whileTap={{ scale: isValid ? 0.98 : 1 }}
              onClick={handleContinue}
              disabled={!isValid}
              style={{
                width: '100%',
                padding: '16px 32px',
                backgroundColor: isValid ? themeColor : '#E5E7EB',
                color: isValid ? 'white' : '#9CA3AF',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isValid ? 'pointer' : 'not-allowed',
                marginTop: '24px'
              }}
            >
              Continue
            </motion.button>
          </motion.div>
        </div>

        {/* Cart Summary Sidebar */}
        <CartSummary />
      </div>
    </div>
  );
};

export default ContractStep1;
