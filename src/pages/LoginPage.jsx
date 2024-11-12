// src/LoginPage.js
import React from "react";

function LoginPage({ signInWithGoogle }) {
  return (
    <div>
      <h1>LeetCode Clone</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default LoginPage;
