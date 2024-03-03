import React from "react";
import { ExercisesList } from "./components/ExercisesList/ExercisesList";
import { FireBaseContextProvider } from "./context/FireBaseContext";
import firebaseConfig from "./configs/FirebaseConfig";

import { initializeApp } from "firebase/app";

function App() {
  const app = initializeApp(firebaseConfig);

  return (
    <div className="App">
      <FireBaseContextProvider firebaseApp={app}>
        <ExercisesList />
      </FireBaseContextProvider>
    </div>
  );
}

export default App;
