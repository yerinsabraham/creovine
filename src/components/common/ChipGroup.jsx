import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { useIsMobile } from '../../hooks/useMediaQuery';

const ChipGroup = ({ 
  label, 
  options = [], 
  selected = [], 
  onChange,
  onSelect, // legacy support
  multiple = false,
  multiSelect = false, // legacy support
  themeColor = '#29BD98',
  className = ''
}) => {
  const isMobile = useIsMobile();
  const isMultiple = multiple || multiSelect;
  const handleChange = onChange || onSelect;

  const handleSelect = (value) => {
    if (isMultiple) {
      const currentSelected = Array.isArray(selected) ? selected : [];
      if (currentSelected.includes(value)) {
        handleChange(currentSelected.filter(item => item !== value));
      } else {
        handleChange([...currentSelected, value]);
      }
    } else {
      handleChange(value);
    }
  };

  const isSelected = (value) => {
    if (isMultiple) {
      return Array.isArray(selected) && selected.includes(value);
    }
    return selected === value;
  };

  return (
    <div className={className}>
      {label && (
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '12px'
        }}>
          {label}
        </h3>
      )}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: isMobile ? '8px' : '12px'
      }}>
        {options.map((option, index) => {
          // Handle both string arrays and object arrays
          const value = typeof option === 'string' ? option : (option.id || option.value);
          const label = typeof option === 'string' ? option : option.label;
          const chipSelected = isSelected(value);
          
          return (
            <motion.button
              key={value || index}
              onClick={() => handleSelect(value)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '10px 16px' : '12px 20px',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '500',
                color: chipSelected ? '#FFFFFF' : '#333',
                backgroundColor: chipSelected ? themeColor : '#F3F4F6',
                border: chipSelected ? `2px solid ${themeColor}` : '2px solid transparent',
                borderRadius: '50px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {chipSelected && <FaCheck style={{ fontSize: '12px' }} />}
              {label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ChipGroup;

