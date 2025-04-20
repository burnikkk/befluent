'use client';

import { useEffect, useRef, useState } from 'react';

import { createContextHook } from '@/app/hooks/createContextHook';
import { useActiveLanguage } from '@/app/hooks/useActiveLanguage';
import { useSpeak } from '@/app/hooks/useSpeak';

export const useRecorder = createContextHook(() => {
  const { selectedLanguage } = useActiveLanguage();
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
        body: JSON.stringify({ text: transcript, language: selectedLanguage }),
      }).then((r) => r.json());

      setTranslation(results.text);
      speak(results.text);
      console.log(results);

      return () => {
        recognition.stop();
      };
    };
  }, [selectedLanguage, speak]);

  const start = () => {
    recognitionRef.current?.start();
  };

  const stop = () => {
    recognitionRef.current?.stop();
  };

  return { text, translation, isActive, start, stop };
});
