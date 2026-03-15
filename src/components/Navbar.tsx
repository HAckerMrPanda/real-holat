'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import { User, LogOut, Menu, X, Home, Info, BarChart3, AlertTriangle, Star, Newspaper, Search, MessageSquare, Globe, ShoppingBag } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useLanguage } from '@/context/LanguageContext';

const menuItems = (t: any) => [
  { name: t('nav.home'), href: '/', icon: <Home size={18} /> },
  { name: t('nav.news'), href: '/news', icon: <Newspaper size={18} /> },
  { name: t('nav.finance'), href: '/finance', icon: <BarChart3 size={18} /> },
  { name: t('nav.violations'), href: '/violations', icon: <AlertTriangle size={18} /> },
  { name: t('nav.rating'), href: '/rating', icon: <Star size={18} /> },
  { name: t('nav.appeals'), href: '/appeals', icon: <MessageSquare size={18} /> },
  { name: t('nav.procurements'), href: '/procurements', icon: <ShoppingBag size={18} /> },
  { name: t('nav.about'), href: '/about', icon: <Info size={18} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const { searchQuery, setSearchQuery } = useSearch();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-green-100">
                <span className="text-white font-black text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-gray-900 tracking-tighter leading-none">РЕАЛ ХОЛАТ</span>
                <span className="text-[8px] font-bold text-green-600 tracking-widest uppercase opacity-80">Monitoring</span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Поиск по названию, городу или району..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-2xl leading-5 bg-gray-50 text-xs font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all sm:text-sm"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {menuItems(t).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2",
                  pathname === item.href 
                    ? "text-green-600 bg-green-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3 ml-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 mr-2">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-2 py-1 rounded-lg text-[10px] font-black transition-all uppercase",
                    language === lang ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/profile" 
                  className="flex items-center space-x-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl text-gray-900 font-bold hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-[10px]">
                    {user.user_metadata.first_name?.[0] || 'Z'}
                  </div>
                  <span className="text-xs">{user.user_metadata.first_name || 'Zarina'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Выйти"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
                >
                  {t('nav.start')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-900 p-2 bg-gray-50 rounded-xl"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-white pt-16 flex flex-col h-screen overflow-y-auto">
          <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600" size={18} />
              <input
                type="text"
                placeholder="Поиск объектов..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="px-6 py-8 space-y-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">{t('nav.navigation')}</h3>
              <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                {(['uz', 'ru', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase",
                      language === lang ? "bg-white text-green-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            {menuItems(t).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-4 px-4 py-4 rounded-2xl text-base font-bold transition-all",
                  pathname === item.href 
                    ? "bg-green-50 text-green-600" 
                    : "text-gray-500 hover:bg-gray-50"
                )}
                onClick={() => setIsOpen(false)}
              >
                <div className={cn("p-2 rounded-xl", pathname === item.href ? "bg-green-100" : "bg-gray-100")}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-8 border-t border-gray-100 mt-8 space-y-4">
              {user ? (
                <>
                  <Link 
                    href="/profile" 
                    className="flex items-center space-x-4 w-full px-4 py-4 bg-gray-50 rounded-2xl text-gray-900 font-bold"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-black">
                      {user.user_metadata.first_name?.[0] || 'Z'}
                    </div>
                    <div>
                      <p>{user.user_metadata.first_name || 'Zarina'}</p>
                      <p className="text-[10px] text-gray-400 font-medium tracking-tight">Перейти в профиль</p>
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-4 w-full px-4 py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <div className="p-2 bg-red-50 rounded-xl">
                      <LogOut size={20} />
                    </div>
                    <span>Выйти из аккаунта</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Link 
                    href="/auth/login" 
                    className="flex items-center justify-center py-4 bg-gray-50 text-gray-900 font-bold rounded-2xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Вход
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="flex items-center justify-center py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="mt-auto p-6 bg-gray-50 border-t border-gray-100">
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">РЕАЛ ХОЛАТ Мониторинг v1.0</p>
          </div>
        </div>
      )}
    </nav>
  );
}
