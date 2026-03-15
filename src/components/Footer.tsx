'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-green-100">
                <span className="text-white font-black text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900 tracking-tighter leading-none">РЕАЛ ХОЛАТ</span>
                <span className="text-[8px] font-bold text-green-600 tracking-widest uppercase opacity-80">Monitoring</span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Инновационная платформа для прозрачного мониторинга состояния и прогресса строительства детских дошкольных учреждений Ташкента.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Проект</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors">О нас</Link></li>
              <li><Link href="/finance" className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors">Прозрачность</Link></li>
              <li><Link href="/news" className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors">Новости</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Поддержка</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors">Частые вопросы</Link></li>
              <li><Link href="/report-issue" className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors">Сообщить о проблеме</Link></li>
              <li><Link href="/contacts" className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors">Контакты</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <p>© 2026 РЕАЛ ХОЛАТ. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</p>
          <div className="flex space-x-6 text-gray-300 hover:text-gray-400">
            <Link href="/privacy">КОНФИДЕНЦИАЛЬНОСТЬ</Link>
            <Link href="/terms">ОФЕРТА</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
