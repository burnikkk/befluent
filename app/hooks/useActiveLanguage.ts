'use client';

import { useState } from 'react';

import { createContextHook } from '@/app/hooks/createContextHook';
import { useAvailableLanguages } from '@/app/hooks/useAvailableLanguage';

export const useActiveLanguage = createContextHook(() => {
  const { availableLanguages } = useAvailableLanguages();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('pt-BR');

  const activeLanguage = availableLanguages.find(({ lang }) => selectedLanguage.includes(lang));
  return { activeLanguage, selectedLanguage, setSelectedLanguage };
});
