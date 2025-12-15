import { GoogleGenerativeAI } from '@google/generative-ai';

// ⚠️ WARNING: API key should NOT be in frontend (I'll explain below)
const genAI = new GoogleGenerativeAI(
  'AIzaSyBRvJwFDjBANW3oQkOYXBgAAsAenWu0-Lg'
);

/**
 * Get a response from the AI model based on the user's message.
 */
export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro', // ✅ FIXED
    });

    const result = await model.generateContent(message);
    return result.response.text();
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};

/**
 * Generate quiz questions using the AI model.
 */
export const getQuizQuestions = async (
  courseName: string,
  difficulty: string,
  numQuestions: number = 5
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro', // ✅ FIXED
    });

    const prompt = `
Generate a multiple-choice quiz for the course "${courseName}"
at ${difficulty} level with ${numQuestions} questions.

Format:
Question:
Options:
A)
B)
C)
D)
Correct Answer:
Explanation:
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return parseQuizResponse(text);
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
};
