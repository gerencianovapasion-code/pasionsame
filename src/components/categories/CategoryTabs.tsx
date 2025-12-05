'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

export function CategoryTabs() {
  const t = useTranslations('categories');
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
      <TabsList className="bg-white">
        <TabsTrigger value="all">Todos</TabsTrigger>
        <TabsTrigger value="men">{t('men')}</TabsTrigger>
        <TabsTrigger value="women">{t('women')}</TabsTrigger>
        <TabsTrigger value="trans">{t('trans')}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
