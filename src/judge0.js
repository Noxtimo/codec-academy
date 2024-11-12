import axios from "axios";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const rapidApiKey = process.env.REACT_APP_RAPIDAPI_KEY;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// submitCode function with enhanced error handling
export const submitCode = async (sourceCode, languageId, testCases) => {
  if (!Array.isArray(testCases)) {
    console.error(
      "Error: `testCases` should be an array but received:",
      typeof testCases
    );
    return null;
  }

  try {
    const tokens = await Promise.all(
      testCases.map(async (testCase) => {
        try {
          const response = await axios.post(
            `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`,
            {
              source_code: btoa(sourceCode),
              language_id: languageId,
              stdin: btoa(testCase.input || ""),
            },
            {
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              },
            }
          );
          return response.data.token;
        } catch (error) {
          console.error(
            "Error submitting code for testCase:",
            testCase,
            error.message
          );
          return null;
        }
      })
    ).then((res) => res.filter(Boolean)); // Filter out any null tokens

    console.log("Submission tokens:", tokens);
    return tokens;
  } catch (error) {
    console.error("Error submitting code:", error.message);
    return null;
  }
};

// getSubmissionResult function with retry and refined error handling
export const getSubmissionResult = async (token) => {
  if (!token) {
    console.error("Invalid token:", token);
    return { status: { description: "Invalid token" } };
  }

  const MAX_RETRIES = 10;
  const DELAY_MS = 2000;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get(
        `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`,
        {
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      // Check if the response is ready
      if (response.data.status.id !== 1 && response.data.status.id !== 2) {
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error(
          `Submission with token ${token} not found (404). Attempt: ${
            attempt + 1
          }`
        );
        return { status: { description: "Token not found" } };
      } else {
        console.error("Error fetching result:", error.message);
      }
    }

    // Wait before retrying
    await delay(DELAY_MS);
  }

  console.error("Error: Max retries reached. Submission result still pending.");
  return { status: { description: "Timeout" } };
};
