'use client';

import * as React from 'react';

const UserContext = React.createContext({
  user: {
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    token: '',
  },
  // @ts-ignore
  setUser: React.Dispatch<
    React.SetStateAction<{
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      token: string;
    }>
  >,
});

function useUser() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error(`userUser must be used within a UserProvider`);
  }

  return context;
}

function UserProvider(props: any) {
  const [user, setUser] = React.useState('');
  const value = React.useMemo(() => ({ user, setUser }), [user]);

  return <UserContext.Provider value={value} {...props} />;
}

export { UserProvider, useUser };
