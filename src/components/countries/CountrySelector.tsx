'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries } from '@/data/countries';
import { useLocale } from 'next-intl';
import { getCountryName } from '@/data/countries';

export function CountrySelector() {
  const locale = useLocale();
  const [selectedCountry, setSelectedCountry] = useState('all');

  return (
    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
      <SelectTrigger className="w-full md:w-64 bg-white">
        <SelectValue placeholder="Seleccionar país" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los países</SelectItem>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {getCountryName(country.code, locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
