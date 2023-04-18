import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = 
`
Determine if product should be avoided or not, based on it's ingredients and potensial allgeries. Ideally the product should not have: synthethic fragrances, animal derviatives, artificial colors, no harsh detergents, propylene glycol, petrolatum, mineral oils, sulphates, silicones, EDTA, phtthalates, triclosan, parabens

Product:
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
  Take the table  of the interview below and generate a blog post written in the style of drugs.com. Give a comprehensive and concise essay, you can take info primarly from drugs.com about the relevant ingredients. 

  Title: ${req.body.userInput}

  Verdict: ${basePromptOutput.text}

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