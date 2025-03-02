import React, { useRef } from 'react';

import { Box, Button } from '@chakra-ui/react';

import { useSpeak } from '@/app/hooks/useSpeak';
import { useRecorder } from '@/app/providers/Recorder_svoi';

export const HandleOnRecord = ({
  isActive,
  setIsActive,
}: {
  isActive: boolean;
  setIsActive: (state: boolean) => void;
}) => {
  const recognitionRef = useRef<SpeechRecognition>(null);
  const speak = useSpeak();
  const { start, stop } = useRecorder();

  const handleClick = () => {
    if (isActive) {
      recognitionRef.current?.stop();
      stop();
      setIsActive(false);
    } else {
      speak(' ');
      recognitionRef.current?.start();
      start();
      setIsActive(true);
    }
  };
  console.log('toSpeak:', isActive);
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
    </Box>
  );
};
