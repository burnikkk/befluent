import { default as countryCodesData } from '@/app/data/country-codes.json';
import { default as languageCodesData } from '@/app/data/language-codes.json';

const languageCodes: Record<string, string> = languageCodesData;
const countryCodes: Record<string, string> = countryCodesData;

type LangFullValue = { lang: string; label: string; dialect: string };

export const toLang = (lang: string): LangFullValue => {
  const [languageCode, countryCode] = lang.split('-');

  return {
    lang: lang,
    label: languageCodes[languageCode] || lang,
    dialect: countryCodes[countryCode],
  };
};
