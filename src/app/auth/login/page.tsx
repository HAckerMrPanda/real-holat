'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      router.push('/profile');
    } catch (err: any) {
      setError(err.message === 'Email not confirmed' ? 'Электронная почта не подтверждена. Пожалуйста, проверьте почту или отключите подтверждение в настройках Supabase.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginAsZarina = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'zarina@mail.ru',
        password: '21school',
      });
      if (authError) throw authError;
      router.push('/profile');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Вход в систему</h2>
        <p className="mt-2 text-sm text-gray-600">
          Используйте ваш email или демо-аккаунт
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-gray-100">
          <div className="mb-6">
            <button
              onClick={loginAsZarina}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border-2 border-green-600 rounded-xl shadow-sm text-sm font-bold text-green-600 bg-white hover:bg-green-50 focus:outline-none transition-all active:scale-95"
            >
              🚀 Войти как Zarina (Demo)
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-400 font-bold">Или через email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Пароль"
                required
                className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 transition-all active:scale-95"
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => alert('Вход через MyID в разработке')}
              className="w-full flex justify-center py-3 px-4 border border-blue-100 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all"
            >
              Войти через MyID
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500 font-medium">
            Нет аккаунта?{' '}
            <Link href="/auth/register" className="font-bold text-green-600 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
