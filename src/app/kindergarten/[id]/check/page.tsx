'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { 
  Camera, 
  MapPin, 
  ChevronLeft, 
  Navigation, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import { getDistance } from '@/lib/utils';
import { districtCoords } from '@/components/KindergartenCard';

const CHECKLIST_ITEMS = [
  { id: 'soap', category: 'Санитария', label: 'Диспенсеры для мыла заполнены' },
  { id: 'paper', category: 'Санитария', label: 'Есть туалетная бумага' },
  { id: 'toilet_lids', category: 'Санитария', label: 'Крышки унитазов целые' },
  { id: 'clean_walls', category: 'Санитария', label: 'Пол и стены чистые' },
  { id: 'stove', category: 'Кухня', label: 'Плита работает' },
  { id: 'fridge', category: 'Кухня', label: 'Холодильник работает' },
  { id: 'kitchen_water', category: 'Кухня', label: 'Вода для мытья есть' },
  { id: 'mats', category: 'Зал', label: 'Коврики целые' },
  { id: 'toys', category: 'Зал', label: 'Игрушки в порядке' },
  { id: 'lights', category: 'Зал', label: 'Освещение работает' },
  { id: 'electricity', category: 'Общее', label: 'Свет есть весь день' },
  { id: 'water', category: 'Общее', label: 'Питьевая вода доступна' },
  { id: 'internet', category: 'Общее', label: 'Интернет работает' },
  { id: 'walls', category: 'Общее', label: 'Стены покрашены' },
  { id: 'windows', category: 'Общее', label: 'Окна целые' },
];

export default function CheckObjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [kg, setKg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  
  // Checklist State
  const [responses, setResponses] = useState<Record<string, { status: boolean, comment: string }>>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'geo' | 'checklist' | 'success'>('geo');

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('objects').select('*').eq('id', id).single();
      if (data) {
        const coords = districtCoords[data.tuman] || [41.311081, 69.240562];
        setKg({ ...data, lat: coords[0], lng: coords[1] });
      }
      setLoading(false);
    }
    fetchData();

    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }

    const demo = localStorage.getItem('demo_mode') === 'true';
    setIsDemo(demo);
  }, [id, supabase]);

  useEffect(() => {
    if (userLocation && kg) {
      const d = getDistance(userLocation.lat, userLocation.lng, kg.lat, kg.lng);
      setDistance(d);
    }
  }, [userLocation, kg]);

  const handleCheckChange = (itemId: string, status: boolean) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], status }
    }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], comment }
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhoto(e.target.files[0]);
      setPhotoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const submitCheck = async () => {
    setIsSubmitting(true);
    let finalPhotoUrl = '';

    if (photo) {
      const fileName = `${id}_${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('inspections')
        .upload(fileName, photo);
      
      if (uploadData) {
        const { data: { publicUrl } } = supabase.storage.from('inspections').getPublicUrl(fileName);
        finalPhotoUrl = publicUrl;
      }
    }

    const badCount = Object.values(responses).filter(r => r.status === false).length;
    const status = badCount > 3 ? 'bad' : 'good';

    const { error } = await supabase.from('report').insert({
      object_id: id,
      description: JSON.stringify(responses),
      photo_url: finalPhotoUrl || `https://picsum.photos/id/${(Number(id) % 200) + 100}/800/600`,
      status: status
    });

    if (!error) {
      setStep('success');
    } else {
      alert('Ошибка при сохранении: ' + error.message);
    }
    setIsSubmitting(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-600" size={48} /></div>;

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
          <CheckCircle2 className="text-green-600 mx-auto mb-6" size={80} />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Проверка отправлена!</h1>
          <p className="text-gray-500 mb-8">Спасибо за вашу активность, Zarina! Ваши данные помогут сделать детские сады лучше.</p>
          <button 
            onClick={() => router.push('/profile')}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            Вернуться в кабинет
          </button>
        </div>
      </div>
    );
  }

  const yandexUrl = `https://yandex.uz/maps/?mode=routes&rtext=~${kg?.lat},${kg?.lng}&rtt=auto`;
  const canStart = isDemo || (distance !== null && distance <= 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      <button onClick={() => router.back()} className="flex items-center text-gray-500 mb-6 font-bold hover:text-gray-900">
        <ChevronLeft size={20} className="mr-1" />
        Назад
      </button>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <h1 className="text-xl font-black text-gray-900 mb-1">{kg?.obekt_nomi}</h1>
        <p className="text-sm text-gray-400 mb-4">{kg?.tuman}, {kg?.viloyat}</p>
        
        {step === 'geo' && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center">
              <MapPin className={`${canStart ? 'text-green-500' : 'text-blue-500'} mb-4`} size={48} />
              <p className="font-bold text-gray-700 mb-1">
                {distance !== null ? `Вы в ${(distance/1000).toFixed(2)} км от объекта` : 'Определяем расстояние...'}
              </p>
              <p className="text-xs text-gray-500">Для начала проверки нужно быть в пределах 100 метров.</p>
            </div>

            {canStart ? (
              <button 
                onClick={() => setStep('checklist')}
                className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-100 active:scale-95 transition-transform"
              >
                Начать проверку
              </button>
            ) : (
              <a 
                href={yandexUrl}
                target="_blank"
                className="w-full flex items-center justify-center space-x-2 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-transform"
              >
                <Navigation size={24} />
                <span>Построить маршрут</span>
              </a>
            )}
          </div>
        )}

        {step === 'checklist' && (
          <div className="space-y-8">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-start space-x-3">
              <AlertCircle className="text-orange-500 flex-shrink-0" size={18} />
              <p className="text-xs text-orange-700 leading-tight">Пожалуйста, будьте внимательны. Ваши фотографии и данные будут проверены модераторами.</p>
            </div>

            <div className="space-y-6">
              {CHECKLIST_ITEMS.map((item) => (
                <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">{item.category}</p>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{item.label}</p>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => handleCheckChange(item.id, true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${responses[item.id]?.status === true ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                      >
                        ✅
                      </button>
                      <button 
                        onClick={() => handleCheckChange(item.id, false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${responses[item.id]?.status === false ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400'}`}
                      >
                        ❌
                      </button>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Добавить комментарий..."
                    onChange={(e) => handleCommentChange(item.id, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-gray-900 flex items-center">
                <Camera className="mr-2 text-green-600" size={20} />
                Основное фото
              </h3>
              <div className="relative aspect-video bg-gray-100 rounded-3xl overflow-hidden border-2 border-dashed border-gray-200 group">
                {photoUrl ? (
                  <>
                    <img src={photoUrl} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setPhoto(null); setPhotoUrl(null); }}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <ImageIcon className="text-gray-300 mb-2" size={48} />
                    <span className="text-xs font-bold text-gray-400">Нажмите, чтобы сделать фото</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
                  </label>
                )}
              </div>
            </div>

            <button 
              onClick={submitCheck}
              disabled={isSubmitting}
              className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-green-100 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'Отправить отчёт'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
