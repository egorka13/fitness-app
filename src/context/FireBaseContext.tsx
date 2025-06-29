import React from 'react';
import { FirebaseApp } from 'firebase/app';

interface IFireBaseContext {
  firebaseApp: FirebaseApp | null;
}

const FireBaseContext = React.createContext<IFireBaseContext>({
  firebaseApp: null,
});

export const FireBaseContextProvider = ({
  firebaseApp,
  children,
}: React.PropsWithChildren<IFireBaseContext>) => {
  return (
    <FireBaseContext.Provider value={{ firebaseApp }}>
      {children}
    </FireBaseContext.Provider>
  );
};

export const useFireBaseContext = () => {
  return React.useContext(FireBaseContext);
};
