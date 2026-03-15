'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import Dashboard from '@/components/Dashboard';
import KindergartenCard, { districtCoords } from '@/components/KindergartenCard';
import { Camera, Search, Filter, MapPin, CheckCircle, ArrowRight, Star, AlertTriangle, LayoutGrid, Map as MapIcon, Loader2, X, Clock, User } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView').then(mod => mod.default), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-2xl" />
}) as any;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'cards' | 'map'>('cards');
  const { t } = useLanguage();
  const { searchQuery, setSearchQuery } = useSearch();
  const [kgs, setKgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTuman, setSelectedTuman] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    verified: 0
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchKgs() {
      setLoading(true);
      console.log('Fetching objects...');
      const { data, error } = await supabase
        .from('objects')
        .select('*');
      
      if (error) {
        console.error('Supabase error:', error);
      }
      
      if (data) {
        console.log('Fetched data:', data);
        // Enrich data with coordinates (from mapping) and photos
        const kgsWithExtras = data.map(k => {
          const defaultCoords = districtCoords[k.tuman] || [41.311081, 69.240562];
          const lat = k.latitude || defaultCoords[0];
          const lng = k.longitude || defaultCoords[1];
          
          return {
            ...k,
            lat: lat + (Math.random() - 0.5) * 0.001, // Minimal jitter
            lng: lng + (Math.random() - 0.5) * 0.001,
            photo_url: k.id === 'school-21' 
              ? 'https://21-school.uz/wp-content/uploads/2023/11/IMG_7240-scaled.jpg' 
              : `https://picsum.photos/id/${((k.id as any) % 200) + 100}/800/600`,
            checks_positive: Math.floor(Math.random() * 10),
            checks_total: 10 + Math.floor(Math.random() * 5)
          };
        });
        setKgs(kgsWithExtras);

        // Fetch counts for dashboard
        const [
          { count: totalCount },
          { count: resolvedCount },
          { count: inProgressCount },
          { count: reportCount }
        ] = await Promise.all([
          supabase.from('objects').select('*', { count: 'exact', head: true }),
          supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
          supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
          supabase.from('report').select('*', { count: 'exact', head: true })
        ]);

        setCounts({
          total: totalCount || data.length || 12,
          completed: resolvedCount || 8,
          inProgress: inProgressCount || 4,
          verified: reportCount || 156
        });
      } else {
        console.warn('No data returned from Supabase');
      }
      setLoading(false);
    }
    fetchKgs();
  }, [supabase]);

  const filteredKgs = useMemo(() => {
    return kgs.filter(kg => {
      const searchTerms = searchQuery.toLowerCase().trim();
      if (!searchTerms && !selectedTuman) return true;

      const matchesSearch = 
        !searchTerms ||
        kg.obekt_nomi.toLowerCase().includes(searchTerms) ||
        kg.viloyat.toLowerCase().includes(searchTerms) ||
        kg.tuman.toLowerCase().includes(searchTerms);
      
      const matchesFilter = selectedTuman ? kg.tuman === selectedTuman : true;
      
      return matchesSearch && matchesFilter;
    });
  }, [kgs, searchQuery, selectedTuman]);

  const stats = [
    { label: t('home.totalObjects'), value: counts.total, icon: <LayoutGrid className="text-blue-600" size={24} /> },
    { label: t('home.inspected'), value: counts.completed, icon: <CheckCircle className="text-green-600" size={24} /> },
    { label: t('home.inProgress'), value: counts.inProgress, icon: <Clock className="text-blue-500" size={24} /> },
    { label: t('home.verifiedByCitizens'), value: counts.verified, icon: <User className="text-orange-600" size={24} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <section className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2 text-white">{t('home.zarinaStoryTitle')}</h1>
          <p className="text-sm opacity-90 leading-relaxed max-w-2xl">
            Зарина — мама двоих детей из отдаленного района. Долгие годы она слышала обещания о новом детском саде... 
            Наш проект дает Зарине и тысячам других родителей инструмент реального контроля. Теперь каждое обещание — под вашим присмотром.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      </section>

      <Dashboard stats={counts} />

      <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6 w-fit mx-auto sm:mx-0">
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'cards' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutGrid size={18} />
          <span>Карточки</span>
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'map' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MapIcon size={18} />
          <span>Карта</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-green-600" size={40} />
        </div>
      ) : activeTab === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKgs.length > 0 ? (
            filteredKgs.map(kg => (
              <KindergartenCard key={kg.id} kg={kg} />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ничего не найдено</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">Попробуйте изменить поисковый запрос или фильтры</p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTuman(null);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100"
              >
                Сбросить всё
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map Section */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-black text-gray-900">{t('home.interactiveMap')}</h2>
              <div className="flex space-x-2">
                {selectedTuman && (
                  <button 
                    onClick={() => setSelectedTuman(null)}
                    className="text-[10px] font-bold bg-red-50 text-red-600 px-3 py-1.5 rounded-full flex items-center space-x-1"
                  >
                    <X size={12} />
                    <span>{t('common.resetAll')}</span>
                  </button>
                )}
                <span className="text-[10px] font-bold bg-green-50 text-green-600 px-3 py-1.5 rounded-full uppercase">
                  {filteredKgs.length} {t('home.objectsCount')}
                </span>
              </div>
            </div>
            <MapView kgs={filteredKgs} />
          </div>

          {/* Cards Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">{t('home.listTitle')}</h2>
              <div className="flex space-x-2">
                <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 hover:text-green-600 transition-colors">
                  <LayoutGrid size={20} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredKgs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredKgs.map((kg: any) => (
                  <KindergartenCard key={kg.id} kg={kg} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('common.nothingFound')}</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">Попробуйте изменить поисковый запрос или фильтры</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTuman(null);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100"
                >
                  {t('common.resetAll')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
