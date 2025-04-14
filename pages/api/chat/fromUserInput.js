import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function chatFromUserInput(req, res) {
    console.log(OPENAI_API_KEY);
    console.log('chatFromUserInput', req.body);
    try {
        // Get the user input from the query parameters or request body
        const userInput =  req.body.userInput;
    
        // Make a request to the ChatGPT API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `You are a helpful assistant who communicates with a user by writing JSON.
You will ONLY return JSON, with no additional prose.
The JSON you will return should have the following format, consisting of an array with JSON objects which include question, options, and answer attributes:
`+'```'+`
{
        "question": "First question",
        "options": [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        ],
        "answer": "Option C"
  }

`+'```'+`
`},
            { role: 'user', content: `
Generate 1 multiple-choice questions from the following text. Use the JSON schema provided. Again, you must only return JSON, with no prose.
` },
            { role: 'user', content: userInput },
            { role: 'assistant', content: 'What would you like to know' },
          ],
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + OPENAI_API_KEY,
          },
        });

        const chatResponse = response.data.choices[0].message.content;
    
        return res.json({ response: chatResponse });
    } catch (error) {
        console.error('An error occurred, make sure the OpenAPI api key was specified when running the app:', error);
        return res.status(500).json({ error: 'An error occurred, make sure the OpenAPI api key was specified when running the app' });
    }
}