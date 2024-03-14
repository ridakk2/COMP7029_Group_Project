'use client';

import { createContext, Dispatch, SetStateAction, useContext, useState, useMemo } from 'react';

const UserContext = createContext({
  user: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    token: '',
  },
  // @ts-ignore
  setUser: Dispatch<
    SetStateAction<{
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      token: string;
    }>
  >,
});

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`userUser must be used within a UserProvider`);
  }

  return context;
}

function UserProvider(props: any) {
  const [user, setUser] = useState('');
  const value = useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value} {...props} />;
}

export { UserProvider, useUser };
