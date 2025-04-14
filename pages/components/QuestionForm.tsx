import React, { useState } from 'react';

export const QuestionForm = ({ questionData, onSubmitAnswer }) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submitted answer here (e.g., compare with the correct answer in questionData)
    onSubmitAnswer(selectedOption === questionData.answer);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Question: {questionData.question}</h2>
      <ul>
        {questionData.options.map((option, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <button type="submit">Submit</button>
    </form>
  );
};

// avoids Build optimization failed: found pages without a React Component as default export in 
export default function Ignore() {
  return <>{/* nothing */}</>;
}