import React from 'react';
import { Session } from '@supabase/supabase-js';

interface IAuthContext {
  session: Session | null;
}

const AuthContext = React.createContext<IAuthContext>({
  session: null,
});

export const AuthContextProvider = ({
  session,
  children,
}: React.PropsWithChildren<IAuthContext>) => {
  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return React.useContext(AuthContext);
};
