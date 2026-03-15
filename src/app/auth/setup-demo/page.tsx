'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SetupDemoPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const setupZarina = async () => {
    setStatus('loading');

    // 1. Sign Up in Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'zarina@mail.ru',
      password: '21school',
      options: {
        data: {
          first_name: 'Zarina',
          last_name: 'Luxmanova',
          role: 'inspector'
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        // User exists, just continue to profile sync
        console.log('User already exists, checking session...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // If not logged in, we can't sync profile but we can tell the user it's okay
          setStatus('success');
          return;
        }
      } else {
        setError(authError.message);
        setStatus('error');
        return;
      }
    }

    if (authData.user) {
      // 2. Insert into profiles (using the schema we built earlier)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          first_name: 'Zarina',
          last_name: 'Luxmanova',
          phone: '+998901234567'
        });

      if (profileError) {
        console.warn('Profile sync error:', profileError);
      }
    }

    setStatus('success');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Настройка демо-аккаунта</h1>
        <p className="text-sm text-gray-500 mb-8">Этот скрипт зарегистрирует Luxmanova Zarina (zarina@mail.ru) в вашей системе Supabase.</p>

        {status === 'idle' && (
          <button
            onClick={setupZarina}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
          >
            Зарегистрировать Zarina
          </button>
        )}

        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-green-600 mb-4" size={48} />
            <p className="font-bold text-gray-600">Создаем пользователя...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
            <CheckCircle2 className="text-green-600 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-bold text-green-900 mb-2">Готово!</h3>
            <p className="text-sm text-green-700 mb-6">Zarina успешно зарегистрирована. Теперь вы можете войти, используя email: zarina@mail.ru и пароль: 21school</p>
            <Link
              href="/auth/login"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Перейти к входу
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-bold text-red-900 mb-2">Ошибка</h3>
            <p className="text-sm text-red-700 mb-6">{error || 'Что-то пошло не так'}</p>
            <button
              onClick={() => setStatus('idle')}
              className="text-red-600 font-bold hover:underline"
            >
              Попробовать снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
