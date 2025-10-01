import { countries } from "./countries";
import {
  Continents,
  Country,
  CountryAlpha3,
  Capitals,
  CountryCode,
  CountryCodeNumeric,
  CountryFields,
  CountryName,
  CountryRegion,
  CountrySubRegion,
  Currency,
  CurrencyCode,
  Language,
  PhoneCountryCode,
  regionSubregionMap,
  SubregionsOf,
} from "./types";

// ============================================================================
// LOOKUP FUNCTIONS (Single Country)
// ============================================================================

export const getCountryByName = (name: CountryName): Country | undefined =>
  countries.find((c) => c.name === name);

export const getCountryByAlpha2 = (code: CountryCode): Country | undefined =>
  countries.find((c) => c.alpha2 === code);

export const getCountryByAlpha3 = (code: CountryAlpha3): Country | undefined =>
  countries.find((c) => c.alpha3 === code);

/**
 * Search for a country by any code (alpha2, alpha3, or numeric)
 */
export const getCountryByCode = (
  code: CountryCode | CountryAlpha3 | CountryCodeNumeric
): Country | undefined => {
  const upperCode = code.toUpperCase();
  return countries.find(
    (c) =>
      c.alpha2 === upperCode || c.alpha3 === upperCode || c.numeric === code
  );
};

/**
 * Search for countries by name (case-insensitive, partial match)
 */
