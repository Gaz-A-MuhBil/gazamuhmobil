import { useCallback, useEffect, useState } from 'react';
import { api } from './client';

// Ticari ve endüstriyel hizmetler (sitedeki /hizmetlerimiz sayfaları ile aynı metinler; /api/app/services)
export type ProService = {
  slug: string;
  icon: 'flame' | 'fire' | 'air';
  title: string;
  short: string;
  card: string;
  intro: string[];
  sections: { h: string; p: string }[];
  faq: { q: string; a: string }[];
  closing: string;
  cta: string;
};
export type ServicesData = { intro: { title: string; text: string; about: string; quoteTitle: string; quoteText: string }; services: ProService[] };

// Simgeler MaterialCommunityIcons adlarıdır
export const serviceIcon = { flame: 'fire', fire: 'fire-extinguisher', air: 'air-conditioner' } as const;

// Uygulama açıkken bir kez indirilir; ana sayfa, liste ve detay ekranları aynı veriyi kullanır
let cache: ServicesData | null = null;
let pending: Promise<ServicesData> | null = null;
const load = () => (pending ??= api<ServicesData>('/api/app/services').then((d) => (cache = d)).finally(() => { pending = null; }));

export function useServices() {
  const [data, setData] = useState<ServicesData | null>(cache);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(() => load().then(setData).catch((e) => setError((e as Error).message)), []);
  useEffect(() => { if (!cache) fetchData(); }, [fetchData]);
  const retry = useCallback(() => { setError(null); fetchData(); }, [fetchData]);
  return { data, error, retry };
}
