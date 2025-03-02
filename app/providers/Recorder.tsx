'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { useActiveLanguage } from '@/app/hooks/useActiveLanguage';
import { useSpeak } from '@/app/hooks/useSpeak';

interface RecorderContext {
  isActive: boolean;
  text: string;
  translation: string;
  start: () => void;
  stop: () => void;
}

const RecorderProviderContext = createContext<RecorderContext | undefined>(undefined);

export const RecorderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { languageList } = useActiveLanguage();
  const speak = useSpeak();

  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [isActive, setIsActive] = useState(false);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognitionRef = useRef<SpeechRecognition>(new SpeechRecognition());

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = recognitionRef.current;

    recognition.continuous = false;
    recognition.lang = 'ru-RU';

    const handleEnd = () => setIsActive(false);
    const handleResult = async (event: SpeechRecognitionEvent) => {
      console.log('handleResult', event);
      const transcript = event.results[0][0].transcript;
      setText(transcript);

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
  }, [SpeechRecognition, languageList, speak]);

  const start = () => {
    setIsActive(true);
    recognitionRef.current?.start();
  };
  const stop = () => {
    setIsActive(false);
    recognitionRef.current?.stop();
  };

  return (
    <RecorderProviderContext.Provider value={{ text, translation, isActive, start, stop }}>
      {children}
    </RecorderProviderContext.Provider>
  );
};

export const useRecorder = () => {
  const context = useContext(RecorderProviderContext);
  if (!context) {
    throw new Error('useRecorder must be used within a RecorderProvider');
  }
  return context;
};
