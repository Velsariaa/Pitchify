import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generatePitchDeck = async (rawIdea) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a startup pitch deck generator.

Based on the raw idea below, generate a full pitch deck with 8-12 slides depending on the logical flow and complexity of the idea. Only include slides that add value, don't force the number.

Strictly follow the Output Format in JSON. Do not escape any characters like quotes or Unicode.

### Input Idea: "${rawIdea}"

### Output Format (in JSON):
{
  "pitchTitle": "Catchy title for the pitch",
  "refinedProblem": "Refined and polished problem statement",
  "slides": [
    {
      "title": "Slide Title",
      "content": "Slide main content (paragraph or bullet points)",
      "presenterNotes": "Speaker notes for this slide"
    }
  ]
}

Ensure the slide flow follows a logical startup pitch sequence (Problem, Solution, Market, Product, Tech).`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Extract JSON block from the response text
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No JSON object found in the response.");
    }

    let rawJson = match[0];

    // Sanitize common issues in Gemini output
    rawJson = rawJson
      .replace(/[“”]/g, '"') // replace smart double quotes with normal quotes
      .replace(/[‘’]/g, "'") // replace smart single quotes with normal apostrophes
      .replace(/\\([^"\\\/bfnrtu])/g, '\\\\$1') // escape invalid backslashes
      .replace(/\u2026/g, "...") // replace ellipsis character
      .replace(/[\r\n\t]/g, " "); // normalize whitespace characters (replace with space)

    // Optional: Uncomment to debug sanitized JSON string
    // console.log("Sanitized Gemini JSON:", rawJson);

    const parsed = JSON.parse(rawJson);
    return parsed;

  } catch (error) {
    console.error("Error parsing Gemini output:", error.message);
    throw new Error("Failed to generate a valid pitch deck.");
  }
};
