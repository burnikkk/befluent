import { useState } from 'react';

import { useAvailableLanguages } from '@/app/components/hooks/useAvailableLanguage';

export const useActiveLanguage = () => {
  const { availableLanguages } = useAvailableLanguages();
  const [languageList, setLanguageList] = useState<string[]>(['pt-BR']);

  const activeLanguage = availableLanguages.find(({ lang }) => languageList.includes(lang));
  return { activeLanguage, languageList, setLanguageList };
};
