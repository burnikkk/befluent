'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Box, Circle, Field, Flex, Grid, List, Text } from '@chakra-ui/react';

import { default as countryCodesData } from '@/app/data/country-codes.json';
import { default as languageCodesData } from '@/app/data/language-codes.json';

const languageCodes: Record<string, string> = languageCodesData;
const countryCodes: Record<string, string> = countryCodesData;

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
          <Box bg="gray.500" padding={4} borderBottom={4} borderColor="gray.900">
            <Box bg="gray.600" padding={2} borderBottom={2} borderColor="gray.800">
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
          </Box>

          <Box bg="gray.800" padding={4}>
            <Box maxW="md" bg="gray.200" rounded="md" padding={5} mx="auto">
              <Grid templateColumns={'repeat(2, 1fr)'} gap={4}>
                <form>
                  <Field.Root></Field.Root>
                  {/*<FormControl>*/}
                  {/*  /!*<FormLabel*!/*/}
                  {/*  /!*  fontSize="0.6rem"*!/*/}
                  {/*  /!*  textTransform="uppercase"*!/*/}
                  {/*  /!*  fontWeight="bold"*!/*/}
                  {/*  /!*  mb={1}*!/*/}
                  {/*  /!*  color="black"*!/*/}
                  {/*  /!*>*!/*/}
                  {/*  /!*  Language*!/*/}
                  {/*  /!*</FormLabel>*!/*/}
                  {/*  /!*<Select*!/*/}
                  {/*  /!*  w="full"*!/*/}
                  {/*  /!*  fontSize="0.7rem"*!/*/}
                  {/*  /!*  border="1px solid"*!/*/}
                  {/*  /!*  borderColor="zinc.300"*!/*/}
                  {/*  /!*  px={2}*!/*/}
                  {/*  /!*  py={1}*!/*/}
                  {/*  /!*  pr={7}*!/*/}
                  {/*  /!*  rounded="sm"*!/*/}
                  {/*  /!*  value={language}*!/*/}
                  {/*  /!*  onChange={(event) => setLanguage(event.currentTarget.value)}*!/*/}
                  {/*  /!*>*!/*/}
                  {/*  /!*  {availableLanguages.map(({ lang, label }) => (*!/*/}
                  {/*  /!*    <option key={lang} value={lang}>*!/*/}
                  {/*  /!*      {label} ({lang})*!/*/}
                  {/*  /!*    </option>*!/*/}
                  {/*  /!*  ))}*!/*/}
                  {/*  /!*</Select>*!/*/}
                  {/*</FormControl>*/}
                </form>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>

    //
    //       <div className="bg-zinc-800 p-4">
    //         <div className="grid sm:grid-cols-2 gap-4 max-w-lg bg-zinc-200 rounded-lg p-5 mx-auto">
    //           <form>
    //             <div>
    //               <label className="block text-black text-[.6rem] uppercase font-bold mb-1">Language</label>
    //               <select className="w-full text-[.7rem] rounded-sm border-zinc-300 px-2 py-1 pr-7" name="language"
    //                       value={language} onChange={(event) => {
    //                 setLanguage(event.currentTarget.value);
    //               }}>
    //                 {availableLanguages.map(({ lang, label }) => {
    //                   return (
    //                     <option key={lang} value={lang}>
    //                       {label} ({lang})
    //                     </option>
    //                   );
    //                 })}
    //               </select>
    //             </div>
    //           </form>
    //           <p>
    //             <button
    //               className={`w-full h-full uppercase font-semibold text-sm  ${isActive ? 'text-white bg-red-500' : 'text-zinc-50 bg-zinc-900'} color-white py-3 rounded-sm`}
    //               onClick={handleOnRecord}
    //             >
    //               {isActive ? 'Stop' : 'Record'}
    //             </button>
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //
    //
    //     <div className="max-w-lg mx-auto mt-12">
    //       <p className="mb-4">
    //         Spoken Text: {text}
    //       </p>
    //       <p>
    //         Translation: {translation}
    //       </p>
    //     </div>
    //
    //   </div>
  );
};