export const searchCountriesByName = (query: CountryName): Country[] => {
  const lowerQuery = query.toLowerCase();
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.officialName?.toLowerCase().includes(lowerQuery) ||
      c.nativeName?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get country by phone code
 */
export const getCountriesByPhoneCode = (
  phoneCode: PhoneCountryCode
): Country[] => {
  const normalized = phoneCode.startsWith("+") ? phoneCode : `+${phoneCode}`;
  return countries.filter((c) => c.phoneCode === normalized);
};

/**
 * Get country by capital city
 */
export const getCountryByCapital = (capital: Capitals): Country | undefined =>
  countries.find((c) => c.capital?.toLowerCase() === capital.toLowerCase());

// ============================================================================
// FILTER FUNCTIONS (Multiple Countries)
// ============================================================================

export const getCountriesByCurrency = (code: CurrencyCode): Country[] =>
  countries.filter((c) => c.currency?.code === code);

export const getCountriesByContinent = (continents: Continents[]): Country[] =>
  countries.filter((c) => continents.includes(c.continent));

export const getCountriesByRegion = <R extends CountryRegion>(
  region: R,
  subRegion?: SubregionsOf<R>
): Country[] =>
  countries.filter(
    (c) => c.region === region && (!subRegion || c.subregion === subRegion)
  );

export const getCountriesByLanguage = (language: Language): Country[] =>
  countries.filter((c) =>
    (c.languages as readonly Language[]).includes(language)
  );

/**
 * Advanced filtering with multiple criteria
 */
export const getCountriesByMultipleFilters = (filters: {
  region?: CountryRegion;
  subregion?: CountrySubRegion;
  continent?: Continents;
  language?: Language;
  currency?: CurrencyCode;
  phoneCode?: string;
}): Country[] => {
  return countries.filter((c) => {
    if (filters.region && c.region !== filters.region) return false;
    if (filters.subregion && c.subregion !== filters.subregion) return false;
    if (filters.continent && c.continent !== filters.continent) return false;
    if (
      filters.language &&
      !(c.languages as readonly Language[]).includes(filters.language)
    )
      return false;
    if (filters.currency && c.currency?.code !== filters.currency) return false;
    if (filters.phoneCode && c.phoneCode !== filters.phoneCode) return false;
    return true;
  });
};

// ============================================================================
// PROJECTION FUNCTIONS (Select Specific Fields)
// ============================================================================

/**
 * Get countries with only specific fields (improved type safety)
 */
export const getCountriesByFields = <F extends CountryFields>(
  filters: {
    region?: CountryRegion;
    subregion?: CountrySubRegion;
    continent?: Continents;
    language?: Language;
    currency?: CurrencyCode;
  },
  fields: readonly F[]
): Pick<Country, F>[] => {
  return countries
    .filter((c) => {
      if (filters.region && c.region !== filters.region) return false;
      if (filters.subregion && c.subregion !== filters.subregion) return false;
      if (filters.continent && c.continent !== filters.continent) return false;
      if (
        filters.language &&
        !(c.languages as readonly Language[]).includes(filters.language)
      )
        return false;
      if (filters.currency && c.currency?.code !== filters.currency)
        return false;
      return true;
    })
    .map((c) => {
      const picked = {} as Pick<Country, F>;
      fields.forEach((f) => {
        (picked as any)[f] = c[f as keyof Country];
      });
      return picked;
    });
};

// ============================================================================
// AGGREGATION & METADATA FUNCTIONS
// ============================================================================

export const getAllRegions = (): CountryRegion[] =>
  Object.keys(regionSubregionMap) as CountryRegion[];

export const getSubregions = <R extends CountryRegion>(
  region: R
): SubregionsOf<R>[] =>
  [
    ...(regionSubregionMap[region] as readonly SubregionsOf<R>[]),
  ] as SubregionsOf<R>[];

export const getAllContinents = (): Continents[] =>
  Array.from(new Set(countries.map((c) => c.continent)));

/**
 * Get all unique currencies used across all countries.
 * Uses Map for deduplication by currency code (more efficient than JSON stringify/parse).
 */
export const getAllCurrencies = (): Currency[] => {
  const currencyMap = new Map<CurrencyCode, Currency>();

  countries.forEach((country) => {
    const { currency } = country;
    // Use currency code as unique key - avoids stringify/parse overhead
    if (!currencyMap.has(currency.code)) {
      currencyMap.set(currency.code, currency);
    }
  });

  return Array.from(currencyMap.values());
};

export const getAllLanguages = (): Language[] =>
  Array.from(
    new Set(countries.flatMap((c) => c.languages as readonly Language[]))
  );

export const getCountryNames = (): CountryName[] =>
  countries.map((c) => c.name);

export const getCountryAlpha2Codes = (): CountryCode[] =>
  countries.map((c) => c.alpha2);

export const getCountryAlpha3Codes = (): CountryAlpha3[] =>
  countries.map((c) => c.alpha3);

/**
 * Get all unique phone codes
 */
export const getAllPhoneCodes = (): string[] =>
  Array.from(new Set(countries.map((c) => c.phoneCode).filter(Boolean)));

// ============================================================================
// GROUPING FUNCTIONS
// ============================================================================

export const getCountriesGroupedByContinent = (): Record<
  Continents,
  Country[]
> =>
  countries.reduce((acc, c) => {
    const cont = c.continent;
    if (!acc[cont]) acc[cont] = [];
    acc[cont].push(c);
    return acc;
  }, {} as Record<Continents, Country[]>);

export const getCountriesGroupedByRegion = (): Record<
  CountryRegion,
  Country[]
> =>
  countries.reduce((acc, c) => {
    const reg = c.region;
    if (!acc[reg]) acc[reg] = [];
    acc[reg].push(c);
    return acc;
  }, {} as Record<CountryRegion, Country[]>);

export const getCountriesGroupedByCurrency = (): Record<
  CurrencyCode,
  Country[]
> =>
  countries.reduce((acc, c) => {
    if (c.currency?.code) {
      if (!acc[c.currency.code]) acc[c.currency.code] = [];
      acc[c.currency.code].push(c);
    }
    return acc;
  }, {} as Record<CurrencyCode, Country[]>);

export const getCountriesGroupedByLanguage = (): Record<Language, Country[]> =>
  countries.reduce((acc, c) => {
    (c.languages as readonly Language[]).forEach((lang) => {
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push(c);
    });
    return acc;
  }, {} as Record<Language, Country[]>);

// ============================================================================
// COUNTING FUNCTIONS
// ============================================================================

export const getCountryCountByContinent = (): Record<Continents, number> =>
  countries.reduce((acc, c) => {
    const cont = c.continent;
    acc[cont] = (acc[cont] || 0) + 1;
    return acc;
  }, {} as Record<Continents, number>);

export const getCountryCountByRegion = (): Record<CountryRegion, number> =>
  countries.reduce((acc, c) => {
    const reg = c.region;
    acc[reg] = (acc[reg] || 0) + 1;
    return acc;
  }, {} as Record<CountryRegion, number>);

export const getTotalCountries = (): number => countries.length;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Check if a country code is valid
 */
export const isValidCountryCode = (code: string): boolean => {
  const upperCode = code.toUpperCase();
  return countries.some(
    (c) =>
      c.alpha2 === upperCode || c.alpha3 === upperCode || c.numeric === code
  );
};

/**
 * Check if a currency code is valid
 */
export const isValidCurrencyCode = (code: string): boolean =>
  countries.some((c) => c.currency?.code === code);

/**
 * Check if a language is spoken in any country
 */
export const isValidLanguage = (language: string): boolean =>
  countries.some((c) =>
    (c.languages as readonly Language[]).includes(language as Language)
  );

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get neighboring countries (those sharing the same subregion)
 */
export const getPotentialNeighbors = (countryCode: CountryCode): Country[] => {
  const country = getCountryByAlpha2(countryCode);
  if (!country) return [];

  return countries.filter(
    (c) => c.subregion === country.subregion && c.alpha2 !== country.alpha2
  );
};

/**
 * Compare two countries
 */
export const compareCountries = (
  code1: CountryCode,
  code2: CountryCode
): {
  country1: Country | undefined;
  country2: Country | undefined;
  sameCurrency: boolean;
  sameRegion: boolean;
  sameContinent: boolean;
  sharedLanguages: Language[];
} => {
  const c1 = getCountryByAlpha2(code1);
  const c2 = getCountryByAlpha2(code2);

  const sharedLanguages =
    c1 && c2
      ? (c1.languages as readonly Language[]).filter((lang) =>
          (c2.languages as readonly Language[]).includes(lang)
        )
      : [];

  return {
    country1: c1,
    country2: c2,
    sameCurrency: c1?.currency?.code === c2?.currency?.code,
    sameRegion: c1?.region === c2?.region,
    sameContinent: c1?.continent === c2?.continent,
    sharedLanguages,
  };
};

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  Country,
  CountryName,
  CountryRegion,
  Continents,
  Capitals,
  CountryCode,
  CountryAlpha3,
  CountryCodeNumeric,
  Currency,
  CurrencyCode,
  CountrySubRegion,
  CountryFields,
  PhoneCountryCode,
  Language,
  SubregionsOf,
};

export { countries, regionSubregionMap };
