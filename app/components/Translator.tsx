'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, Circle, Field, Flex, Grid, List, Text } from '@chakra-ui/react';

import { default as countryCodesData } from '@/app/data/country-codes.json';
import { default as languageCodesData } from '@/app/data/language-codes.json';
import { LightMode } from '@/components/ui/color-mode';
//adding color-mode for page component
//adding selection components
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';

//Adding components for translator
const languageCodes: Record<string, string> = languageCodesData;
const countryCodes: Record<string, string> = countryCodesData;
// const bg = useColorModeValue('blue');

export const Translator = () => {
  const recognitionRef = useRef<SpeechRecognition>();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [text, setText] = useState<string>();
  const [translation, setTranslation] = useState<string>();
  const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>();
  const [language, setLanguage] = useState<string>('pt-BR');

  const isSpeechDetected = false;

  const availableLanguages = Array.from(new Set(voices?.map(({ lang }) => lang)))
    .map((lang) => {
      const split = lang.split('-');
      const languageCode: string = split[0];
      const countryCode: string = split[1];
      return {
        lang,
        label: languageCodes[languageCode] || lang,
        dialect: countryCodes[countryCode],
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
  const activeLanguage = availableLanguages.find(({ lang }) => language === lang);

  const availableVoices = voices?.filter(({ lang }) => lang === language);
  const activeVoice =
    availableVoices?.find(({ name }) => name.includes('Google')) ||
    availableVoices?.find(({ name }) => name.includes('Luciana')) ||
    availableVoices?.[0];

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    if (Array.isArray(voices) && voices.length > 0) {
      setVoices(voices);
      return;
    }
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = function () {
        const voices = window.speechSynthesis.getVoices();
        setVoices(voices);
      };
    }
  }, []);

  function handleOnRecord() {
    if (isActive) {
      recognitionRef.current?.stop();
      setIsActive(false);
      return;
    }

    speak(' ');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.onstart = function () {
      setIsActive(true);
    };

    recognitionRef.current.onend = function () {
      setIsActive(false);
    };

    recognitionRef.current.onresult = async function (event) {
      const transcript = event.results[0][0].transcript;

      console.log('transcript:', transcript);

      setText(transcript);

      const results = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({
          text: transcript,
          language,
        }),
      }).then((r) => r.json());

      setTranslation(results.text);

      speak(results.text);
    };

    recognitionRef.current.start();
  }

  function speak(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);

    if (activeVoice) {
      utterance.voice = activeVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  return (
    <LightMode>
      <Box>
        <Box marginTop={12} paddingX={4}>
          <Box maxW="md" overflow="hidden" mx="auto" borderRadius="md">
            <Box bg="gray.200" padding={4} borderBottomWidth={4} borderColor="gray.300">
              <Box bg="blue.200" borderRadius="md" padding={2} border={1} borderColor="gray">
                <List.Root
                  fontFamily="mono"
                  fontWeight="bold"
                  color="black.900"
                  textTransform="uppercase"
                  px={4}
                  py={2}
                  borderWidth={1}
                  borderColor="gray.50"
                  borderRadius="md"
                >
                  <List.Item>&gt; Translation Mode: {activeLanguage?.label}</List.Item>
                  <List.Item>&gt; Dialect: {activeLanguage?.dialect}</List.Item>
                </List.Root>
              </Box>
            </Box>
            <Box bg="gray.600" padding={4} borderBottomWidth={4} borderColor="gray.900">
              <Flex alignItems="center" gap={3}>
                <Circle
                  width={5}
                  height={5}
                  flexShrink={0}
                  flexGrow={0}
                  bg={isActive ? 'red' : 'darkred'}
                  position="relative"
                >
                  <Text srOnly>{isActive ? 'Actively recording' : 'Not actively recording'}</Text>
                </Circle>
                <Box
                  borderRadius="md"
                  width="full"
                  height={5}
                  flexGrow={1}
                  bg={isActive ? 'green.500' : 'green.900'}
                ></Box>
                <Text srOnly>
                  {isSpeechDetected ? 'Speech is being recorded' : 'Speech is not being recorded'}
                </Text>
              </Flex>
            </Box>

            <Box bg="gray.600" padding={4}>
              <Box maxW="md" bg="gray.200" rounded="md" padding={5} mx="auto">
                <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                  <form>
                    <Field.Root>
                      <Field.Label
                        fontSize={10}
                        textTransform="uppercase"
                        fontWeight="bold"
                        mb={1}
                        color="black"
                      >
                        Language
                      </Field.Label>
                      <SelectRoot size="xs" key={language} onValueChange={setLanguage}>
                        <SelectTrigger
                          borderColor="gray.300"
                          bg="white"
                          _hover={{ bg: 'gray.100' }}
                          fontSize="0.7rem"
                        >
                          <SelectValueText placeholder="Pt-Br" color="gray.500" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLanguages.length > 0 ? (
                            availableLanguages.map(({ lang, label }) => (
                              <SelectItem key={lang} item={{ value: lang, label }}>
                                {label} ({lang})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem item={{ value: '', label: 'No languages available' }}>
                              No languages available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </SelectRoot>
                    </Field.Root>
                  </form>
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
                    onClick={handleOnRecord}
                  >
                    {isActive ? 'Stop' : 'Record'}
                  </Button>
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box maxW="lg" mx="auto" mt={12}>
          <Text mb={4}>Spoken Text: {text}</Text>
          <Text>Translation: {translation}</Text>
        </Box>
      </Box>
    </LightMode>
  );
};
