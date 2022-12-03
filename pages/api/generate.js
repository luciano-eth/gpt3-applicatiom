import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
Create a list of interview questions both technical and non-technical in relation to 

Company:
`
;
const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}/n`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}\n`,
    temperature: 0.8,
    max_tokens: 800,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // Promt #2

  const secondPromt =  
`
  Take the table of contents and company of the interview below and generate a blog post written in thwe style of Paul Graham. Give a answer for each interview question. Make it comprehensive and take into account answers from Qoura and Stackoverflow. Make it really compelling.

  Title: ${req.body.userInput}

  Table of Contents: ${basePromptOutput.text}

  Interview Question: 
`
// Call the OpenAI API a second time with Prompt
const secondPromtCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPromt}`,
    temperature: 0.85,
    max_tokens: 800,
    });
    
    const secondPromtOutput = secondPromtCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;