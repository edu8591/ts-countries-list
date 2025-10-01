import { countries } from "./countries";
export type Country = (typeof countries)[number];

export type CountryName = Country["name"];
export type CountryRegion = Country["region"];
export type Continents = Country["continent"];
export type CountryCode = Country["alpha2"];
export type CountryAlpha3 = Country["alpha3"];
export type Currency = Country["currency"];
export type CurrencyCode = Currency["code"];
export type CountrySubRegion = Country["subregion"];
export type CountryFields = keyof Country;
export type Language = Country["languages"][number];
export const regionSubregionMap = {
  Americas: [
    "Northern America",
    "South America",
    "Central America",
    "Caribbean",
  ],
  Africa: [
    "Southern Africa",
    "Western Africa",
    "Northern Africa",
    "Middle Africa",
    "Eastern Africa",
  ],
  Asia: [
    "Eastern Asia",
    "Southern Asia",
    "Western Asia",
    "South-Eastern Asia",
    "Central Asia",
  ],
  Europe: [
    "Northern Europe",
    "Western Europe",
    "Eastern Europe",
    "Southern Europe",
  ],
  Oceania: [
    "Australia and New Zealand",
    "Melanesia",
    "Micronesia",
    "Polynesia",
  ],
  Antarctica: ["Antarctica"],
} as const;

export type SubregionsOf<R extends CountryRegion> =
  (typeof regionSubregionMap)[R][number];
