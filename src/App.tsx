import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { ExercisesList } from './components/ExercisesList/ExercisesList';
import { ExerciseDetails } from './components/ExerciseDetails/ExerciseDetails';

import { initializeApp } from 'firebase/app';
import { FireBaseContextProvider } from './context/FireBaseContext';
import { createClient, Session } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import firebaseConfig from './configs/FirebaseConfig';
import supabaseConfig from './configs/SupabaseConfig';
import { AuthContextProvider } from './context/AuthContext';

export const app = initializeApp(firebaseConfig);

const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        socialLayout={'horizontal'}
      />
    );
  }

  return (
    <div className={styles.app}>
      <FireBaseContextProvider firebaseApp={app}>
        <AuthContextProvider session={session}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ExercisesList />} />
              <Route
                path="/exercise/:group/:id"
                element={<ExerciseDetails />}
              />
            </Routes>
          </BrowserRouter>
        </AuthContextProvider>
      </FireBaseContextProvider>
    </div>
  );
}

export default App;
