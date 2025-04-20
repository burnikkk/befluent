'use client';

import React from 'react';

import { Box, Button } from '@chakra-ui/react';

import { useRecorder } from '@/app/hooks/useRecorder';

export const RecordButton = () => {
  const { isActive, start, stop } = useRecorder();

  const handleClick = () => {
    if (isActive) {
      stop();
    } else {
      start();
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
    </Box>
  );
};
