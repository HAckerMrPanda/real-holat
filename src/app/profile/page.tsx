'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  User, 
  History, 
  MapPin, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Search, 
  Filter,
  LayoutDashboard,
  Building2,
  X,
  PlusCircle, 
  AlertTriangle, 
  TrendingUp,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  PhoneCall,
  Headset,
  Hash,
  ShoppingBag,
  Gift,
  Zap,
  Tag as TagIcon,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';


// Shadcn UI components simulation using raw Tailwind
export default function ProfilePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'select' | 'appeals' | 'marketplace'>('dashboard');
  const { searchQuery, setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [objects, setObjects] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [spentXP, setSpentXP] = useState(0);
  const [toast, setToast] = useState<{message: string, show: boolean}>({ message: '', show: false });
  
  // Create Appeal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appealForm, setAppealForm] = useState({
    title: '',
    description: '',
    sender_name: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters for Select Object
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterTuman, setFilterTuman] = useState('all');

  const supabase = createClient();
  const router = useRouter();

  // Debounce local search in Profile
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  const filteredObjects = useMemo(() => {
    return objects.filter(obj => {
      const searchTerms = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchTerms || 
        obj.obekt_nomi.toLowerCase().includes(searchTerms) ||
        obj.viloyat.toLowerCase().includes(searchTerms) ||
        obj.tuman.toLowerCase().includes(searchTerms);
      
      const matchesRegion = filterRegion === 'all' || obj.viloyat === filterRegion;
      const matchesTuman = filterTuman === 'all' || obj.tuman === filterTuman;
      
      return matchesSearch && matchesRegion && matchesTuman;
    });
  }, [objects, searchQuery, filterRegion, filterTuman]);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setProfile(user);
      
      // Fetch objects for Select tab
      const { data: kgData } = await supabase.from('objects').select('*');
      setObjects(kgData || []);

      // Fetch reports for History tab
      const { data: reportData } = await supabase
        .from('report')
        .select('*, objects(obekt_nomi, tuman)')
        .order('created_at', { ascending: false });
      setReports(reportData || []);

      // Fetch user's tickets
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('*')
        .eq('sender_name', user.user_metadata.first_name + ' ' + user.user_metadata.last_name)
        .order('created_at', { ascending: false });
      setUserTickets(ticketData || []);
      
      // Fetch spent XP
      const { data: profileData } = await supabase.from('profiles').select('spent_xp').eq('id', user.id).single();
      if (profileData?.spent_xp) {
        setSpentXP(profileData.spent_xp);
      }

      setLoading(false);
    }
    getUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleRedeem = async (cost: number, name: string) => {
    const balance = (reports.length * 100) - spentXP;
    if (balance >= cost) {
      setSpentXP(prev => prev + cost);
      setToast({ message: `${t('appeals.redeemSuccess')} (${name})`, show: true });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      
      // Update DB (Simulated)
      await supabase.from('profiles').update({ spent_xp: spentXP + cost }).eq('id', profile.id);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-green-600" size={48} /></div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {profile.user_metadata.first_name?.[0] || 'Z'}
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900">{profile.user_metadata.first_name || 'Zarina'} {profile.user_metadata.last_name || 'Luxmanova'}</h1>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      {/* Custom Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {[
          { id: 'dashboard', name: t('profile.dashboard'), icon: <TrendingUp size={16} /> },
          { id: 'history', name: t('profile.history'), icon: <History size={16} /> },
          { id: 'select', name: t('profile.select'), icon: <PlusCircle size={16} /> },
          { id: 'appeals', name: t('nav.appeals'), icon: <MessageSquare size={16} /> },
          { id: 'marketplace', name: t('profile.marketplace'), icon: <ShoppingBag size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-600 rounded-3xl p-6 text-white shadow-lg shadow-green-100">
              <p className="text-xs font-bold opacity-80 uppercase mb-1">{t('profile.totalChecks')}</p>
              <h2 className="text-3xl font-black">{reports.length}</h2>
            </div>
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-100 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold opacity-80 uppercase mb-1">{t('home.bonuses')}</p>
                <h2 className="text-3xl font-black">{reports.length * 100} <span className="text-sm font-bold opacity-60">XP</span></h2>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-blue-600 bg-white/20" />)}
                </div>
                <button 
                  onClick={() => setActiveTab('marketplace')}
                  className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-all"
                >
                  {t('profile.marketplace')}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">{t('profile.inspectorStatus')}</h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-3/4" />
              </div>
              <span className="text-sm font-black text-gray-400">75%</span>
            </div>
            <p className="text-sm text-gray-500">{t('profile.nextLevel')}</p>
          </div>
        </div>
      )}

      {/* History View */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {reports.length > 0 ? reports.map(report => (
            <div key={report.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900">{report.objects?.obekt_nomi}</h4>
                  <p className="text-[10px] text-gray-400">{report.objects?.tuman}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  report.status === 'good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {report.status === 'good' ? 'В норме' : 'Нарушение'}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 italic mb-3">
                {typeof report.description === 'string' && report.description.startsWith('{') 
                  ? 'Все пункты проверены' 
                  : report.description}
              </p>
              <div className="flex items-center text-[10px] text-gray-400">
                <History size={12} className="mr-1" />
                {new Date(report.created_at).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-gray-400">
              <History size={48} className="mx-auto mb-4 opacity-20" />
              <p>{t('profile.noChecks')}</p>
            </div>
          )}
        </div>
      )}

      {/* Select Object View */}
      {activeTab === 'select' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder={t('profile.searchObject')}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="all">{t('profile.allRegions')}</option>
                <option value="Ташкент">Ташкент</option>
              </select>
              {(filterRegion === 'Ташкент' || filterRegion === 'all') && (
                <select
                  className="px-4 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={filterTuman}
                  onChange={(e) => setFilterTuman(e.target.value)}
                >
                  <option value="all">{t('profile.allDistricts')}</option>
                  <option value="Мирзо Улугбекский">Мирзо Улугбекский</option>
                  <option value="Юнусабадский">Юнусабадский</option>
                  <option value="Чиланзарский">Чиланзарский</option>
                </select>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : filteredObjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredObjects.map((obj) => (
                <Link
                  key={obj.id}
                  href={`/kindergarten/${obj.id}`}
                  className="flex flex-col p-4 bg-white rounded-3xl border border-gray-50 shadow-sm hover:shadow-xl hover:border-green-100 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-green-50 rounded-xl">
                      <Building2 className="text-green-600" size={20} />
                    </div>
                    <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-gray-500">
                      {obj.sigimi} {t('profile.places')}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-1">{obj.obekt_nomi}</h3>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center text-[10px] font-bold text-gray-400">
                      <MapPin size={12} className="mr-1" />
                      <span>{obj.tuman}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-green-600 transition-all group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <Search size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">{t('common.nothingFound')}</h3>
              <p className="text-sm text-gray-400 mb-6">{t('common.nothingFound')}</p>
              <button
                onClick={() => {
                  setLocalSearch('');
                  setSearchQuery('');
                  setFilterRegion('all');
                  setFilterTuman('all');
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-green-100 active:scale-95 transition-all"
              >
                {t('common.resetAll')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Marketplace View */}
      {activeTab === 'marketplace' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{t('profile.marketplace')}</h3>
                <p className="text-sm text-gray-500 font-medium">{t('profile.nextLevel')}</p>
              </div>
              <div className="bg-yellow-50 px-6 py-4 rounded-3xl border border-yellow-100 flex items-center space-x-3 shadow-sm">
                <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-100">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Balance</p>
                  <p className="text-xl font-black text-gray-900">{(reports.length * 100) - spentXP} <span className="text-xs font-bold text-gray-400">XP</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                { 
                  id: 'discount', 
                  name: t('profile.rewardDiscounts'), 
                  desc: t('profile.rewardDiscountsDesc'), 
                  cost: 500, 
                  icon: <TagIcon className="text-blue-600" size={24} />, 
                  color: 'bg-blue-50' 
                },
                { 
                  id: 'autoloan', 
                  name: t('profile.rewardAutoLoan'), 
                  desc: t('profile.rewardAutoLoanDesc'), 
                  cost: 3500, 
                  icon: <Building2 className="text-orange-600" size={24} />, 
                  color: 'bg-orange-50' 
                },
                { 
                  id: 'mortgage', 
                  name: t('profile.rewardMortgage'), 
                  desc: t('profile.rewardMortgageDesc'), 
                  cost: 5000, 
                  icon: <Building2 className="text-purple-600" size={24} />, 
                  color: 'bg-purple-50' 
                },
                { 
                  id: 'debt', 
                  name: t('profile.rewardDebt'), 
                  desc: t('profile.rewardDebtDesc'), 
                  cost: 10000, 
                  icon: <Gift className="text-red-600" size={24} />, 
                  color: 'bg-red-50' 
                },
              ].map((item) => {
                const canAfford = ((reports.length * 100) - spentXP) >= item.cost;
                return (
                  <div key={item.id} className={cn(
                    "bg-white rounded-[32px] p-6 border border-gray-100 transition-all group flex flex-col h-full",
                    canAfford ? "hover:border-green-200 hover:shadow-xl hover:-translate-y-1 cursor-default" : "opacity-50 grayscale bg-gray-50/50"
                  )}>
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", item.color)}>
                      {item.icon}
                    </div>
                    <h4 className="text-sm font-black text-gray-900 mb-2 leading-tight uppercase">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-6 flex-grow">{item.desc}</p>
                    
                    <div className="pt-6 border-t border-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-gray-900">{item.cost} XP</span>
                      </div>
                      <button 
                        disabled={!canAfford}
                        onClick={() => handleRedeem(item.cost, item.name)}
                        className={cn(
                          "w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95",
                          canAfford 
                            ? "bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700" 
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        {canAfford ? t('profile.redeem') : t('profile.insufficientXP')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-md text-center md:text-left">
                   <div className="inline-block px-4 py-1.5 bg-green-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">VIP Reward</div>
                   <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Удаленный контроль <br/> за строительством</h3>
                   <p className="text-sm text-gray-400 font-medium leading-relaxed">Наберите 15,000 XP и получите доступ к Live-камерам на всех объектах в реальном времени.</p>
                </div>
                <div className="w-full md:w-auto">
                   <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 text-center">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-2">Progress to Unlock</p>
                      <div className="text-4xl font-black mb-4">{(((reports.length * 100) - spentXP) / 15000 * 100).toFixed(1)}%</div>
                      <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-green-500" style={{ width: `${((reports.length * 100) - spentXP) / 15000 * 100}%` }} />
                      </div>
                   </div>
                </div>
             </div>
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-600 rounded-full blur-[120px] opacity-20" />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="bg-gray-900 text-white px-8 py-4 rounded-[24px] shadow-2xl flex items-center space-x-4 border border-white/10 backdrop-blur-xl">
             <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                <ShieldCheck size={20} className="text-white" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-0.5">Activation Success</p>
                <p className="text-sm font-bold">{toast.message}</p>
             </div>
             <button onClick={() => setToast({ ...toast, show: false })} className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X size={16} className="text-gray-400" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
}
