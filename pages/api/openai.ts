import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';

const configuration = new Configuration({
  organization: "org-z7m6hqrQHuHbpI0K9pYlJiR0",
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user, lead, campaign } = req.body;
  let linkedInDescription = '';
  if (lead.linkedIn) {
    console.log("Accessing linkedin");
    const options = {
      method: 'GET',
      url: `https://kg.diffbot.com/kg/v3/enhance?type=Person&url=${lead.linkedIn}&size=1&refresh=false&search=false&nonCanonicalFacts=false&useCache=false&jsonmode=%20&token=${process.env.DIFFBOT_KEY}`,
      headers: { accept: 'application/json' },
    };
    const diffbotResponse = (await axios.request(options)).data;
    linkedInDescription = diffbotResponse?.data?.[0]?.entity?.description || '';
  }

  const aboutInput = `Make sure you write an engaging personalized hook and introduce yourself. Your word limit is 125 words, do not exceed this. Make sure to take note of every rule listed. Do not include the subject line. Never forget your name is ${user.firstName} ${user.lastName} & you work as a ${user.jobTitle}. You work at a company named ${user.companyName}. ${user.companyName}'s business is the following  ${user.companyInfo}. The company values are the following  ${user.companyValue}. The problems the company helps solve are  ${user.problem}.  You are contacting a potential customer for the purpose of ${campaign.purpose}. The person to connect with is ${lead.firstName} ${lead.lastName}, who works at ${lead.companyName} as a ${lead.jobTitle}. The tone of the email is going to be  ${campaign.toneOfVoice}. ${campaign.generatedPrompt}. ALWAYS BE CONCISE AND SPECIFIC. You have the following personalized info on the customer: ${linkedInDescription}. Make sure to add bits of their previous work experiences and make it relevant to your company values, and include light bits of humor. Make your message solution oriented, identify pain points if any and be respectful, and ask for a call or meeting at the end.`;
  console.log(aboutInput);
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: 'user',
          content: aboutInput
        },
      ],
      max_tokens: 600,
      temperature: 0,
      n: 1
    });

    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
      res.status(200).json({ message: `${response.data.choices[0].message.content}` });
    } else {
      res.status(500).json({ message: 'AI model failed to generate a personalized message' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating message' });
  }
}
