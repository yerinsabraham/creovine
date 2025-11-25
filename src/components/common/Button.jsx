import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
  icon,
  loading = false
}) => {
  const variants = {
    primary: 'bg-button-gradient text-white hover:glow-effect',
    secondary: 'bg-popup text-white hover:bg-opacity-80 border-2 border-darkGray',
    outline: 'bg-transparent text-lightGray border-2 border-darkGray hover:border-green hover:text-green',
    ghost: 'bg-transparent text-lightGray hover:bg-popup'
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm font-semibold',
    md: 'px-6 py-3 text-base font-semibold',
    lg: 'px-8 py-4 text-lg font-bold'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={`
        flex items-center justify-center gap-2 
        rounded-xl font-semibold transition-all duration-200 shadow-lg
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
