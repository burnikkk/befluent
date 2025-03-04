import { Box, Text } from '@chakra-ui/react';

import { useRecorder } from '@/app/hooks/useRecorder';

export const SpeakResult = () => {
  const { text, translation } = useRecorder();

  return (
    <Box maxW="lg" mx="auto" mt={12}>
      <Text mb={4}>Spoken Text: {text}</Text>
      <Text>Translation: {translation}</Text>
    </Box>
  );
};
