'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import Webcam from 'react-webcam';

type RecordedChunks = Blob[];

interface VideoRecorderContextProps {
  capturing: boolean;
  saving: boolean;
  videoUrl: string | null;
  startCapture: () => void;
  stopCapture: () => void;
  retakeVideo: () => void;
  webcamRef: React.RefObject<Webcam>;
}

const VideoRecorderContext = createContext<VideoRecorderContextProps | undefined>(undefined);

export const VideoRecorderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<RecordedChunks>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);


  const startCapture = useCallback(() => {

    setCapturing(true);
    setRecordedChunks([]);
    if (webcamRef.current?.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: 'video/webm',
      });

      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject; // Получение MediaStream
        if (stream instanceof MediaStream) { // Убедитесь, что это MediaStream
          mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'video/webm', 
          });
        } else {
          console.error('Stream is not a valid MediaStream:', stream);
        }
      }
      mediaRecorderRef.current.addEventListener('dataavailable', (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      });

      mediaRecorderRef.current.start();
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      setSaving(true);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setRecordedChunks([]);
      setSaving(false);
    }
  }, [recordedChunks]);

  const retakeVideo = useCallback(() => {
    setVideoUrl(null);
  }, []);

  useEffect(() => {
    if (recordedChunks.length) {
      handleSave();
    }
  }, [recordedChunks, handleSave]);

  return (
    <VideoRecorderContext.Provider
      value={{ capturing, saving, videoUrl, startCapture, stopCapture, retakeVideo, webcamRef }}
    >
      {children}
    </VideoRecorderContext.Provider>
  );
};

export const useVideoRecorder = () => {
  const context = useContext(VideoRecorderContext);
  if (!context) {
    throw new Error('useVideoRecorder must be used within a VideoRecorderProvider');
  }
  return context;
};

// export { VideoRecorderProvider, useVideoRecorder };
