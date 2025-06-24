
import { useState, useEffect, useCallback } from 'react';

export const useExitIntent = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger if mouse leaves from the top of the page
    if (e.clientY <= 0 && !hasShown) {
      setShowExitIntent(true);
      setHasShown(true);
      // Store in localStorage to prevent showing again for 24 hours
      localStorage.setItem('exitIntentShown', Date.now().toString());
    }
  }, [hasShown]);

  useEffect(() => {
    // Check if popup was shown in the last 24 hours
    const lastShown = localStorage.getItem('exitIntentShown');
    if (lastShown) {
      const timeDiff = Date.now() - parseInt(lastShown);
      const hoursAgo = timeDiff / (1000 * 60 * 60);
      if (hoursAgo < 24) {
        setHasShown(true);
        return;
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const closeExitIntent = () => {
    setShowExitIntent(false);
  };

  return { showExitIntent, closeExitIntent };
};
