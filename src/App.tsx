import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { ExercisesList } from './components/ExercisesList/ExercisesList';
import { ExerciseDetails } from './components/ExerciseDetails/ExerciseDetails';

import { initializeApp } from 'firebase/app';
import { FireBaseContextProvider } from './context/FireBaseContext';
import firebaseConfig from './configs/FirebaseConfig';

function App() {
  const app = initializeApp(firebaseConfig);

  return (
    <div className={styles.app}>
      <FireBaseContextProvider firebaseApp={app}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ExercisesList />} />
            <Route path="/exercise/:group/:id" element={<ExerciseDetails />} />
          </Routes>
        </BrowserRouter>
      </FireBaseContextProvider>
    </div>
  );
}

export default App;
