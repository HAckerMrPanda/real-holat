'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dataByYear = [
  { year: '2022', amount: 4500000000 },
  { year: '2023', amount: 6200000000 },
  { year: '2024', amount: 8100000000 },
  { year: '2025', amount: 3400000000 },
];

const dataByType = [
  { name: 'Строительство', value: 55 },
  { name: 'Капитальный ремонт', value: 30 },
  { name: 'Оснащение', value: 15 },
];

const COLORS = ['#16a34a', '#2563eb', '#d97706'];

export default function FinancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Финансовая аналитика</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6">Распределение бюджета по годам (сум)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByYear}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1e9).toFixed(1)} млрд`} />
                <Tooltip 
                   formatter={(value: any) => `${value.toLocaleString()} сум`}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="amount" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6">Целевое использование (в %)</h2>
          <div className="h-[300px] w-full flex flex-col sm:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
              {dataByType.map((item, i) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-medium text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">Прозрачный бюджет</h2>
        <p className="max-w-2xl opacity-90 leading-relaxed mb-6">
          Мы отслеживаем каждую копейку, выделенную государством на благо наших детей. 
          Данные автоматически синхронизируются с казначейством и проверяются гражданами на местах.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
            <p className="text-xs uppercase font-bold opacity-70 mb-1">Всего выделено</p>
            <p className="text-xl font-black">22.2 млрд / сум</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
            <p className="text-xs uppercase font-bold opacity-70 mb-1">Освоено</p>
            <p className="text-xl font-black text-green-200">18.5 млрд / сум</p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur">
            <p className="text-xs uppercase font-bold opacity-70 mb-1">Сэкономлено</p>
            <p className="text-xl font-black text-blue-200">1.2 млрд / сум</p>
          </div>
        </div>
      </div>
    </div>
  );
}
