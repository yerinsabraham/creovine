import { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import Button from '../../common/Button';
import { FaGithub, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Phase4Accounts = ({ onContinue }) => {
  const { projectData, updatePhaseData } = useProject();
  const [githubConnected, setGithubConnected] = useState(false);
  const [skipGithub, setSkipGithub] = useState(projectData.accounts?.skipGithub || false);
  const [repoName, setRepoName] = useState(projectData.accounts?.repoName || '');

  const handleGithubConnect = () => {
    // In a real implementation, this would trigger GitHub OAuth
    console.log('Connecting to GitHub...');
    setGithubConnected(true);
    updatePhaseData('accounts', { githubConnected: true });
  };

  const handleSave = async () => {
    await updatePhaseData('accounts', {
      githubConnected,
      skipGithub,
      repoName
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
          Accounts & <span className="gradient-text">Access</span>
        </h1>
        <p className="text-xl text-textSecondary">
          Connect your development accounts for seamless deployment
        </p>
      </div>

      {/* GitHub Integration */}
      <div className="p-8 bg-popup rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="p-4 bg-background rounded-xl">
            <FaGithub className="text-5xl text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-white mb-2">
              GitHub Integration
            </h3>
            <p className="text-textSecondary mb-6">
              Connect your GitHub account to automatically create a repository and push your code
            </p>

            {!githubConnected ? (
              <div className="space-y-4">
                <Button
                  onClick={handleGithubConnect}
                  icon={<FaGithub />}
                  size="lg"
                >
                  Connect GitHub Account
                </Button>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="skip-github"
                    checked={skipGithub}
                    onChange={(e) => {
                      setSkipGithub(e.target.checked);
                      updatePhaseData('accounts', { skipGithub: e.target.checked });
                    }}
                    className="w-5 h-5 rounded border-darkGray bg-background checked:bg-green focus:ring-2 focus:ring-green cursor-pointer"
                  />
                  <label htmlFor="skip-github" className="text-lightGray cursor-pointer">
                    Platform handles setup (I'll provide access later)
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green">
                  <FaCheckCircle className="text-2xl" />
                  <span className="font-semibold">GitHub Connected Successfully!</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-lightGray mb-2">
                    Repository Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    onBlur={handleSave}
                    className="w-full px-4 py-3 bg-background border-2 border-darkGray rounded-lg text-white focus:border-green outline-none transition-colors"
                    placeholder="my-awesome-app"
                  />
                  <p className="text-sm text-textSecondary mt-2">
                    Leave blank to auto-generate
                  </p>
                </div>

                <Button
                  onClick={() => setGithubConnected(false)}
                  variant="outline"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="p-6 bg-darkBg rounded-xl border-2 border-darkGray">
        <h4 className="font-semibold text-white mb-3">What happens next?</h4>
        <ul className="space-y-2 text-textSecondary">
          <li className="flex items-start gap-2">
            <span className="text-green mt-1">•</span>
            <span>We'll create a private repository in your GitHub account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green mt-1">•</span>
            <span>Your complete source code will be pushed there</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green mt-1">•</span>
            <span>You'll have full ownership and version control</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green mt-1">•</span>
            <span>CI/CD pipelines can be set up automatically</span>
          </li>
        </ul>
      </div>

      {/* Continue Button */}
      <div className="flex justify-between pt-8 border-t border-darkGray">
        <Button onClick={() => {}} variant="outline">
          Back
        </Button>
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={!githubConnected && !skipGithub}
        >
          Continue to Features
        </Button>
      </div>
    </div>
  );
};

export default Phase4Accounts;
