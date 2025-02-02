'use client';

import React, { useEffect, useState } from 'react';

import { Box, Button, Stack } from '@chakra-ui/react';

import { useVideoRecorder } from '@/app/providers/Recorder';
import Webcam from 'react-webcam';

export const VideoRecorder: React.FC = () => {
  const { capturing, saving, videoUrl, startCapture, stopCapture, retakeVideo, webcamRef } =
    useVideoRecorder();
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => setHovering(false);

  useEffect(() => {
    if (hovering) {
      setShowControls(true);
    } else {
      const timeoutId = setTimeout(() => setShowControls(false), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [hovering]);

  return (
    <Box>
      <Box
        height={405}
        position="relative"
        width="100%"
        maxW="720px"
        mx="auto"
        mb={4}
        borderRadius="md"
        overflow="hidden"
        boxShadow="lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!videoUrl ? (
          <Webcam
            muted
            audio
            ref={webcamRef}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: 'user',
            }}
            style={{ width: '100%', borderRadius: 'md' }}
          />
        ) : (
          <video src={videoUrl} controls style={{ width: '100%' }} />
        )}

        <Stack
          direction="row"
          spacing={4}
          position="absolute"
          bottom={8}
          left="50%"
          transform="translateX(-50%)"
          zIndex={1}
          bg="rgba(0, 0, 0, 0.6)"
          padding={3}
          borderRadius="md"
          opacity={showControls ? 1 : 0}
          transition="opacity 0.3s ease"
        >
          {!capturing && !videoUrl && (
            <Button colorScheme="teal" onClick={startCapture}>
              Start Recording
            </Button>
          )}
          {(capturing || saving) && (
            <Button colorScheme="red" onClick={stopCapture} isLoading={saving}>
              Stop Recording
            </Button>
          )}
          {videoUrl && (
            <Button colorScheme="yellow" onClick={retakeVideo}>
              Retake Video
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
