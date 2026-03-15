'use client';

import { Trophy, Medal, Star, User } from 'lucide-react';

const inspectors = [
  { id: 1, name: 'Алишер Каримов', count: 145, positive: 92, rank: 1 },
  { id: 2, name: 'Зульфия Рахимова', count: 128, positive: 88, rank: 2 },
  { id: 3, name: 'Жамшид Усманов', count: 112, positive: 85, rank: 3 },
  { id: 4, name: 'Нигора Саидова', count: 98, positive: 91, rank: 4 },
  { id: 5, name: 'Ойбек Назаров', count: 87, positive: 82, rank: 5 },
  { id: 6, name: 'Малика Ахмедова', count: 76, positive: 89, rank: 6 },
  { id: 7, name: 'Санжар Эргашев', count: 65, positive: 78, rank: 7 },
  { id: 8, name: 'Дилдора Хакимова', count: 62, positive: 92, rank: 8 },
  { id: 9, name: 'Ботир Парпиев', count: 58, positive: 75, rank: 9 },
  { id: 10, name: 'Гульнора Кадырова', count: 55, positive: 84, rank: 10 },
];

export default function RatingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Trophy className="text-yellow-500" size={32} />
        <h1 className="text-3xl font-black text-gray-900">Рейтинг инспекторов</h1>
      </div>

      <p className="text-gray-500 mb-8 leading-relaxed">
        Топ-10 самых активных граждан, которые следят за качеством строительства и ремонта объектов в своем районе. 
        Общественный контроль — залог прозрачности!
      </p>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400">
              <tr>
                <th className="px-6 py-4">Место</th>
                <th className="px-6 py-4">Инспектор</th>
                <th className="px-6 py-4 text-center">Проверки</th>
                <th className="px-6 py-4 text-center text-green-600">% Положительных</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inspectors.map((ins, idx) => (
                <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-5">
                    {idx === 0 && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">1 место</span>}
                    {idx === 1 && <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">2 место</span>}
                    {idx === 2 && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">3 место</span>}
                    {idx > 2 && <span className="text-gray-400 font-bold ml-4">#{ins.rank}</span>}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-gray-900">{ins.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-black text-gray-700">{ins.count}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                       {ins.positive}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
