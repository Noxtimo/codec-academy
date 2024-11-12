// src/App.js
import React, { useEffect, useState } from "react";
import { auth, signInWithGoogle, logOut } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <div>
      {user ? (
        <HomePage user={user} logOut={logOut} />
      ) : (
        <LoginPage signInWithGoogle={signInWithGoogle} />
      )}
    </div>
  );
}

export default App;
