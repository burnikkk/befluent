import { FC, useEffect, useRef, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';

import { useActiveLanguage } from '@/app/hooks/useActiveLanguage';
import { useSpeak } from '@/app/hooks/useSpeak';

type SpeakResultProps = {
  setIsActive: (isActive: boolean) => void;
};

export const SpeakResult: FC<SpeakResultProps> = ({ setIsActive }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const { languageList } = useActiveLanguage();
  const speak = useSpeak();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    console.log('recognition', recognition);

    recognition.continuous = false;
    recognition.lang = 'en-US';

    const handleEnd = () => setIsActive(false);
    const handleResult = async (event: SpeechRecognitionEvent) => {
      console.log('handleResult', event);

      const transcript = event.results[0][0].transcript;
      setText(transcript);
      console.log('Transcript:', transcript);

      const response = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ text: transcript, language: languageList }),
      });
      const results = await response.json();

      setTranslation(results.text);
      speak(results.text);
    };

    recognition.onend = handleEnd;
    recognition.onresult = handleResult;

    return () => {
      recognition.onend = null;
      recognition.onresult = null;
    };
  }, [languageList, speak]);

  useEffect(() => {}, [isActive]);

  return (
    <Box maxW="lg" mx="auto" mt={12}>
      <Text mb={4}>Spoken Text: {text}</Text>
      <Text>Translation: {translation}</Text>
    </Box>
  );
};
