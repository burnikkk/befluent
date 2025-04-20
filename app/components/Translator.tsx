'use client';

import React from 'react';

import { Box, Circle, Field, Flex, Grid, List, Text } from '@chakra-ui/react';

import { RecordButton } from '@/app/components/RecordButton';
import { SpeakResult } from '@/app/components/SpeakResult';
import { useActiveLanguage } from '@/app/hooks/useActiveLanguage';
import { useAvailableLanguages } from '@/app/hooks/useAvailableLanguage';
import { useRecorder } from '@/app/hooks/useRecorder';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';

export const Translator = () => {
  const { availableLanguages, languageOptions } = useAvailableLanguages();
  const { activeLanguage, selectedLanguage, setSelectedLanguage } = useActiveLanguage();
  const { isActive } = useRecorder();
  return (
    <Box overflow="hidden">
      <Box paddingTop={12} paddingX={4}>
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
              ></Circle>
              <Box
                borderRadius="md"
                width="full"
                height={5}
                flexGrow={1}
                bg={isActive ? 'green.500' : 'green.900'}
              ></Box>
              <Text>{isActive ? 'Actively recording' : 'Not actively recording'}</Text>
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
                    <SelectRoot
                      size="xs"
                      collection={languageOptions}
                      value={[selectedLanguage]}
                      onValueChange={(event) => setSelectedLanguage(event.value[0])}
                    >
                      <SelectTrigger
                        borderColor="gray.300"
                        bg="white"
                        _hover={{ bg: 'gray.100' }}
                        fontSize="0.75rem"
                      >
                        <SelectValueText placeholder="Pt-Br" color="gray.500" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(availableLanguages) && availableLanguages.length > 0 ? (
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
                <RecordButton />
              </Grid>
            </Box>
          </Box>
          <SpeakResult />
        </Box>
      </Box>
    </Box>
  );
};
