export const getQuestions = async (transcript) => {
  try {
    ///api/chat/:userInput
    const response = await fetch(`/api/chat/fromUserInput`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"userInput": transcript}),
    });
    const data = await response.json();
    const questionData = data.response;
    return questionData;

  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// avoids Build optimization failed: found pages without a React Component as default export in 
export default function Ignore() {
  return <>{/* nothing */}</>;
}