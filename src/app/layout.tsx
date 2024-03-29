import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from './contexts/user';
import Header from './components/header';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`h-full`}>
        <main>
          <UserProvider>
            <Header></Header>
            {children}
          </UserProvider>
        </main>
      </body>
    </html>
  );
}
