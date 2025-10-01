import { countries } from "./countries";

// ============================================================================
// BASE COUNTRY TYPE
// ============================================================================

export type Country = (typeof countries)[number];

// ============================================================================
// DERIVED TYPES FROM COUNTRY DATA
// ============================================================================

export type CountryName = Country["name"];
export type CountryRegion = Country["region"];
export type Continents = Country["continent"];
export type CountryCode = Country["alpha2"];
export type CountryAlpha3 = Country["alpha3"];
export type Currency = NonNullable<Country["currency"]>;
export type CurrencyCode = Currency["code"];
export type CountrySubRegion = Country["subregion"];
export type CountryFields = keyof Country;
export type Language = Country["languages"][number];

// ============================================================================
// REGION AND SUBREGION MAPPING
// ============================================================================

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

// ============================================================================
// FILTER OPTIONS TYPE (for better autocomplete)
// ============================================================================

export interface CountryFilterOptions {
  region?: CountryRegion;
  subregion?: CountrySubRegion;
  continent?: Continents;
  language?: Language;
  currency?: CurrencyCode;
  phoneCode?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Type for country with only specific fields
 */
export type CountryWithFields<F extends CountryFields> = Pick<Country, F>;

/**
 * Type for grouping results
 */
export type GroupedCountries<K extends string> = Record<K, Country[]>;

/**
 * Type for comparison results
 */
export interface CountryComparison {
  country1: Country | undefined;
  country2: Country | undefined;
  sameCurrency: boolean;
  sameRegion: boolean;
  sameContinent: boolean;
  sharedLanguages: Language[];
}
