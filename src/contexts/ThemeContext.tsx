import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeTransition } from '../components/ThemeTransition';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Apply theme immediately before React renders to prevent flash
    const stored = localStorage.getItem('theme') as Theme;
    const initialTheme = stored || 'light';
    
    // Apply theme to document immediately
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return initialTheme;
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    // Change theme first
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    // Trigger animation immediately after theme change
    // Small delay to ensure theme class is applied first
    requestAnimationFrame(() => {
      setIsAnimating(true);
    });
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeTransition isAnimating={isAnimating} onAnimationEnd={handleAnimationEnd} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

