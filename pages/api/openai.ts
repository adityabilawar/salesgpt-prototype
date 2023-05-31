import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  organization: "org-z7m6hqrQHuHbpI0K9pYlJiR0",
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lead, campaign } = req.body;

  const aboutInput = `The recipient's name is ${lead.firstName} ${lead.lastName}. They are the ${lead.jobTitle} of ${lead.companyName}, a company that ${lead.companyInfo}. Here is their LinkedIn profile: ${lead.linkedInProfile}. If any of these are blank it means that information should be excluded. Now, NEVER forget these details.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'user',
          content: `${aboutInput} ${campaign.generatedPrompt}`
        }
      ],
      max_tokens: 3000,
      temperature: 0,
      n: 1
    });

    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
      res.status(200).json({ message: `Dear ${lead.firstName} ${lead.lastName}, ${response.data.choices[0].message.content}` });
    } else {
      res.status(500).json({ message: 'AI model failed to generate a personalized message' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating message' });
  }
}
