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

  const recognitionRef = useRef<SpeechRecognition>();

  useEffect(() => {
    if (!window) {
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    recognition.onstart = function () {
      setIsActive(true);
    };

    recognition.onend = function () {
      setIsActive(false);
    };

    recognition.onresult = async function (event: SpeechRecognitionEvent) {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      console.log('transcription ', transcript);

      const results = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ text: transcript, language: languageList }),
      }).then((r) => r.json());

      setTranslation(results.text);
      speak(results.text);
      console.log(results);

      return () => {
        recognition.stop();
      };
    };
  }, [languageList, speak]);

  const start = () => {
    recognitionRef.current?.start();
  };

  const stop = () => {
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
