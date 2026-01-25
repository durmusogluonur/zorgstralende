'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CookieSettingsButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Only show button if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (cookieConsent) {
      setShowButton(true);
    }
  }, []);

  const openSettings = () => {
    // Trigger cookie consent banner to show settings
    localStorage.removeItem('cookie-consent');
    window.location.reload();
  };

  if (!showButton) return null;

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={openSettings}
      className="fixed bottom-4 left-4 z-40 bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
      title="Cookie-instellingen"
    >
      🍪
    </motion.button>
  );
}
