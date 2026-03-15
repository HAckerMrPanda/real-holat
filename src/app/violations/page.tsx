'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import KindergartenCard, { districtCoords } from '@/components/KindergartenCard';
import { AlertTriangle, Clock, Loader2, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ViolationsPage() {
  const [kgs, setKgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchViolations() {
      // Find objects that have 'bad' checks
      const { data: checkData } = await supabase
        .from('report')
        .select('kindergarten_id, comment, created_at')
        .eq('status', 'bad');

      if (checkData && checkData.length > 0) {
        const ids = [...new Set(checkData.map(c => c.kindergarten_id))];
        
        const { data: kgData } = await supabase
          .from('objects')
          .select('*')
          .in('id', ids);

        if (kgData) {
          const enriched = kgData.map(k => {
            const checks = checkData.filter(c => c.kindergarten_id === k.id);
            const coords = districtCoords[k.tuman] || [41.311081, 69.240562];
            return {
              ...k,
              lat: coords[0],
              lng: coords[1],
              violations: checks,
              photo_url: `https://picsum.photos/id/${((k.id as any) % 200) + 100}/800/600`,
              checks_positive: 0,
              checks_total: 10 // For the card UI
            };
          });
          setKgs(enriched);
        }
      }
      setLoading(false);
    }
    fetchViolations();
  }, [supabase]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-red-100 p-3 rounded-2xl">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Объекты с нарушениями</h1>
          <p className="text-sm text-gray-500">На контроле общественного инспектора</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
          <p className="text-gray-500 font-medium">Загружаем список нарушений...</p>
        </div>
      ) : kgs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kgs.map(kg => (
            <div key={kg.id} className="relative">
              <KindergartenCard kg={kg} />
              <div className="mt-2 bg-red-50 rounded-2xl p-4 border border-red-100">
                <div className="flex items-center text-red-700 font-bold text-xs mb-3">
                  <Clock size={14} className="mr-2" />
                  Срок устранения: 30 дней
                </div>
                <div className="space-y-3">
                  {kg.violations.map((v: any, idx: number) => (
                    <div key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-red-50">
                      <p className="text-xs text-gray-700 font-medium italic">"{v.comment}"</p>
                      <p className="text-[10px] text-gray-400 mt-2">
                        Зафиксировано: {new Date(v.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
                <Link 
                  href={`/kindergarten/${kg.id}`}
                  className="mt-4 w-full flex items-center justify-center space-x-2 py-2 bg-white text-red-600 rounded-xl text-xs font-bold border border-red-200 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <span>Детали нарушения</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
          <CheckCircle2 className="mx-auto text-green-200 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Нарушений не обнаружено</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Все объекты строительства на текущий момент соответствуют нормам качества.</p>
        </div>
      )}
    </div>
  );
}
