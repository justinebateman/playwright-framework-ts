/* eslint-disable @typescript-eslint/no-var-requires */
import countries from "i18n-iso-countries";
import moment from "moment";

function getCountryNameFromCode(countryCode: string): string {
  countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
  return countries.getName(countryCode, "en");
}

function getCountryCodeFromName(countryName: string): string {
  countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
  return countries.getAlpha3Code(countryName, "en");
}

function convertDateStringToCorrectFormat(originalDateString: string): string {
  return moment(originalDateString).format("YYYY-MM-DD");
}

function removeWhiteSpaceFromString(originalString: string): string {
  return originalString.replace(/\s+/g, "");
}

function convertCurrencyString(originalCurrencyString: string): string {
  return removeWhiteSpaceFromString(originalCurrencyString)
    .replace(")", "")
    .slice(2);
}

export default {
  getCountryNameFromCode,
  getCountryCodeFromName,
  convertDateStringToCorrectFormat,
  removeWhiteSpaceFromString,
  convertCurrencyString,
};
