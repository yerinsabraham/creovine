import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/useMediaQuery';
import Chip from './Chip';

/**
 * TimelineSelector Component
 * Interactive timeline picker with units (Hours/Days/Weeks/Months) and slider
 * Calculates price multipliers based on urgency/flexibility
 */
const TimelineSelector = ({ 
  value = { amount: 7, unit: 'days' },
  onChange,
  serviceComplexity = 'medium', // 'simple', 'medium', 'complex'
  showPriceImpact = true,
  style = {}
}) => {
  const isMobile = useIsMobile();
  const [selectedUnit, setSelectedUnit] = useState(value.unit || 'days');
  const [timelineAmount, setTimelineAmount] = useState(value.amount || 7);

  // Dynamic range configuration based on service complexity
  const rangeConfig = {
    simple: {
      hours: { min: 6, max: 48, step: 6, default: 24 },
      days: { min: 1, max: 7, step: 1, default: 3 },
      weeks: { min: 1, max: 4, step: 1, default: 2 },
      months: { min: 1, max: 3, step: 1, default: 1 }
    },
    medium: {
      hours: { min: 24, max: 72, step: 12, default: 48 },
      days: { min: 3, max: 14, step: 1, default: 7 },
      weeks: { min: 1, max: 8, step: 1, default: 4 },
      months: { min: 1, max: 6, step: 1, default: 2 }
    },
    complex: {
      hours: { min: 0, max: 0, step: 0, default: 0 }, // Disabled for complex
      days: { min: 7, max: 30, step: 1, default: 14 },
      weeks: { min: 2, max: 12, step: 1, default: 6 },
      months: { min: 1, max: 12, step: 1, default: 3 }
    }
  };

  const currentRange = rangeConfig[serviceComplexity][selectedUnit];

  // Calculate price multiplier based on timeline
  const calculatePriceMultiplier = (amount, unit) => {
    // Convert everything to days for comparison
    let totalDays;
    switch (unit) {
      case 'hours':
        totalDays = amount / 24;
        break;
      case 'days':
        totalDays = amount;
        break;
      case 'weeks':
        totalDays = amount * 7;
        break;
      case 'months':
        totalDays = amount * 30;
        break;
      default:
        totalDays = amount;
    }

    // Define thresholds based on service complexity
    const thresholds = {
      simple: { rush: 2, fast: 5, standard: 10, flexible: 20 },
      medium: { rush: 5, fast: 10, standard: 21, flexible: 45 },
      complex: { rush: 10, fast: 21, standard: 45, flexible: 90 }
    };

    const t = thresholds[serviceComplexity];

    // Calculate multiplier
    if (totalDays <= t.rush) {
      return { multiplier: 1.5, label: 'RUSH', emoji: '⚡', color: '#FF6B6B', discount: false };
    } else if (totalDays <= t.fast) {
      return { multiplier: 1.2, label: 'FAST', emoji: '🚀', color: '#FFA500', discount: false };
    } else if (totalDays <= t.standard) {
      return { multiplier: 1.0, label: 'STANDARD', emoji: '⏱️', color: '#29BD98', discount: false };
    } else {
      return { multiplier: 0.9, label: 'FLEXIBLE', emoji: '📅', color: '#6B8CFF', discount: true };
    }
  };

  const priceImpact = calculatePriceMultiplier(timelineAmount, selectedUnit);

  // Handle unit change
  const handleUnitChange = (unit) => {
    // Skip if hours disabled for complex projects
    if (serviceComplexity === 'complex' && unit === 'hours') return;
    
    setSelectedUnit(unit);
    const newRange = rangeConfig[serviceComplexity][unit];
    setTimelineAmount(newRange.default);
    
    if (onChange) {
      onChange({
        amount: newRange.default,
        unit,
        priceMultiplier: calculatePriceMultiplier(newRange.default, unit).multiplier
      });
    }
  };

  // Handle slider change
  const handleSliderChange = (e) => {
    const newAmount = parseInt(e.target.value);
    setTimelineAmount(newAmount);
    
    if (onChange) {
      onChange({
        amount: newAmount,
        unit: selectedUnit,
        priceMultiplier: calculatePriceMultiplier(newAmount, selectedUnit).multiplier
      });
    }
  };

  // Format display text
  const getDisplayText = () => {
    if (selectedUnit === 'hours') {
      return `${timelineAmount} ${timelineAmount === 1 ? 'hour' : 'hours'}`;
    }
    return `${timelineAmount} ${selectedUnit === 'days' ? (timelineAmount === 1 ? 'day' : 'days') :
      selectedUnit === 'weeks' ? (timelineAmount === 1 ? 'week' : 'weeks') :
      (timelineAmount === 1 ? 'month' : 'months')}`;
  };

  // Get percentage change text
  const getPriceChangeText = () => {
    if (priceImpact.discount) {
      return `-${Math.round((1 - priceImpact.multiplier) * 100)}% discount`;
    } else if (priceImpact.multiplier > 1) {
      return `+${Math.round((priceImpact.multiplier - 1) * 100)}% rush fee`;
    }
    return 'Standard pricing';
  };

  return (
    <div style={{ 
      width: '100%',
      ...style 
    }}>
      {/* Unit Selection Chips */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '16px',
          fontWeight: '700',
          color: '#FFFFFF',
          marginBottom: '12px'
        }}>
          Select Timeline Unit
        </label>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {['hours', 'days', 'weeks', 'months'].map((unit) => {
            const isDisabled = serviceComplexity === 'complex' && unit === 'hours';
            return (
              <Chip
                key={unit}
                active={selectedUnit === unit && !isDisabled}
                onClick={() => !isDisabled && handleUnitChange(unit)}
                style={{
                  opacity: isDisabled ? 0.3 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {unit}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Slider Section */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        padding: isMobile ? '24px 20px' : '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Timeline Display */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            fontSize: isMobile ? '36px' : '48px',
            fontWeight: '800',
            color: priceImpact.color,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <span>{priceImpact.emoji}</span>
            <span>{getDisplayText()}</span>
          </div>
          
          {showPriceImpact && (
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: priceImpact.color,
              backgroundColor: `${priceImpact.color}15`,
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${priceImpact.color}40`
            }}>
              {priceImpact.label} • {getPriceChangeText()}
            </div>
          )}
        </div>

        {/* Range Slider */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          {/* Track background */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            transform: 'translateY(-50%)',
            zIndex: 0
          }} />
          
          {/* Progress fill */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: `${((timelineAmount - currentRange.min) / (currentRange.max - currentRange.min)) * 100}%`,
            height: '6px',
            backgroundColor: priceImpact.color,
            borderRadius: '3px',
            transform: 'translateY(-50%)',
            zIndex: 1,
            transition: 'all 0.3s ease'
          }} />
          
          {/* Slider input */}
          <input
            type="range"
            min={currentRange.min}
            max={currentRange.max}
            step={currentRange.step}
            value={timelineAmount}
            onChange={handleSliderChange}
            style={{
              position: 'relative',
              width: '100%',
              height: '40px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: 'transparent',
              outline: 'none',
              zIndex: 2,
              cursor: 'pointer'
            }}
          />
          
          {/* Custom thumb styling via CSS */}
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${priceImpact.color};
              cursor: pointer;
              border: 3px solid #15293A;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              transition: all 0.2s ease;
            }
            
            input[type="range"]::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            }
            
            input[type="range"]::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${priceImpact.color};
              cursor: pointer;
              border: 3px solid #15293A;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              transition: all 0.2s ease;
            }
            
            input[type="range"]::-moz-range-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            }
          `}</style>
        </div>

        {/* Min/Max labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginBottom: '24px'
        }}>
          <span>{currentRange.min} {selectedUnit}</span>
          <span>{currentRange.max} {selectedUnit}</span>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '16px',
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}
        >
          <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#FFA500',
              marginBottom: '4px'
            }}>
              Timeline Subject to Review
            </div>
            <div style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.5'
            }}>
              Final delivery timeline will be confirmed after project analysis. We'll work with you to ensure realistic deadlines.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimelineSelector;
