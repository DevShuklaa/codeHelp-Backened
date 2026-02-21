import { askAI } from "../services/ai.service.js";

export const testUser = async (req, res) => {
  const { code, problem, language, outputLang } = req.body;

  const prompt = `
    Test the user whith certain problems, which could be asked in interviews and coding rounds. This the problem statement on which you have 
    to ask question and you can also use the code provided by user if present.Ask about 10 questions from easy to hard and and provide all ans in last 
    not with questions. This is the language used by user ${language}.You can use ${outputLang} as output language and try to humanly as much posible.  

    problem:
    ${problem}
  Code :
  ${code}
  `;

  const response = await askAI(prompt);
  res.json({ response });
}

export const debugProb = async (req, res) => {
  const { code, language } = req.body;

  const prompt = `
  Check my following code and tell me every mistake. And tell me what perfections I can do in this code.
  Tell using the line numbers which have mistakes. If the code is not completed, specify that it is incomplete.
  Analyze the user's code and pinpoint any core programming weaknesses or conceptual misunderstandings they seem to be struggling with based on this snippet.
  
  IMPORTANT: You must return ONLY a valid JSON object with the following structure, and nothing else (no markdown wrapping, no extra text):
  {
    "mistakesAndFeedback": "Your detailed explanation of mistakes and perfections here...",
    "perfectCode": "The complete perfect code in ${language} here... (If the code is incomplete, leave this as an empty string)",
    "userWeaknesses": "A short, 1-3 word categorical phrase describing the core weakness (e.g., 'Time Complexity', 'Recursion', 'Syntax Error', 'Logic Error')"
  }

  Code :
  ${code}
  `;

  try {
    const rawResponse = await askAI(prompt);

    // Clean up markdown blocks from response just in case the AI wraps the output
    const cleanResponse = rawResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();

    const parsedData = JSON.parse(cleanResponse);
    res.json(parsedData);
  } catch (error) {
    console.error("Failed to parse AI response as JSON", error);
    res.status(500).json({ error: "Failed to process AI response properly." });
  }
}

export const askUser = async (req, res) => {
  const { problem, code, outputLang } = req.body;

  const prompt = `
    
  This is the question asked by user please provide the ans as askked.
  if user have asked any question other then the problem statement then please dont reply anything just 
  say i can't provide ans to this please ask question related to the problem.Use ${outputLang} as output language.

Problem:
${problem}
question:
${code}
`;

  const response = await askAI(prompt);
  res.json({ response });
};

export const explainProblem = async (req, res) => {
  const { problem, outputLang, callCount = 1 } = req.body;

  let detailLevel = "in simple words";
  if (callCount === 2) {
    detailLevel = "with a more detailed breakdown, providing a real-world analogy to help visualize the problem";
  } else if (callCount >= 3) {
    detailLevel = "with an extremely detailed, step-by-step intuitive breakdown of the problem requirements, constraints, and edge cases";
  }

  const prompt = `
Explain the following coding problem in ${outputLang} language ${detailLevel}.
Do NOT give any algorithm or code. Provide a fresh perspective compared to previous explanations.

Problem:
${problem}
`;

  const response = await askAI(prompt);
  res.json({ response });
};

export const giveHints = async (req, res) => {
  const { problem, outputLang, callCount = 1 } = req.body;

  let hintLevel = "Give 3 helpful initial hints for this coding problem";
  if (callCount === 2) {
    hintLevel = "Give 3 more specific and directional hints helping build the logic without giving away the full answer for this coding problem";
  } else if (callCount >= 3) {
    hintLevel = "Give 3 highly detailed advanced hints that reveal the optimal approach, focusing on data structures and algorithms to use for this coding problem";
  }

  const prompt = `
${hintLevel} in ${outputLang} language.
Do NOT give the final solution or code. Ensure these hints are different and progressively more revealing than previous levels.

Problem:
${problem}
`;

  const response = await askAI(prompt);
  res.json({ response });
};

export const solveProblem = async (req, res) => {
  const { problem, language, outputLang } = req.body;

  const prompt = `
Solve this coding problem in ${outputLang} language.
First explain the approach step by step.
Then provide optimized ${language} code.

Problem:
${problem}
`;

  const response = await askAI(prompt);
  res.json({ response });
};
