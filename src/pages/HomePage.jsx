import React from "react";
import CodeEditor from "../components/CodeEditor"; // Updated import

function HomePage({ user, logOut }) {
  const challenge = {
    title: "Two Sum Problem",
    description:
      "Find the indices of the two numbers that add up to the target.",
    languageId: 52, // Assuming 52 is Python in Judge0 API
    testCases: [
      { input: [2, 7, 11, 15], target: 9 },
      { input: [3, 2, 4], target: 6 },
      { input: [3, 3], target: 6 },
    ],
  };

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <button onClick={logOut}>Log Out</button>
      <CodeEditor challenge={challenge} />
    </div>
  );
}

export default HomePage;
