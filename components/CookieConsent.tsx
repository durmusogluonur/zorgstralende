'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTranslation, Language } from '@/lib/translations';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lang, setLang] = useState<Language>('nl');
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    if (typeof window === 'undefined') return;
    
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(cookieConsent);
        setPreferences(saved);
      } catch (e) {
        // If parsing fails, use defaults
      }
    }

    // Get language from localStorage or default to 'nl'
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang === 'nl' || savedLang === 'en') {
      setLang(savedLang);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(necessaryOnly);
    setShowBanner(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setPreferences(prefs);
    
    // Apply cookie preferences
    applyCookiePreferences(prefs);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Enable/disable analytics based on preference
    if (prefs.analytics) {
      // Enable Google Analytics or other analytics tools here
      // Example: gtag('consent', 'update', { analytics_storage: 'granted' });
    } else {
      // Disable analytics
      // Example: gtag('consent', 'update', { analytics_storage: 'denied' });
    }

    // Enable/disable marketing cookies
    if (prefs.marketing) {
      // Enable marketing cookies
    } else {
      // Disable marketing cookies
    }
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
    setShowBanner(false);
  };

  const getCookieText = () => {
    if (lang === 'nl') {
      return {
        title: 'Cookie-instellingen',
        description: 'Wij gebruiken cookies om uw ervaring te verbeteren en onze website te analyseren. U kunt uw voorkeuren beheren.',
        acceptAll: 'Alles accepteren',
        acceptNecessary: 'Alleen noodzakelijke',
        customize: 'Aanpassen',
        necessary: 'Noodzakelijke cookies',
        necessaryDesc: 'Deze cookies zijn essentieel voor het functioneren van de website.',
        analytics: 'Analytische cookies',
        analyticsDesc: 'Deze cookies helpen ons begrijpen hoe bezoekers de website gebruiken.',
        marketing: 'Marketing cookies',
        marketingDesc: 'Deze cookies worden gebruikt om relevante advertenties te tonen.',
        save: 'Voorkeuren opslaan',
        learnMore: 'Meer informatie',
      };
    } else {
      return {
        title: 'Cookie Settings',
        description: 'We use cookies to improve your experience and analyze our website. You can manage your preferences.',
        acceptAll: 'Accept All',
        acceptNecessary: 'Necessary Only',
        customize: 'Customize',
        necessary: 'Necessary Cookies',
        necessaryDesc: 'These cookies are essential for the website to function.',
        analytics: 'Analytics Cookies',
        analyticsDesc: 'These cookies help us understand how visitors use the website.',
        marketing: 'Marketing Cookies',
        marketingDesc: 'These cookies are used to show relevant advertisements.',
        save: 'Save Preferences',
        learnMore: 'Learn More',
      };
    }
  };

  const cookieText = getCookieText();

  if (!showBanner) return null;

  return (
    <>
      <AnimatePresence>
        {showBanner && !showSettings && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary-200 shadow-2xl"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {cookieText.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 md:mb-0">
                    {cookieText.description}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button
                    onClick={acceptNecessary}
                    className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {cookieText.acceptNecessary}
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-2 border-2 border-primary-400 rounded-lg text-primary-600 font-semibold hover:bg-primary-50 transition-colors"
                  >
                    {cookieText.customize}
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
                  >
                    {cookieText.acceptAll}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {cookieText.title}
                  </h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  {cookieText.description}
                </p>

                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {cookieText.necessary}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {cookieText.necessaryDesc}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <div className="w-12 h-6 bg-primary-600 rounded-full flex items-center justify-end px-1">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {cookieText.analytics}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {cookieText.analyticsDesc}
                        </p>
                      </div>
                      <button
                        onClick={() => updatePreference('analytics', !preferences.analytics)}
                        className={`flex-shrink-0 ml-4 w-12 h-6 rounded-full transition-colors ${
                          preferences.analytics
                            ? 'bg-primary-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {cookieText.marketing}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {cookieText.marketingDesc}
                        </p>
                      </div>
                      <button
                        onClick={() => updatePreference('marketing', !preferences.marketing)}
                        className={`flex-shrink-0 ml-4 w-12 h-6 rounded-full transition-colors ${
                          preferences.marketing
                            ? 'bg-primary-600'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`block w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={saveCustomPreferences}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
                  >
                    {cookieText.save}
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {lang === 'nl' ? 'Annuleren' : 'Cancel'}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-6 text-center">
                  {lang === 'nl'
                    ? 'U kunt uw voorkeuren op elk moment wijzigen in de cookie-instellingen.'
                    : 'You can change your preferences at any time in the cookie settings.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
