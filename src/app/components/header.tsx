'use client';

import Image from 'next/image';
import { useUser } from '../contexts/user';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const showHeader = pathname === '/login' ? false : true;
  const isLoggedIn = user && user.token && user.id > 0;

  async function handleLogout(event: { preventDefault: () => void }) {
    event.preventDefault();

    setUser({ id: 0 });

    router.push('/');
  }

  return (
    showHeader && (
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex">
            <Image src="/Brookeslogo.png" width={200} height={200} alt="logo" />
          </div>
          <div className="flex flex-1 justify-end">
            {isLoggedIn && (
              <a href="/login" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleLogout}>
                Log out <span aria-hidden="true">&rarr;</span>
              </a>
            )}

            {!isLoggedIn && (
              <a href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            )}
          </div>
        </nav>
      </header>
    )
  );
}
