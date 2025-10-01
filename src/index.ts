import { countries } from "./countries";
import {
  Continents,
  Country,
  CountryAlpha3,
  CountryCode,
  CountryFields,
  CountryName,
  CountryRegion,
  CountrySubRegion,
  CurrencyCode,
  Language,
  regionSubregionMap,
  SubregionsOf,
} from "./types";

export const getCountryByName = (name: CountryName): Country | undefined =>
  countries.find((c) => c.name === name);

export const getCountryByAlpha2 = (code: CountryCode): Country | undefined =>
  countries.find((c) => c.alpha2 === code);

export const getCountryByAlpha3 = (code: CountryAlpha3): Country | undefined =>
  countries.find((c) => c.alpha3 === code);

export const getCountriesByCurrency = (code: CurrencyCode): Country[] =>
  countries.filter((c) => c.currency?.code === code);

export const getCountriesByContinent = (continents: Continents[]): Country[] =>
  countries.filter((c) => continents.includes(c.continent));

export const getCountriesByRegion = <R extends CountryRegion>(
  region: R,
  subRegion: SubregionsOf<R>
): Country[] =>
  countries.filter((c) => c.region === region && c.subregion === subRegion);

export const getCountriesByLanguage = (language: Language): Country[] =>
  countries.filter((c) =>
    (c.languages as readonly Language[]).includes(language)
  );

export const getCountriesByMultipleFilters = (filters: {
  region?: CountryRegion;
  subregion?: CountrySubRegion;
  continent?: Continents;
  language?: Language;
  currency?: CurrencyCode;
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
    return true;
  });
};

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

export const getAllCurrencies = (): CurrencyCode[] =>
  Array.from(
    new Set(countries.map((c) => c.currency?.code).filter(Boolean))
  ) as CurrencyCode[];

export const getCountryNames = (): CountryName[] =>
  countries.map((c) => c.name);

export const getCountryAlpha2Codes = (): CountryCode[] =>
  countries.map((c) => c.alpha2);

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

export const getCountryCountByContinent = (): Record<Continents, number> =>
  countries.reduce((acc, c) => {
    const cont = c.continent;
    acc[cont] = (acc[cont] || 0) + 1;
    return acc;
  }, {} as Record<Continents, number>);

export const getCountriesByFields = <F extends CountryFields[]>(
  filters: {
    region?: CountryRegion;
    subregion?: CountrySubRegion;
    continent?: Continents;
    language?: Language;
    currency?: CurrencyCode;
  },
  fields: F
): Pick<Country, F[number]>[] => {
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
      const picked = {} as Pick<Country, F[number]>;
      fields.forEach((f) => {
        (picked as any)[f] = c[f as keyof Country];
      });
      return picked;
    });
};

console.log(
  getCountriesByFields({ continent: "North America", region: "Americas" }, [
    "continent",
    "name",
  ])
);
