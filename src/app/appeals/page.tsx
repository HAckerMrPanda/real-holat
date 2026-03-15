'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { 
  MessageSquare, 
  ChevronRight, 
  MapPin, 
  Search, 
  AlertCircle,
  User as UserIcon,
  Tag,
  Hash,
  Clock,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

type Ticket = {
  id: string;
  title: string;
  description: string;
  sender_name: string;
  status: 'in_progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  created_at: string;
};

export default function AppealsPage() {
  const { t } = useLanguage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'resolved'>('all');
  const supabase = createClient();

  useEffect(() => {
    async function fetchTickets() {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setTickets(data);
      } else if (error) {
        console.error("Error fetching tickets:", error);
        // Fallback for demo
        setTickets([
          {
            id: 'ANT-001',
            title: 'Ремонт кровли в блоке Б',
            description: 'Требуется срочный ремонт кровли, наблюдаются протечки после дождя.',
            sender_name: 'Алишер У.',
            status: 'in_progress',
            priority: 'high',
            created_at: new Date().toISOString()
          },
          {
            id: 'ANT-002',
            title: 'Благоустройство детской площадки',
            description: 'Установка новых качелей и замена песка в песочницах.',
            sender_name: 'Мадина К.',
            status: 'resolved',
            priority: 'medium',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
          },
          {
             id: 'ANT-003',
             title: 'Плановая проверка сантехники',
             description: 'Замена изношенных смесителей в умывальной комнате.',
             sender_name: 'Инспектор Жасур',
             status: 'in_progress',
             priority: 'low',
             created_at: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
      }
      setLoading(false);
    }
    fetchTickets();
  }, [supabase]);

  const filteredTickets = tickets.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">{t('appeals.title')}</h1>
          <p className="text-gray-500 font-medium">{t('appeals.subtitle')}</p>
        </div>
        
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          {[
            { id: 'all', name: t('appeals.filterAll') },
            { id: 'in_progress', name: t('appeals.filterProcessing') },
            { id: 'resolved', name: t('appeals.filterResolved') },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                filter === tab.id 
                  ? "bg-green-600 text-white shadow-lg shadow-green-100" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 bg-white rounded-3xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full">
              {/* Header: ID and Priority */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                  <Hash size={12} className="text-gray-400" />
                  <span className="text-[11px] font-black text-gray-600 font-mono tracking-tighter">{ticket.id}</span>
                </div>
                <div className={cn(
                  "px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider",
                  getPriorityBadge(ticket.priority)
                )}>
                  {ticket.priority}
                </div>
              </div>

              {/* Title and Description */}
              <div className="flex-grow">
                <h3 className="text-lg font-black text-gray-900 mb-3 group-hover:text-green-600 transition-colors leading-tight">
                  {ticket.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-6">
                  {ticket.description}
                </p>
              </div>

              {/* Sender Info and Date */}
              <div className="pt-6 border-t border-gray-50 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                      <UserIcon size={14} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('profile.inspectorStatus')}</p>
                      <p className="text-xs font-bold text-gray-800">{ticket.sender_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <div className="flex items-center text-[10px] font-bold text-gray-500">
                       <Clock size={10} className="mr-1" />
                       {new Date(ticket.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className={cn(
                  "flex items-center justify-center space-x-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
                  ticket.status === 'resolved' 
                    ? "bg-green-500 text-white shadow-green-100" 
                    : "bg-blue-600 text-white shadow-blue-100"
                )}>
                  {ticket.status === 'resolved' ? <ShieldCheck size={14} /> : <div className="w-2 h-2 rounded-full border-2 border-white animate-pulse" />}
                  <span>{ticket.status === 'resolved' ? t('appeals.statusResolved') : t('appeals.statusProcessing')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 shadow-inner">
          <MessageSquare size={64} className="mx-auto text-gray-100 mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('appeals.noAppeals')}</h2>
          <p className="text-gray-400 max-w-sm mx-auto">{t('appeals.allGood')}</p>
        </div>
      )}
    </div>
  );
}
