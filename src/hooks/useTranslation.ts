import { useLanguage } from '../contexts/LanguageContext';
import { translations as enTranslations } from '../translations/en';
import { translations as bnTranslations } from '../translations/bn';

type TranslationKey = {
  [K in keyof typeof enTranslations]: {
    [P in keyof typeof enTranslations[K]]: string;
  };
};

const translationMap = {
  en: enTranslations,
  bn: bnTranslations,
} as const;

export const useTranslation = () => {
  const { language } = useLanguage();

  const translate = (key: string, params?: Record<string, string | number>): string => {
    // Get the current translation map based on the current language
    const currentTranslations = translationMap[language];
    const keys = key.split('.');
    let value: any = currentTranslations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace placeholders like {name} with actual values
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return { t: translate, language };
};
