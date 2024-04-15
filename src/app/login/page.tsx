'use client';

import { MouseEvent, ChangeEvent, useState } from 'react';
import { useUser } from '../contexts/user';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../components/button';

export default function Login() {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event: MouseEvent<HTMLElement>) {
    event.preventDefault();

    setError(null);
    setLoading(true);

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      setUser(data);

      router.push(`/user/${data.id}-${data.firstName}-${data.lastName}`.toLowerCase());
    } else {
      const data = await response.json();

      setError(data.error);
    }
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="block text-center">
            <Image
              width={200}
              height={200}
              src="/Brookeslogo.png"
              alt="Brookeslogo"
              className="max-h-16 inline-block"
            />
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Oxford Brookes Research Blog Page
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={handleEmailChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brookes-60 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  {/* <a href="#" className="font-semibold text-brookes-60 hover:text-brookes">
                    Forgot password?
                  </a> */}
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brookes-60 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex w-full justify-center">
              <Button disabled={false} loading={loading} text={'Sign In'} onClick={handleSubmit}></Button>
            </div>
          </div>
        </div>

        {error && (
          <div
            className="mt-10 bg-red-100 border-[1px] border-red-400 text-center text-brookes px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Login Failed! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
      </div>
    </>
  );
}
