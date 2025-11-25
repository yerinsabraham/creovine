import { motion } from 'framer-motion';
import { FaPalette, FaDesktop, FaCog, FaKey, FaStar, FaRocket } from 'react-icons/fa';

const phases = [
  { id: 1, name: 'Identity & Design', icon: FaPalette, emoji: '🎨' },
  { id: 2, name: 'Frontend Experience', icon: FaDesktop, emoji: '💻' },
  { id: 3, name: 'Backend & Logic', icon: FaCog, emoji: '⚙️' },
  { id: 4, name: 'Accounts & Access', icon: FaKey, emoji: '🔐' },
  { id: 5, name: 'App Features', icon: FaStar, emoji: '✨' },
  { id: 6, name: 'Additional Support', icon: FaRocket, emoji: '🚀' }
];

const PhaseNavigator = ({ currentPhase, onPhaseClick, completedPhases = [] }) => {
  return (
    <div className="space-y-2">
      {phases.map((phase) => {
        const isActive = currentPhase === phase.id;
        const isCompleted = completedPhases.includes(phase.id);
        const Icon = phase.icon;

        return (
          <motion.button
            key={phase.id}
            onClick={() => onPhaseClick(phase.id)}
            whileHover={{ x: 5 }}
            className={`
              w-full flex items-center gap-4 p-4 rounded-xl
              transition-all duration-200 text-left
              ${isActive 
                ? 'bg-popup border-2 border-green' 
                : isCompleted
                ? 'bg-popup border-2 border-transparent hover:border-darkGray'
                : 'bg-transparent border-2 border-transparent hover:bg-popup'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              text-2xl flex-shrink-0
              ${isActive ? 'text-green' : isCompleted ? 'text-blue' : 'text-textSecondary'}
            `}>
              {phase.emoji}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={`
                font-medium truncate
                ${isActive ? 'text-green' : isCompleted ? 'text-white' : 'text-textSecondary'}
              `}>
                {phase.name}
              </div>
              {isCompleted && !isActive && (
                <div className="text-xs text-blue">Completed ✓</div>
              )}
              {isActive && (
                <div className="text-xs text-green">In Progress</div>
              )}
            </div>

            {/* Status Indicator */}
            <div className={`
              w-3 h-3 rounded-full flex-shrink-0
              ${isActive ? 'bg-green animate-pulse' : isCompleted ? 'bg-blue' : 'bg-darkGray'}
            `} />
          </motion.button>
        );
      })}
    </div>
  );
};

export default PhaseNavigator;
