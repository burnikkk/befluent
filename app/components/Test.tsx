'use client';

import React from 'react';

import { Button, HStack } from '@chakra-ui/react';

import { useVideoRecorder } from '@/app/providers/Recorder';

export const Test: React.FC = () => {
  const { startCapture, stopCapture, retakeVideo, videoUrl, capturing } = useVideoRecorder();

  return (
    <HStack spacing={4}>
      <Button textColor={'cyan.600'} onClick={startCapture} isDisabled={capturing || !!videoUrl}>
        Start from Parent
      </Button>

      <Button bgColor={'lightgray'} color={'orange.500'} onClick={stopCapture} isDisabled={!capturing}>
        Stop from Parent
      </Button>

      <Button onClick={retakeVideo} isDisabled={!videoUrl}>
        Retake from Parent
      </Button>

      <Button isLoading loadingText={'Saving...'}>Click Me
      </Button>
    </HStack>


  );
};



