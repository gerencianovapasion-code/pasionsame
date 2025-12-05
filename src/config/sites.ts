export interface SiteConfig {
  domain: string;
  name: string;
  description: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradient: string;
}

export const sites: Record<string, SiteConfig> = {
  'influencersex.com': {
    domain: 'influencersex.com',
    name: 'InfluencerSex',
    description: 'Red social de creadores de contenido exclusivo',
    logo: '/logos/influencersex.svg',
    favicon: '/favicons/influencersex.ico',
    primaryColor: '#e11d48', // Rosa intenso
    secondaryColor: '#fb7185', // Rosa claro
    accentColor: '#fda4af', // Rosa muy claro
    gradient: 'linear-gradient(135deg, #e11d48 0%, #fb7185 100%)',
  },
  'novapasion.com': {
    domain: 'novapasion.com',
    name: 'NovaPasión',
    description: 'Conecta con creadores apasionados',
    logo: '/logos/novapasion.svg',
    favicon: '/favicons/novapasion.ico',
    primaryColor: '#dc2626', // Rojo
    secondaryColor: '#f87171', // Rojo claro
    accentColor: '#fca5a5', // Rojo muy claro
    gradient: 'linear-gradient(135deg, #dc2626 0%, #f87171 100%)',
  },
  'pasionred.com': {
    domain: 'pasionred.com',
    name: 'PasiónRed',
    description: 'Tu red de pasiones y contenido exclusivo',
    logo: '/logos/pasionred.svg',
    favicon: '/favicons/pasionred.ico',
    primaryColor: '#ea580c', // Naranja
    secondaryColor: '#fb923c', // Naranja claro
    accentColor: '#fdba74', // Naranja muy claro
    gradient: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)',
  },
  'todofans.com': {
    domain: 'todofans.com',
    name: 'TodoFans',
    description: 'Todo para tus fans favoritos',
    logo: '/logos/todofans.svg',
    favicon: '/favicons/todofans.ico',
    primaryColor: '#db2777', // Fucsia
    secondaryColor: '#ec4899', // Fucsia claro
    accentColor: '#f9a8d4', // Fucsia muy claro
    gradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
  },
  'todofans.es': {
    domain: 'todofans.es',
    name: 'TodoFans España',
    description: 'La comunidad de fans en España',
    logo: '/logos/todofans-es.svg',
    favicon: '/favicons/todofans-es.ico',
    primaryColor: '#c026d3', // Púrpura
    secondaryColor: '#d946ef', // Púrpura claro
    accentColor: '#e879f9', // Púrpura muy claro
    gradient: 'linear-gradient(135deg, #c026d3 0%, #d946ef 100%)',
  },
};

export function getSiteConfig(host: string): SiteConfig {
  // Remover puerto si existe
  const domain = host.split(':')[0];

  // Buscar configuración exacta
  if (sites[domain]) {
    return sites[domain];
  }

  // Default a influencersex.com
  return sites['influencersex.com'];
}

export const allDomains = Object.keys(sites);
