export interface Country {
  code: string;
  name: string;
  nameEs: string;
  namePt: string;
  nameEn: string;
  nameDe: string;
  nameIt: string;
  nameRo: string;
  nameFr: string;
  language: string;
  provinces: string[];
}

export const countries: Country[] = [
  {
    code: 'ES',
    name: 'España',
    nameEs: 'España',
    namePt: 'Espanha',
    nameEn: 'Spain',
    nameDe: 'Spanien',
    nameIt: 'Spagna',
    nameRo: 'Spania',
    nameFr: 'Espagne',
    language: 'es',
    provinces: [
      'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
      'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
      'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona',
      'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca',
      'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas',
      'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Murcia',
      'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca',
      'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria',
      'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid',
      'Vizcaya', 'Zamora', 'Zaragoza'
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    nameEs: 'Portugal',
    namePt: 'Portugal',
    nameEn: 'Portugal',
    nameDe: 'Portugal',
    nameIt: 'Portogallo',
    nameRo: 'Portugalia',
    nameFr: 'Portugal',
    language: 'pt',
    provinces: [
      'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra',
      'Évora', 'Faro', 'Guarda', 'Leiria', 'Lisboa', 'Portalegre',
      'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real',
      'Viseu', 'Açores', 'Madeira'
    ],
  },
  {
    code: 'FR',
    name: 'Francia',
    nameEs: 'Francia',
    namePt: 'França',
    nameEn: 'France',
    nameDe: 'Frankreich',
    nameIt: 'Francia',
    nameRo: 'Franța',
    nameFr: 'France',
    language: 'fr',
    provinces: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne',
      'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France',
      'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie',
      'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ],
  },
  {
    code: 'DE',
    name: 'Alemania',
    nameEs: 'Alemania',
    namePt: 'Alemanha',
    nameEn: 'Germany',
    nameDe: 'Deutschland',
    nameIt: 'Germania',
    nameRo: 'Germania',
    nameFr: 'Allemagne',
    language: 'de',
    provinces: [
      'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
      'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
      'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
    ],
  },
  {
    code: 'IT',
    name: 'Italia',
    nameEs: 'Italia',
    namePt: 'Itália',
    nameEn: 'Italy',
    nameDe: 'Italien',
    nameIt: 'Italia',
    nameRo: 'Italia',
    nameFr: 'Italie',
    language: 'it',
    provinces: [
      'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
      'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
      'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana',
      'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
    ],
  },
  {
    code: 'RO',
    name: 'Rumania',
    nameEs: 'Rumania',
    namePt: 'Romênia',
    nameEn: 'Romania',
    nameDe: 'Rumänien',
    nameIt: 'Romania',
    nameRo: 'România',
    nameFr: 'Roumanie',
    language: 'ro',
    provinces: [
      'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
      'Botoșani', 'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași',
      'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița',
      'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara',
      'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș',
      'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu',
      'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui', 'Vrancea'
    ],
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    nameEs: 'Reino Unido',
    namePt: 'Reino Unido',
    nameEn: 'United Kingdom',
    nameDe: 'Vereinigtes Königreich',
    nameIt: 'Regno Unito',
    nameRo: 'Regatul Unit',
    nameFr: 'Royaume-Uni',
    language: 'en',
    provinces: [
      'England', 'Scotland', 'Wales', 'Northern Ireland',
      'Greater London', 'Greater Manchester', 'West Midlands',
      'West Yorkshire', 'East Midlands', 'South East', 'North West',
      'South West', 'East of England', 'North East'
    ],
  },
  {
    code: 'US',
    name: 'Estados Unidos',
    nameEs: 'Estados Unidos',
    namePt: 'Estados Unidos',
    nameEn: 'United States',
    nameDe: 'Vereinigte Staaten',
    nameIt: 'Stati Uniti',
    nameRo: 'Statele Unite',
    nameFr: 'États-Unis',
    language: 'en',
    provinces: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
      'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
      'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming'
    ],
  },
  {
    code: 'CA',
    name: 'Canadá',
    nameEs: 'Canadá',
    namePt: 'Canadá',
    nameEn: 'Canada',
    nameDe: 'Kanada',
    nameIt: 'Canada',
    nameRo: 'Canada',
    nameFr: 'Canada',
    language: 'en',
    provinces: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
      'Yukon'
    ],
  },
  {
    code: 'MX',
    name: 'México',
    nameEs: 'México',
    namePt: 'México',
    nameEn: 'Mexico',
    nameDe: 'Mexiko',
    nameIt: 'Messico',
    nameRo: 'Mexic',
    nameFr: 'Mexique',
    language: 'es',
    provinces: [
      'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
      'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
      'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos',
      'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro',
      'Quintana Roo', 'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco',
      'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
      'Ciudad de México'
    ],
  },
  {
    code: 'AR',
    name: 'Argentina',
    nameEs: 'Argentina',
    namePt: 'Argentina',
    nameEn: 'Argentina',
    nameDe: 'Argentinien',
    nameIt: 'Argentina',
    nameRo: 'Argentina',
    nameFr: 'Argentine',
    language: 'es',
    provinces: [
      'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
      'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
      'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
      'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
      'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
      'Ciudad Autónoma de Buenos Aires'
    ],
  },
  {
    code: 'CO',
    name: 'Colombia',
    nameEs: 'Colombia',
    namePt: 'Colômbia',
    nameEn: 'Colombia',
    nameDe: 'Kolumbien',
    nameIt: 'Colombia',
    nameRo: 'Columbia',
    nameFr: 'Colombie',
    language: 'es',
    provinces: [
      'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá', 'Bolívar',
      'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
      'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira',
      'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo',
      'Quindío', 'Risaralda', 'San Andrés y Providencia', 'Santander',
      'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
    ],
  },
  {
    code: 'BR',
    name: 'Brasil',
    nameEs: 'Brasil',
    namePt: 'Brasil',
    nameEn: 'Brazil',
    nameDe: 'Brasilien',
    nameIt: 'Brasile',
    nameRo: 'Brazilia',
    nameFr: 'Brésil',
    language: 'pt',
    provinces: [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
      'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
      'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará',
      'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro',
      'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima',
      'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ],
  },
  {
    code: 'CL',
    name: 'Chile',
    nameEs: 'Chile',
    namePt: 'Chile',
    nameEn: 'Chile',
    nameDe: 'Chile',
    nameIt: 'Cile',
    nameRo: 'Chile',
    nameFr: 'Chili',
    language: 'es',
    provinces: [
      'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
      'Coquimbo', 'Valparaíso', 'Metropolitana de Santiago', 'O\'Higgins',
      'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos', 'Los Lagos',
      'Aysén', 'Magallanes'
    ],
  },
  {
    code: 'PE',
    name: 'Perú',
    nameEs: 'Perú',
    namePt: 'Peru',
    nameEn: 'Peru',
    nameDe: 'Peru',
    nameIt: 'Perù',
    nameRo: 'Peru',
    nameFr: 'Pérou',
    language: 'es',
    provinces: [
      'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
      'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
      'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
      'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
      'Tumbes', 'Ucayali'
    ],
  },
  {
    code: 'VE',
    name: 'Venezuela',
    nameEs: 'Venezuela',
    namePt: 'Venezuela',
    nameEn: 'Venezuela',
    nameDe: 'Venezuela',
    nameIt: 'Venezuela',
    nameRo: 'Venezuela',
    nameFr: 'Venezuela',
    language: 'es',
    provinces: [
      'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
      'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
      'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta',
      'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
    ],
  },
  {
    code: 'PY',
    name: 'Paraguay',
    nameEs: 'Paraguay',
    namePt: 'Paraguai',
    nameEn: 'Paraguay',
    nameDe: 'Paraguay',
    nameIt: 'Paraguay',
    nameRo: 'Paraguay',
    nameFr: 'Paraguay',
    language: 'es',
    provinces: [
      'Alto Paraguay', 'Alto Paraná', 'Amambay', 'Asunción', 'Boquerón',
      'Caaguazú', 'Caazapá', 'Canindeyú', 'Central', 'Concepción',
      'Cordillera', 'Guairá', 'Itapúa', 'Misiones', 'Ñeembucú',
      'Paraguarí', 'Presidente Hayes', 'San Pedro'
    ],
  },
  {
    code: 'UY',
    name: 'Uruguay',
    nameEs: 'Uruguay',
    namePt: 'Uruguai',
    nameEn: 'Uruguay',
    nameDe: 'Uruguay',
    nameIt: 'Uruguay',
    nameRo: 'Uruguay',
    nameFr: 'Uruguay',
    language: 'es',
    provinces: [
      'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
      'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
      'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
      'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
    ],
  },
];

export function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}

export function getCountryName(code: string, locale: string): string {
  const country = getCountryByCode(code);
  if (!country) return code;

  switch (locale) {
    case 'es':
      return country.nameEs;
    case 'pt':
      return country.namePt;
    case 'en':
      return country.nameEn;
    case 'de':
      return country.nameDe;
    case 'it':
      return country.nameIt;
    case 'ro':
      return country.nameRo;
    case 'fr':
      return country.nameFr;
    default:
      return country.name;
  }
}
