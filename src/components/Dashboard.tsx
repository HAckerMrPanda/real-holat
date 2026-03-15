'use client';

import { CheckCircle2, Construction, Clock } from 'lucide-react';

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  verified: number;
}

export default function Dashboard({ stats }: { stats: Stats }) {
  const cards = [
    { label: 'Всего объектов', value: stats.total, icon: <Clock className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Завершено', value: stats.completed, icon: <CheckCircle2 className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'В процессе', value: stats.inProgress, icon: <Construction className="text-orange-500" />, bg: 'bg-orange-50' },
    { label: 'Проверено гражданами', value: stats.verified, icon: <CheckCircle2 className="text-purple-500" />, bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} p-4 rounded-xl shadow-sm border border-gray-100`}>
          <div className="flex items-center justify-between mb-2">
            {card.icon}
            <span className="text-2xl font-bold text-gray-800">{card.value}</span>
          </div>
          <p className="text-xs font-medium text-gray-600">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
