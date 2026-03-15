'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { 
  ShoppingBag, 
  MapPin, 
  Package, 
  Clock, 
  Building2, 
  ArrowRight, 
  X, 
  CheckCircle, 
  Loader2,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProcurementsPage() {
  const { t } = useLanguage();
  const supabase = createClient();
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    manufacturer_name: '',
    offered_price: '',
    delivery_days: '',
    comments: ''
  });

  useEffect(() => {
    async function fetchLots() {
      // Fetching from 'procurements' table
      const { data, error } = await supabase
        .from('procurements')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (!data || data.length === 0) {
        // Fallback demo data if table is empty
        setLots([
          {
            id: 'demo-1',
            title: 'Поставка парт для начальных классов',
            description: 'Парты эргономичные, регулируемые по высоте. Материал - бук. Соответствие ГОСТ.',
            category: 'Мебель',
            quantity: 120,
            unit: 'шт.',
            location: 'Школа №154, Мирзо-Улугбекский р-н'
          },
          {
            id: 'demo-2',
            title: 'Оснащение пищеблока (холодильники)',
            description: 'Промышленные холодильные шкафы для хранения молочных продуктов.',
            category: 'Оборудование',
            quantity: 5,
            unit: 'комплект',
            location: 'Детский сад №42, Чиланзар'
          },
          {
            id: 'demo-3',
            title: 'Спортивный инвентарь (мячи)',
            description: 'Футбольные и волейбольные мячи для школьных спортзалов.',
            category: 'Спорт',
            quantity: 50,
            unit: 'шт.',
            location: 'Лицей им. Аль-Хорезми'
          }
        ]);
      } else {
        setLots(data);
      }
      setLoading(false);
    }
    fetchLots();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot) return;
    
    setIsSubmitting(true);
    const { error } = await supabase.from('procurement_offers').insert({
      procurement_id: selectedLot.id,
      manufacturer_name: formData.manufacturer_name,
      offered_price: parseFloat(formData.offered_price),
      delivery_days: parseInt(formData.delivery_days),
      comments: formData.comments
    });

    if (!error) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedLot(null);
        setFormData({ manufacturer_name: '', offered_price: '', delivery_days: '', comments: '' });
      }, 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{t('procurements.title')}</h1>
            <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-widest">{t('procurements.subtitle')}</p>
          </div>
        </div>
        
        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                    <TrendingUp size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Активные лоты</p>
                   <p className="text-xl font-black text-gray-900">{lots.length}</p>
                </div>
            </div>
            <div className="bg-blue-600 p-6 rounded-[32px] text-white shadow-xl shadow-blue-100 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                    <ShieldCheck size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-none mb-1">Проверено</p>
                   <p className="text-xl font-black">100% Верификация</p>
                </div>
            </div>
            <div className="bg-gray-900 p-6 rounded-[32px] text-white flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400">
                    <Building2 size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Производителей</p>
                   <p className="text-xl font-black">84 Компании</p>
                </div>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lots.length > 0 ? lots.map((lot) => (
            <div 
              key={lot.id} 
              className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all group flex flex-col h-full bg-gradient-to-b from-white to-gray-50/30"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Package size={28} />
                 </div>
                 <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                   {lot.category || 'Общее'}
                 </span>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight uppercase group-hover:text-blue-600 transition-colors line-clamp-2">
                {lot.title}
              </h3>
              
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-3">
                {lot.description}
              </p>
              
              <div className="space-y-4 mb-4 mt-auto">
                <div className="flex items-center space-x-3 text-gray-600 bg-white p-4 rounded-2xl border border-gray-50">
                  <Package size={18} className="text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">{t('procurements.quantity')}</p>
                    <p className="text-sm font-black text-gray-900">{lot.quantity} {lot.unit}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-600 bg-white p-4 rounded-2xl border border-gray-50">
                  <MapPin size={18} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">{t('procurements.location')}</p>
                    <p className="text-sm font-black text-gray-900 truncate max-w-[200px]">{lot.location || 'Ташкент'}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedLot(lot)}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-gray-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest group-hover:bg-blue-600 transition-all shadow-xl shadow-gray-100 group-hover:shadow-blue-100"
              >
                <span>{t('procurements.sendOffer')}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest">{t('procurements.noLots')}</p>
            </div>
          )}
        </div>
      )}

      {/* Offer Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setSelectedLot(null)} />
          <div className="relative bg-white w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {showSuccess ? (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">{t('procurements.success')}</h3>
                <p className="text-gray-500 font-medium">Ваше предложение передано заказчику. Ожидайте уведомления.</p>
              </div>
            ) : (
              <>
                <div className="px-10 py-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{t('procurements.modalTitle')}</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1 uppercase truncate max-w-[300px]">{selectedLot.title}</p>
                  </div>
                  <button onClick={() => setSelectedLot(null)} className="p-2 hover:bg-white rounded-xl transition-colors">
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>
                
                <form className="p-10 space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">{t('procurements.companyName')}</label>
                    <div className="relative group">
                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input 
                            required
                            type="text" 
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                            placeholder="ООО 'Производитель'"
                            value={formData.manufacturer_name}
                            onChange={(e) => setFormData({...formData, manufacturer_name: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">{t('procurements.totalPrice')}</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="0.00"
                        value={formData.offered_price}
                        onChange={(e) => setFormData({...formData, offered_price: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">{t('procurements.deliveryDays')}</label>
                      <input 
                        required
                        type="number" 
                        className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all"
                        placeholder="7"
                        value={formData.delivery_days}
                        onChange={(e) => setFormData({...formData, delivery_days: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">{t('procurements.comments')}</label>
                    <textarea 
                      rows={3}
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-black focus:bg-white focus:border-blue-500 outline-none transition-all resize-none"
                      placeholder="Дополнительные условия или детали..."
                      value={formData.comments}
                      onChange={(e) => setFormData({...formData, comments: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white rounded-3xl py-5 font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (
                      <>
                        <span>{t('procurements.submit')}</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
