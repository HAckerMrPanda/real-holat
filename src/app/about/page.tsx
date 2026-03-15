export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-8 underline decoration-green-500 decoration-8 underline-offset-8">О проекте «Реал холат»</h1>
      
      <div className="prose prose-green lg:prose-lg text-gray-700 leading-relaxed space-y-6">
        <p className="text-xl font-medium text-gray-900 border-l-4 border-green-500 pl-4 py-2">
          Этот проект создан для того, чтобы голос каждого гражданина стал решающим в контроле за государственными расходами.
        </p>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Почему это важно?</h2>
          <p>
            Часто строительство и ремонт объектов социальной инфраструктуры окутаны тайной. Жители не знают, сколько денег выделено, 
            кто подрядчик и когда завершатся работы. «Реал холат» убирает эти барьеры.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Наши цели:</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Прозрачность:</strong> Полная информация о бюджете и этапах работ в реальном времени.</li>
            <li><strong>Ответственность:</strong> Государственные органы и подрядчики знают, что за ними следит «народное око».</li>
            <li><strong>Вовлечение:</strong> Дать гражданам простой и удобный инструмент для мониторинга прямо со смартфона.</li>
          </ul>
        </section>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Как это работает?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-green-700">1</div>
              <p className="text-sm font-bold">Найдите объект на карте</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-green-700">2</div>
              <p className="text-sm font-bold">Придите на место (гео-проверка)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-green-700">3</div>
              <p className="text-sm font-bold">Сделайте фото и отправьте отзыв</p>
            </div>
          </div>
        </section>

        <p className="text-center text-sm text-gray-400 mt-12 pb-12">
          Разработано специально для хакатона «Реал холат» за 48 часов.
        </p>
      </div>
    </div>
  );
}
