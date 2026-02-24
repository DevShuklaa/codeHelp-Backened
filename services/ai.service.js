import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

// Fallback to the environment variable
const fallbackKey = process.env.GROQ_API_KEY;

export const askAI = async (prompt, apiKey = null) => {
  const keyToUse = apiKey || fallbackKey;

  if (!keyToUse) {
    throw new Error("No Groq API key provided in settings or environment variables.");
  }

  const groqClient = new Groq({ apiKey: keyToUse });

  const completion = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.3
  });

  return completion.choices[0].message.content;
};
