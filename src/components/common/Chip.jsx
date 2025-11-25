import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const Chip = ({ 
  icon, 
  label, 
  selected, 
  onClick, 
  disabled = false,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
        flex items-center gap-2 rounded-full font-medium
        transition-all duration-200 cursor-pointer
        ${sizeClasses[size]}
        ${selected 
          ? 'bg-gradient-to-r from-[#14789D] to-[#2BC398] text-white glow-effect' 
          : 'border-2 border-darkGray bg-transparent text-lightGray hover:border-green'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{label}</span>
      {selected && <FaCheck className="ml-1" />}
    </motion.button>
  );
};

export default Chip;
