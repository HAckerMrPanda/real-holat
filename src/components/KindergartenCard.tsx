'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MapPin, Phone, Globe, Navigation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface Kindergarten {
  id: number;
  obekt_nomi: string;
  tuman: string;
  viloyat: string;
  sigimi: number;
  qurilish_yili: string;
  oshhona_holati: string;
  aktiv_zal_holati: string;
  elektr_kun_davom: string;
  ichimlik_suvi_manbaa: string;
  internetga_ulanish: string;
  // Computed/Extra fields
  lat: number;
  lng: number;
  photo_url: string;
  checks_positive: number;
  checks_total: number;
  phone?: string;
  website?: string;
}

// Map of Tashkent districts to coordinates
export const districtCoords: Record<string, [number, number]> = {
  'Мирабадский': [41.2917, 69.2717],
  'Мирзо Улугбекский': [41.3217, 69.3217],
  'Яшнабадский': [41.3017, 69.3417],
  'Сергелийский': [41.2217, 69.2117],
  'Юнусабадский': [41.3617, 69.2817],
  'Яккасарайский': [41.2817, 69.2517],
  'Шайхантахурский': [41.3217, 69.2217],
  'Алмазарский': [41.3517, 69.2150],
  'Учтепинский': [41.2830, 69.1850],
  'Чиланзарский': [41.2717, 69.2117],
  'Бектемирский': [41.2017, 69.3317]
};

export default function KindergartenCard({ kg }: { kg: Kindergarten }) {
  const { t } = useLanguage();
  const progress = kg.checks_total > 0 
    ? Math.round((kg.checks_positive / kg.checks_total) * 100) 
    : 0;

  const photo_url = `https://picsum.photos/id/${(Number(kg.id) % 200) + 100}/800/600`;
  const is21School = kg.obekt_nomi.toLowerCase().includes('21 school');
  const yandexUrl = `https://yandex.uz/maps/?mode=routes&rtext=~${districtCoords[kg.tuman]?.[0] || 41.311081},${districtCoords[kg.tuman]?.[1] || 69.240562}&rtt=auto`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col group">
      <Link href={`/kindergarten/${kg.id}`} className="block aspect-video bg-gray-200 relative overflow-hidden">
        <img src={photo_url} alt={kg.obekt_nomi} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm text-gray-900 border border-white/50">
          {kg.qurilish_yili} г.
        </div>
        {is21School && (
          <div className="absolute bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
            {t('home.special')}
          </div>
        )}
      </Link>
      
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/kindergarten/${kg.id}`}>
          <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1 mb-1">{kg.obekt_nomi}</h3>
        </Link>
        <p className="text-xs text-gray-400 mb-4 flex items-center">
          <MapPin size={12} className="mr-1" />
          {kg.tuman}
        </p>
        
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[9px] uppercase font-black text-gray-400 mb-1">{t('profile.places')}</p>
            <p className="text-sm font-black text-gray-800">{kg.sigimi}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
            <p className="text-[9px] uppercase font-black text-gray-400 mb-1">Кухня</p>
            <p className="text-sm font-black text-gray-800 truncate">{kg.oshhona_holati}</p>
          </div>
        </div>
        
        {/* New Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <a 
            href={yandexUrl} 
            target="_blank" 
            className="flex items-center justify-center space-x-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black hover:bg-blue-100 transition-colors"
          >
            <Navigation size={14} />
            <span>{t('home.route')}</span>
          </a>
          <button 
            onClick={(e) => {
              e.preventDefault();
              alert(`Контакты ${kg.obekt_nomi}: ${is21School ? '+998 93 039 44 47' : 'По запросу'}`);
            }}
            className="flex items-center justify-center space-x-2 py-2.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black hover:bg-green-100 transition-colors"
          >
            <Phone size={14} />
            <span>{t('home.phone')}</span>
          </button>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase">Статус объекта</span>
            <span className="text-[10px] font-black text-gray-900">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
            <div 
              className={cn("h-full transition-all duration-1000", 
                progress >= 70 ? 'bg-green-500' : progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
