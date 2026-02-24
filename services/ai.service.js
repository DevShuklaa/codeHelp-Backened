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

  // Print the API key to the console (masking most of it for security except first 8 chars)
  const maskedKey = keyToUse.length > 8 ? keyToUse.substring(0, 8) + "..." : keyToUse;
  console.log(`[AI-SERVICE] Using Groq API Key: ${maskedKey}`);

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
