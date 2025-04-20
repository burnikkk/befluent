'use client';

import { useActiveLanguage } from '@/app/hooks/useActiveLanguage';
import { useVoices } from '@/app/hooks/useVoices';

export const useAvailableVoices = () => {
  const voices = useVoices();
  const { selectedLanguage } = useActiveLanguage();

  const availableVoices = voices?.filter(
    ({ lang, voiceURI }) =>
      selectedLanguage === lang && !voiceURI.toLowerCase().includes('microsoft'),
  );
  const activeVoice =
    availableVoices?.find(({ name }) => name.includes('Google')) || availableVoices?.[0];

  return { activeVoice };
};
