import { motion } from 'framer-motion';

const ProgressBar = ({ currentPhase, totalPhases = 6 }) => {
  const progress = (currentPhase / totalPhases) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-textSecondary">
          Phase {currentPhase} of {totalPhases}
        </span>
        <span className="text-sm font-semibold text-green">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full h-3 bg-darkGray rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-button-gradient rounded-full"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
