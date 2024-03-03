import React from "react";
import { FirebaseApp } from "firebase/app";

interface IFireBaseContext {
  firebaseApp: FirebaseApp | null;
}

// Step 1: Create a context
const FireBaseContext = React.createContext<IFireBaseContext>({
  firebaseApp: null,
  // setFirebaseApp: (value: any) => {}
});

// Step 2: Create a provider component
export const FireBaseContextProvider = ({
  firebaseApp,
  children,
}: React.PropsWithChildren<IFireBaseContext>) => {
  const [firebaseAppInner, setFirebaseAppInner] = React.useState(firebaseApp);

  //   const setFirebaseApp = (newValue: any) => {
  //     setFirebaseAppInner(newValue);
  //   };

  return (
    <FireBaseContext.Provider
      value={{ firebaseApp: firebaseAppInner /*setFirebaseApp*/ }}
    >
      {children}
    </FireBaseContext.Provider>
  );
};

// Step 3: Create a custom hook to consume the context
export const useFireBaseContext = () => {
  return React.useContext(FireBaseContext);
};
