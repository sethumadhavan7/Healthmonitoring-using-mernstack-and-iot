import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Generative AI client with your API key
const genAI = new GoogleGenerativeAI(
  'AIzaSyBZ_Y9FEAKwsAQQ2QFYuFIzX2S0FIbugrQ'
);

/**
 * Get a response from the AI model based on the user's message.
 * @param message - The user's input message.
 * @returns The AI-generated response as a string.
 */
export const getAIResponse = async (message: string) => {
  try {
    // ✅ Changed model here
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(message);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error;
  }
};

/**
 * Generate quiz questions using the AI model.
 * @param courseName - The name of the course.
 * @param difficulty - The difficulty level of the quiz.
 * @param numQuestions - The number of questions to generate (default: 5).
 * @returns An array of structured quiz questions.
 */
export const getQuizQuestions = async (
  courseName: string,
  difficulty: string,
  numQuestions: number = 5
) => {
  try {
    // ✅ Changed model here also
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Generate a multiple-choice quiz for the course "${courseName}"
at ${difficulty} level with ${numQuestions} questions.

Format each question as follows:
Question: [question text]
Options:
A) [option text]
B) [option text]
C) [option text]
D) [option text]
Correct Answer: [A/B/C/D]
Explanation: [explanation text]

Ensure the response is structured and clear.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const questions = parseQuizResponse(text);
    return questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

/**
 * Parse the raw text response into structured quiz questions.
 */
function parseQuizResponse(text: string) {
  const questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }> = [];

  const questionBlocks = text.split(/Question:/).filter(block => block.trim());

  for (const block of questionBlocks) {
    try {
      const questionMatch = block.match(/(.+?)(?=Options:|$)/s);
      const questionText = questionMatch ? questionMatch[1].trim() : '';

      const options: string[] = [];
      const optionsText = block.match(/Options:([\s\S]*?)(?=Correct Answer:|$)/);

      if (optionsText) {
        const optionLines = optionsText[1].match(
          /[A-D]\)(.*?)(?=(?:[A-D]\)|Correct Answer:|$))/gs
        );
        if (optionLines) {
          options.push(
            ...optionLines.map(line =>
              line.replace(/^[A-D]\)/, '').trim()
            )
          );
        }
      }

      const correctAnswerMatch = block.match(/Correct Answer:\s*([A-D])/);
      const correctAnswer = correctAnswerMatch
        ? options[correctAnswerMatch[1].charCodeAt(0) - 65]
        : '';

      const explanationMatch = block.match(
        /Explanation:\s*([\s\S]*?)(?=(?:Question:|$))/
      );
      const explanation = explanationMatch
        ? explanationMatch[1].trim()
        : '';

      if (questionText && options.length === 4 && correctAnswer && explanation) {
        questions.push({
          question: questionText,
          options,
          correctAnswer,
          explanation
        });
      }
    } catch (error) {
      console.error('Error parsing question block:', error);
    }
  }

  if (questions.length === 0) {
    throw new Error('Failed to parse quiz questions from response');
  }

  return questions;
}
