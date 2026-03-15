'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Navigation, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  ChevronLeft, 
  Droplets, 
  Zap, 
  Globe, 
  CookingPot, 
  School,
  Phone
} from 'lucide-react';
import { getDistance } from '@/lib/utils';
import { districtCoords } from '@/components/KindergartenCard';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function KindergartenDetailPage() {
  const { id } = useParams();
  const [kg, setKg] = useState<any>(null);
  const [promises, setPromises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isDemo, setIsDemo] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: authUser } = await supabase.auth.getUser();
      setUser(authUser.user);

      const { data: kgData } = await supabase
        .from('objects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (kgData) {
        const defaultCoords = districtCoords[kgData.tuman] || [41.311081, 69.240562];
        const lat = kgData.latitude || defaultCoords[0];
        const lng = kgData.longitude || defaultCoords[1];
        
        setKg({
          ...kgData,
          lat,
          lng,
          photo_url: kgData.id === 'school-21' 
            ? 'https://21-school.uz/wp-content/uploads/2023/11/IMG_7240-scaled.jpg' 
            : `https://picsum.photos/id/${((kgData.id as any) % 200) + 100}/800/600`,
          checks_positive: Math.floor(Math.random() * 5),
          checks_total: 10
        });
        
        // Fetch promises
        const { data: promiseData } = await supabase
          .from('promises')
          .select('*')
          .eq('kindergarten_id', id);
        setPromises(promiseData || []);
      }
      setLoading(false);
    }
    fetchData();

    // Watch position
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGeoError(null);
        },
        (err) => {
          setGeoError('Геолокация отключена или недоступна');
        },
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setGeoError('Ваш браузер не поддерживает геолокацию');
    }
  }, [id, supabase]);

  useEffect(() => {
    const checkDemo = () => setIsDemo(localStorage.getItem('demo_mode') === 'true');
    checkDemo();
    window.addEventListener('storage', checkDemo);
    return () => window.removeEventListener('storage', checkDemo);
  }, []);

  useEffect(() => {
    if (userLocation && kg) {
      const d = getDistance(userLocation.lat, userLocation.lng, kg.lat, kg.lng);
      setDistance(d);
    }
  }, [userLocation, kg]);

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="animate-spin text-green-600" size={48} /></div>;
  if (!kg) return <div className="text-center py-24">Сад не найден</div>;

  const yandexRouteUrl = userLocation 
    ? `https://yandex.uz/maps/?mode=routes&rtext=${userLocation.lat},${userLocation.lng}~${kg.lat},${kg.lng}&rtt=auto`
    : `https://yandex.uz/maps/?mode=routes&rtext=~${kg.lat},${kg.lng}&rtt=auto`;

  // Specific for 21 school logic
  const is21School = kg.obekt_nomi.toLowerCase().includes('21 school');
  const canCheck = isDemo || (distance !== null && distance <= 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft size={16} />
        <span>Назад на главную</span>
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
        <div className="aspect-video bg-gray-200 relative">
          <img src={kg.photo_url} alt={kg.obekt_nomi} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 border border-white/50 shadow-lg">
            {kg.qurilish_yili} год постройки
          </div>
          {is21School && (
            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-lg">
              SPECIAL PROJECT
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{kg.obekt_nomi}</h1>
          <div className="flex items-center text-gray-500 text-sm mb-6">
            <MapPin size={16} className="mr-1" />
            <span>{kg.tuman}, {kg.viloyat}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 rounded-2xl p-4">
              <div className="flex items-center text-green-600 mb-1">
                <School size={16} className="mr-2" />
                <p className="text-[10px] uppercase font-bold tracking-wider">Вместимость</p>
              </div>
              <p className="text-lg font-black text-green-700">{kg.sigimi} мест</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="flex items-center text-blue-600 mb-1">
                <Globe size={16} className="mr-2" />
                <p className="text-[10px] uppercase font-bold tracking-wider">{is21School ? 'Режим работы' : 'Интернет'}</p>
              </div>
              <p className="text-lg font-black text-blue-700">{is21School ? '24/7 КРУГЛОСУТОЧНО' : kg.internetga_ulanish}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-gray-900 flex items-center">
              <div className="w-1 h-4 bg-green-500 rounded-full mr-2" />
              Техническое состояние
            </h3>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <a 
                href={yandexRouteUrl}
                target="_blank"
                className="flex items-center justify-center space-x-3 bg-blue-600 text-white rounded-2xl py-4 font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Navigation size={20} />
                <span>МАРШРУТ</span>
              </a>
              <button 
                onClick={() => alert(`Контакты: ${kg.phone || '+998 71 234 56 78'}`)}
                className="flex items-center justify-center space-x-3 bg-green-50 text-green-700 rounded-2xl py-4 font-black shadow-xl shadow-green-100 hover:bg-green-100 transition-all active:scale-95 border border-green-200"
              >
                <Phone size={20} />
                <span>КОНТАКТЫ</span>
              </button>
              
              <Link 
                href={canCheck ? `/kindergarten/${id}/check` : '#'}
                className={cn(
                  "flex items-center justify-center space-x-3 rounded-2xl py-4 font-black shadow-xl transition-all active:scale-95",
                  canCheck ? "bg-orange-500 text-white shadow-orange-100 hover:bg-orange-600" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                )}
              >
                <Camera size={20} />
                <span>Я НА МЕСТЕ</span>
              </Link>

              {is21School && (
                <a 
                  href="https://21-school.uz"
                  target="_blank"
                  className="flex items-center justify-center space-x-3 bg-white text-gray-800 rounded-2xl py-4 font-black shadow-xl shadow-gray-100 hover:bg-gray-50 transition-all active:scale-95 border border-gray-200 sm:col-span-3"
                >
                  <Globe size={20} />
                  <span>ПЕРЕЙТИ НА САЙТ</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={<CookingPot size={16} />} label="Кухня" value={kg.oshhona_holati} />
              <InfoRow icon={<School size={16} />} label="Зал" value={kg.aktiv_zal_holati} />
              <InfoRow icon={<Zap size={16} />} label="Электричество" value={kg.elektr_kun_davom} />
              <InfoRow icon={<Droplets size={16} />} label="Вода" value={kg.ichimlik_suvi_manbaa} />
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-3 underline decoration-green-500 decoration-2 underline-offset-4">Что было обещано</h3>
          <ul className="space-y-3 mb-8">
            {promises.length > 0 ? promises.map((p) => (
              <li key={p.id} className="flex items-start space-x-3 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-50 shadow-sm">
                <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                <span>{p.title}</span>
              </li>
            )) : (
              <p className="text-sm text-gray-400 italic">Список обязательств уточняется...</p>
            )}
          </ul>
        </div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-6 left-4 right-4 z-40 max-w-3xl mx-auto">
        {!user ? (
          <Link 
            href="/auth/login"
            className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
          >
             Войдите для проверки
          </Link>
        ) : geoError ? (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-4 mb-4">
            <div className="flex items-start space-x-3 mb-4">
              <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-sm text-gray-600">{geoError}</p>
            </div>
            <a 
              href={yandexRouteUrl}
              target="_blank"
              className="w-full flex items-center justify-center space-x-2 py-4 bg-blue-600 text-white rounded-xl font-bold active:scale-95 transition-transform"
            >
              <Navigation size={20} />
              <span>Построить маршрут</span>
            </a>
          </div>
        ) : distance !== null && distance > 100 && !isDemo ? (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-50 p-4 mb-4">
            <p className="text-center text-sm text-gray-500 mb-3">
              Вы находитесь в <b>{(distance/1000).toFixed(1)} км</b> от объекта
            </p>
            <a 
              href={yandexRouteUrl}
              target="_blank"
              className="w-full flex items-center justify-center space-x-2 py-4 bg-gray-900 text-white rounded-xl font-bold active:scale-95 transition-transform"
            >
              <span>Я не на месте → Построить маршрут</span>
            </a>
          </div>
        ) : (distance !== null && distance <= 100) || isDemo ? (
          <Link 
            href={`/kindergarten/${id}/check`}
            className="w-full flex items-center justify-center space-x-2 py-5 bg-green-600 text-white rounded-2xl font-extrabold shadow-xl shadow-green-200 active:scale-95 transition-transform"
          >
            <Camera size={24} />
            <span className="text-lg">Проверить это</span>
          </Link>
        ) : (
          <div className="w-full py-4 bg-white rounded-2xl flex justify-center shadow-lg">
            <Loader2 className="animate-spin text-green-600" size={24} />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="text-gray-400 mr-3">{icon}</div>
      <div className="flex-1">
        <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-700 leading-tight">{value}</p>
      </div>
    </div>
  );
}
