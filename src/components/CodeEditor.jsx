import React, { useState } from "react";
import { submitCode, getSubmissionResult } from "../judge0";

function CodeEditor({ challenge }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Submit the code for each test case
      const tokens = await submitCode(
        code,
        challenge.languageId,
        challenge.testCases
      );

      if (!tokens || tokens.length === 0) {
        throw new Error("No valid tokens retrieved from Judge0.");
      }

      // Retrieve results for each token individually
      const results = await Promise.all(
        tokens.map((token) => getSubmissionResult(token))
      );

      setResult(results);
    } catch (error) {
      console.error("Error during code submission or result fetching:", error);
      setResult([{ status: { description: "Error" }, stderr: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{challenge.title}</h2>
      <p>{challenge.description}</p>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        rows={10}
        cols={50}
      />

      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Running..." : "Run Code"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Results:</h3>
        {result ? (
          result.map((res, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>Test Case {index + 1}:</strong>
              <p>Status: {res.status.description}</p>
              <p>Output: {res.stdout || "No output"}</p>
              {res.stderr && <p>Error: {res.stderr}</p>}
              {res.compile_output && <p>Compile Error: {res.compile_output}</p>}
            </div>
          ))
        ) : (
          <p>No results yet.</p>
        )}
      </div>
    </div>
  );
}

export default CodeEditor;
