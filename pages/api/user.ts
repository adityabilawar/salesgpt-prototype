import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import axios from 'axios';

const configuration = new Configuration({
  organization: "org-z7m6hqrQHuHbpI0K9pYlJiR0",
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

let username = "aaronbiscotti",
  apiKey = "fN1KM4iQnKqy08EhFQmZId9k3";

function sleep(ms: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


async function scrape(linkedInId: string) {
  try {
    const response = await axios.get('https://api.scrapingdog.com/linkedin', {
      params: {
        api_key: '6491af0aedda665c1e8bf1dd',
        type: 'profile',
        linkId: linkedInId,
        private: true
      }
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { urlInput } = req.body;
  const urls = urlInput.split('\n');
  console.log(urlInput);
  const leads: any[] = [];

  for(const url of urls) {
    // this is because scrapingdog takes in linkedin user IDs, not URLs.
    const linkedIn = (url.startsWith('https://www.linkedin.com/in/')) ?
      new URL(url).pathname.split('in/')[1].split('/')[0] // parsing the linkedin user ID from the URL
      : url;
    const scrapedData = await scrape(linkedIn);
    console.log(scrapedData);
    if(!scrapedData)
      return res.status(500).json({ error: 'Invalid user ID' });
    const linkedInData = scrapedData[0];
    let jobTitle = '', companyName = '';
    if(linkedInData.experience.length > 0) {
      const previously = (linkedInData.experience[0].ends_at == 'Present') ? '' : 'Previously ';
      jobTitle = `${previously+linkedInData.experience[0].position}`;
      companyName = linkedInData.experience[0].company_name;
    }

    leads.push({
      firstName: linkedInData.first_name,
      lastName: linkedInData.last_name,
      jobTitle,
      companyName,
      email: '',
      phone: '',
      linkedIn: `https://www.linkedin.com/in/${linkedInData.public_identifier}`
    });
  }

  return res.status(200).json(leads);
  // if (lead.url) {
  //   console.log("Accessing linkedin");
  //   const linkedInId = new URL(lead.url).pathname.split('in/')[1].split('/')[0]; // parsing through the URL link to get the linkedin user id
  //   // console.log(linkedInId);
  //   linkedInData = await scrape(linkedInId);
  //   console.log(linkedInData);
  //   linkedInDescription = linkedInData?.headline || '';
  //   console.log(linkedInData.description, linkedInData.jobDescription);
  //   jobDescription = linkedInData?.jobDescription || '';
  //   console.log(linkedInData);
  // }

}
