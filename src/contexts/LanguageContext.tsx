import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('language') as Language;
    const initialLanguage = stored || 'en';
    
    // Apply language to document immediately
    document.documentElement.setAttribute('lang', initialLanguage);
    // Both English and Bangla are LTR languages
    document.documentElement.setAttribute('dir', 'ltr');
    
    return initialLanguage;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    // Both English and Bangla are LTR languages
    document.documentElement.setAttribute('dir', 'ltr');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
