import { useTranslation } from 'react-i18next';

const AppWithTranslationCheck = ({ children }) => {
  const { ready } = useTranslation(); // Use 'ready' instead of 'i18n.isInitialized'

  if (!ready) {
    // Display a loader while translations are loading
    return <div>Loading translations...</div>;
  }

  return children; // Render the app once translations are ready
};

export default AppWithTranslationCheck;
