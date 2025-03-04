'use client';

import { useEffect, useState } from 'react';

export const useVoices = () => {
  const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>([]);

  useEffect(() => {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoices(voices);
      }
    };

    updateVoices();
    setTimeout(updateVoices, 100);
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return voices;
};
