'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    // Passport & Personal Info
    const profileData = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      middle_name: formData.get('middle_name'),
      birth_date: formData.get('birth_date'),
      passport_series: formData.get('passport_series'),
      passport_number: formData.get('passport_number'),
      passport_date: formData.get('passport_date'),
      passport_issued_by: formData.get('passport_issued_by'),
      phone: formData.get('phone'),
    };

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: authData.user.id, ...profileData });

        if (profileError) throw profileError;
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Регистрация</h2>
        <p className="mt-2 text-sm text-gray-600">
          Заполните паспортные данные для доступа к проверкам
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input name="last_name" placeholder="Фамилия" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              <input name="first_name" placeholder="Имя" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              <input name="middle_name" placeholder="Отчество" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:col-span-2" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Дата рождения</label>
                <input name="birth_date" type="date" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Телефон</label>
                <input name="phone" placeholder="+998" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Паспортные данные</p>
              <div className="grid grid-cols-3 gap-2">
                <input name="passport_series" placeholder="Серия" maxLength={2} required className="px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                <input name="passport_number" placeholder="Номер" maxLength={7} required className="col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-1">Дата выдачи</label>
                <input name="passport_date" type="date" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <input name="passport_issued_by" placeholder="Кем выдан" required className="mt-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

            <div className="border-t pt-4">
              <input name="email" type="email" placeholder="Email" required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
              <input name="password" type="password" placeholder="Пароль" required className="mt-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
