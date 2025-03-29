import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Generative AI client with your API key
const genAI = new GoogleGenerativeAI('AIzaSyAg0XFM2XfU5ByxBF7R1XG6KFfeCWy1-T0'); // Replace with your actual API key

/**
 * Get a response from the AI model based on the user's message.
 * @param message - The user's input message.
 * @returns The AI-generated response as a string.
 */
export const getAIResponse = async (message: string) => {
  try {
    // Get the generative model (e.g., 'gemini-2.0-flash')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Generate content based on the user's message
    const result = await model.generateContent(message);
    const response = await result.response;

    // Return the generated text
    return response.text();
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw error; // Re-throw the error for handling in the calling function
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
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Create a prompt for generating quiz questions
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

    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the text response into structured quiz questions
    const questions = parseQuizResponse(text);
    return questions;
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

/**
 * Parse the raw text response into structured quiz questions.
 * @param text - The raw text response from the AI model.
 * @returns An array of structured quiz questions.
 */
function parseQuizResponse(text: string) {
  const questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }> = [];

  // Split the text into question blocks
  const questionBlocks = text.split(/Question:/).filter(block => block.trim());

  for (const block of questionBlocks) {
    try {
      // Extract question text
      const questionMatch = block.match(/(.+?)(?=Options:|$)/s);
      const questionText = questionMatch ? questionMatch[1].trim() : '';

      // Extract options
      const options: string[] = [];
      const optionsText = block.match(/Options:([\s\S]*?)(?=Correct Answer:|$)/);
      if (optionsText) {
        const optionLines = optionsText[1].match(/[A-D]\)(.*?)(?=(?:[A-D]\)|Correct Answer:|$))/gs);
        if (optionLines) {
          options.push(...optionLines.map(line => line.replace(/^[A-D]\)/, '').trim()));
        }
      }

      // Extract correct answer
      const correctAnswerMatch = block.match(/Correct Answer:\s*([A-D])/);
      const correctAnswer = correctAnswerMatch ? 
        options[correctAnswerMatch[1].charCodeAt(0) - 65] : // Convert A-D to array index
        '';

      // Extract explanation
      const explanationMatch = block.match(/Explanation:\s*([\s\S]*?)(?=(?:Question:|$))/);
      const explanation = explanationMatch ? explanationMatch[1].trim() : '';

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
      continue; // Skip this question if parsing fails
    }
  }

  if (questions.length === 0) {
    throw new Error('Failed to parse quiz questions from response');
  }

  return questions;
}