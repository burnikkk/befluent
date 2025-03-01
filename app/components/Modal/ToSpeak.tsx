import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, Text } from '@chakra-ui/react';

import { useSpeak } from '@/app/components/hooks/useSpeak';

import { useActiveLanguage } from '../hooks/useActiveLanguage';

export default function HandleOnRecord() {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const { languageList } = useActiveLanguage();
  const speak = useSpeak();

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onend = () => setIsActive(false);

    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      console.log('Transcript:', transcript);

      const results = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript, language: languageList }),
      }).then((r) => r.json());

      setTranslation(results.text);
      speak(results.text);
    };
  }, [languageList, speak]);

  const handleClick = () => {
    if (isActive) {
      recognitionRef.current?.stop();
    } else {
      speak(' ');
      recognitionRef.current?.start();
    }
  };

  return (
    <Box>
      <Button
        w="full"
        h="full"
        textTransform="uppercase"
        fontWeight="semibold"
        fontSize="sm"
        color={isActive ? 'white' : 'gray.400'}
        bg={isActive ? 'red.500' : 'gray.900'}
        py={3}
        borderRadius="sm"
        onClick={handleClick}
      >
        {isActive ? 'Stop' : 'Record'}
      </Button>
      <Box maxW="lg" mx="auto" mt={12}>
        <Text mb={4}>Spoken Text: {text}</Text>
        <Text>Translation: {translation}</Text>
      </Box>
    </Box>
  );
}
