import { useAvailableVoices } from '@/app/hooks/useAvailableVoices';

export const useSpeak = () => {
  const { activeVoice } = useAvailableVoices();

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (activeVoice) {
      utterance.voice = activeVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  return speak;
};
