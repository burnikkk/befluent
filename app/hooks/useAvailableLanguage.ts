import { createListCollection } from '@chakra-ui/react';

import { useVoices } from '@/app/hooks/useVoices';
import { langToLangObj } from '@/app/utils';

type LangFullValue = { lang: string; label: string; dialect: string };

export const useAvailableLanguages = () => {
  const voices = useVoices();
  const supportedLanguageList = voices.map(({ lang }) => lang) || [];
  const languageSet = Array.from(new Set(supportedLanguageList));
  const byASC = (a: LangFullValue, b: LangFullValue) => a.label.localeCompare(b.label);

  const availableLanguages = languageSet.map(langToLangObj).sort(byASC);

  const languageOptions = createListCollection({
    items: availableLanguages.map((lang) => ({ label: lang.label, value: lang.lang })),
  });

  return { availableLanguages, languageOptions };
};
