import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../../context/ProjectContext';
import { useCart } from '../../../context/CartContext';
import ChipGroup from '../../../components/common/ChipGroup';
import AssistedToggle from '../../../components/common/AssistedToggle';
import CartSummary from '../../../components/common/CartSummary';

const ContractStep2 = () => {
  const navigate = useNavigate();
  const { projectData, updateProjectData } = useProject();
  const { addItem, removeItem, items } = useCart();
  
  // Theme color for Smart Contract - purple
  const themeColor = '#8B5CF6';
  
  // Check if token/NFT contract to show relevant fields
  const contractType = projectData?.contract?.contractType || '';
  const isToken = contractType === 'token';
  const isNFT = contractType === 'nft';
  const isDeFi = contractType === 'defi' || contractType === 'staking';
  
  // Form state
  const [tokenName, setTokenName] = useState(projectData?.contract?.tokenName || '');
  const [tokenSymbol, setTokenSymbol] = useState(projectData?.contract?.tokenSymbol || '');
  const [totalSupply, setTotalSupply] = useState(projectData?.contract?.totalSupply || '');
  const [decimals, setDecimals] = useState(projectData?.contract?.decimals || '18');
  const [tokenFeatures, setTokenFeatures] = useState(projectData?.contract?.tokenFeatures || []);
  const [nftFeatures, setNftFeatures] = useState(projectData?.contract?.nftFeatures || []);
  const [defiFeatures, setDefiFeatures] = useState(projectData?.contract?.defiFeatures || []);
  
  // Assisted toggles
  const [tokenomicsAssist, setTokenomicsAssist] = useState(
    items.some(item => item.id === 'tokenomics-assist')
  );

  const tokenFeatureOptions = [
    { id: 'mintable', label: 'Mintable' },
    { id: 'burnable', label: 'Burnable' },
    { id: 'pausable', label: 'Pausable' },
    { id: 'capped', label: 'Capped Supply' },
    { id: 'taxable', label: 'Transaction Tax' },
    { id: 'deflationary', label: 'Deflationary' },
    { id: 'reflection', label: 'Reflection Rewards' },
    { id: 'blacklist', label: 'Blacklist Feature' }
  ];

  const nftFeatureOptions = [
    { id: 'mintable', label: 'Public Mint' },
    { id: 'whitelist', label: 'Whitelist/Allowlist' },
    { id: 'reveal', label: 'Delayed Reveal' },
    { id: 'royalties', label: 'Royalties (ERC-2981)' },
    { id: 'soulbound', label: 'Soulbound (Non-transferable)' },
    { id: 'onchain', label: 'On-chain Metadata' },
    { id: 'dynamic', label: 'Dynamic NFTs' },
    { id: 'burnable', label: 'Burnable' }
  ];

  const defiFeatureOptions = [
    { id: 'liquidity', label: 'Liquidity Pool' },
    { id: 'yield', label: 'Yield Farming' },
    { id: 'flash', label: 'Flash Loans' },
    { id: 'oracle', label: 'Price Oracle' },
    { id: 'vesting', label: 'Token Vesting' },
    { id: 'timelock', label: 'Timelock' },
    { id: 'rewards', label: 'Reward Distribution' },
    { id: 'compound', label: 'Auto-compound' }
  ];

  useEffect(() => {
    if (tokenomicsAssist) {
      addItem({
        id: 'tokenomics-assist',
        name: 'Tokenomics Design Assistance',
        description: 'Expert help designing your token economics',
        price: 75,
        category: 'Smart Contract'
      });
    } else {
      removeItem('tokenomics-assist');
    }
  }, [tokenomicsAssist]);

  const handleContinue = () => {
    updateProjectData({
      contract: {
        ...projectData?.contract,
        tokenName,
        tokenSymbol,
        totalSupply,
        decimals,
        tokenFeatures,
        nftFeatures,
        defiFeatures
      }
    });
    navigate('/onboarding/contract/step3');
  };

  // Validation - at least basic info if token
  const isValid = isToken ? (tokenName && tokenSymbol) : true;

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
          onClick={() => navigate('/onboarding/contract/step1')}
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
          Step 2 of 4
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '4px', backgroundColor: '#E5E7EB' }}>
        <motion.div 
          initial={{ width: '25%' }}
          animate={{ width: '50%' }}
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
              {isToken ? 'Token Details' : isNFT ? 'NFT Configuration' : 'Contract Features'}
            </h1>
            <p style={{ color: '#666', marginBottom: '32px' }}>
              {isToken 
                ? 'Define your token parameters and features'
                : isNFT 
                  ? 'Configure your NFT collection settings'
                  : 'Select the features your contract needs'
              }
            </p>

            {/* Token Details - Show if token contract */}
            {isToken && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                      Token Name *
                    </label>
                    <input
                      type="text"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="e.g., My Token"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                      Token Symbol *
                    </label>
                    <input
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., MTK"
                      maxLength={10}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                      Total Supply
                    </label>
                    <input
                      type="text"
                      value={totalSupply}
                      onChange={(e) => setTotalSupply(e.target.value)}
                      placeholder="e.g., 1000000000"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                      Decimals
                    </label>
                    <input
                      type="number"
                      value={decimals}
                      onChange={(e) => setDecimals(e.target.value)}
                      min="0"
                      max="18"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Token Features */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                      Token Features
                    </label>
                    <AssistedToggle
                      enabled={tokenomicsAssist}
                      onToggle={setTokenomicsAssist}
                      price={75}
                      label="Tokenomics help"
                    />
                  </div>
                  <ChipGroup
                    options={tokenFeatureOptions}
                    selected={tokenFeatures}
                    onChange={setTokenFeatures}
                    multiple={true}
                    themeColor={themeColor}
                  />
                </div>
              </>
            )}

            {/* NFT Features - Show if NFT contract */}
            {isNFT && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                      Collection Name
                    </label>
                    <input
                      type="text"
                      value={tokenName}
                      onChange={(e) => setTokenName(e.target.value)}
                      placeholder="e.g., Cool NFT Collection"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                      Symbol
                    </label>
                    <input
                      type="text"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      placeholder="e.g., CNFT"
                      maxLength={10}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '15px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>
                    Max Supply
                  </label>
                  <input
                    type="text"
                    value={totalSupply}
                    onChange={(e) => setTotalSupply(e.target.value)}
                    placeholder="e.g., 10000"
                    style={{
                      maxWidth: '300px',
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                  NFT Features
                </label>
                <ChipGroup
                  options={nftFeatureOptions}
                  selected={nftFeatures}
                  onChange={setNftFeatures}
                  multiple={true}
                  themeColor={themeColor}
                />
              </div>
            )}

            {/* DeFi Features - Show if DeFi contract */}
            {isDeFi && (
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '12px' }}>
                  DeFi Features
                </label>
                <ChipGroup
                  options={defiFeatureOptions}
                  selected={defiFeatures}
                  onChange={setDefiFeatures}
                  multiple={true}
                  themeColor={themeColor}
                />
              </div>
            )}

            {/* General contract - show all feature options */}
            {!isToken && !isNFT && !isDeFi && (
              <div style={{ marginBottom: '32px' }}>
                <p style={{ color: '#666', marginBottom: '24px' }}>
                  Since you selected a custom contract type, we'll discuss specific features in detail during the project kickoff.
                </p>
                
                <div style={{ 
                  padding: '20px',
                  backgroundColor: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <svg width="20" height="20" fill={themeColor} viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span style={{ fontWeight: '500', color: '#111' }}>Custom Contract</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                    We'll create a custom solution tailored to your specific blockchain needs.
                  </p>
                </div>
              </div>
            )}

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

export default ContractStep2;
