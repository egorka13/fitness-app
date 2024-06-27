import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { Login } from './components/Auth/Auth';
import { ExercisesList } from './components/ExercisesList/ExercisesList';
import { ExerciseDetails } from './components/ExerciseDetails/ExerciseDetails';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { FireBaseContextProvider } from './context/FireBaseContext';
import { AuthProvider } from './context/AuthContext';

import firebaseConfig from './configs/FirebaseConfig';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

function App() {
  return (
    <div className={styles.app}>
      <FireBaseContextProvider firebaseApp={app}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Login />} />
              <Route path="/" element={<ExercisesList />} />
              <Route
                path="/exercise/:group/:id"
                element={<ExerciseDetails />}
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </FireBaseContextProvider>
    </div>
  );
}

export default App;
