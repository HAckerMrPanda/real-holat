'use client';

const news = [
  {
    id: 1,
    title: 'Запущен проект общественного контроля «Реал холат»',
    date: '15 марта 2026',
    category: 'Событие',
    image: 'https://images.unsplash.com/photo-1588075592425-d4e5114704e6?auto=format&fit=crop&q=80&w=800',
    excerpt: 'Сегодня в Ташкенте презентовали новую платформу для мониторинга строительства детских садов...',
  },
  {
    id: 2,
    title: 'Статистика проверок за первую неделю',
    date: '14 марта 2026',
    category: 'Аналитика',
    excerpt: 'Более 500 родителей уже зарегистрировались в системе и провели свои первые инспекции объектов...',
  },
  {
    id: 3,
    title: 'Новый детский сад в Чиланзарском районе',
    date: '12 марта 2026',
    category: 'Объекты',
    excerpt: 'Строительство объекта №456 перешло в завершающую стадию. Установлено современное оборудование...',
  },
];

export default function NewsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Новости проекта</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <article key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            {item.image && (
              <div className="aspect-[16/9] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">{item.date}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-3">
                {item.excerpt}
              </p>
              <button className="mt-4 text-xs font-bold text-gray-900 border-b-2 border-green-500 pb-0.5 hover:text-green-600 transition-colors">
                Читать далее
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
