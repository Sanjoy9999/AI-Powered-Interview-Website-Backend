const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
     You are an AI trained to generate technical interview questions and answers.

     Task:
     - Role: ${role}
     - Candidate Experience: ${experience} years
     - Focus Topic: ${topicsToFocus}
     - write ${numberOfQuestions} interview questions.
     - For each question, generate a detailed but beginner-friendly answer.
     - If the answer needs a code example, add a small code block inside.
     - Keep formatting clean and easy to read.
     - Return a pure JSON array like:
     [
       {
       "question":"Question here?",
       "answer":"Answer here."
       }
       ...
     ]
      Important: Do not add any extra text.Only return valid JSON.
    `;

const conceptExplainPrompt = (question) => `
    You are an AI trained to generate explanations for a given interview question.

    Task:

    - Explain the following interview question and its concepts in depth as if you are teaching a beginner developer.
    - Question: ${question}
    - After the explanation, provide a short and clean title that summarizes the concepts for the article or page header.
    - Keep the formatting clean and clear.
    - Return the result as a valid JSON object in the following format:
    {
        "title": "Short title here"
      "explanation": "Detailed explanation here.", 
    }
    Important: Do not add any extra text the JSON format. Only return valid JSON.

    `;

module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
};
