import { ResponseData } from '@/@types/Response';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { getAboutInput } from './file';

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
const openai = new OpenAIApi(configuration);

export default async(req: NextApiRequest, res: NextApiResponse) => {
	if(req.method !== 'POST') return res.status(404).send("only POST allowed");

	try {
		const { input, type, prompts, auth, name, about } = req.body;

		if((auth.user !== 'admin') || (auth.pass !== process.env.ADMIN_PASS)) return res.status(400).json({ error: 'Invalid auth! User is not admin' });

		const resultData: ResponseData[] = [];
		const aboutInput = getAboutInput(about);
		const links = input.split('\n');
		for(let i = 0; i < links.length; i++) {
			for(let j = 0; j < type.length; j++) {

				const options = {
					method: 'GET',
					url: `https://kg.diffbot.com/kg/v3/enhance?type=Person&url=${links[i]}&size=1&refresh=false&search=false&nonCanonicalFacts=false&useCache=false&jsonmode=%20&token=${process.env.DIFFBOT_KEY}`,
					headers: {accept: 'application/json'}
				};
				const diffreq = (await axios.request(options)).data;
				console.log(diffreq);
				// if(diffreq.data.length == 0) {
				// 	resultData.push({name: links[i], position: '', company: '', res: 'Linkedin account does not have valid scraping data!', type: type[j]});
				// 	continue;
				// }
				const leadName = (diffreq.data.length>0) ? diffreq.data[0].entity.name : links[i].split('/in/')[1].split('/')[0];
				const personalizedRes = ((links[i]) && (diffreq.data.length>0)) ? `You have the following personalized info on the customer: ${diffreq.data[0].entity.description}.` : `The customer's name is ${leadName}.`;
				// const personalizedRes = '';


				const currPrompt = (type[j] === 'Custom Prompt') ? prompts[type[j]].title : prompts[type[j]];
				
				const response = await openai.createChatCompletion({
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: 'user',
							content: `${aboutInput} ${currPrompt} ${personalizedRes} Make sure to add bits of their previous work experiences and make it relevant to your company values, and include light bits of humor.`
						}
					],
					max_tokens: 3000,
					temperature: 0,
					n: 1
				});
				
				
				resultData.push({
					name: leadName,
					position: '',
					company: '',
					res: response.data.choices[0].message?.content,
					type: type[j]
				});
			}
		}

		return res.status(200).json(resultData);

	} catch(e) {
		console.log('error');
		console.error(e);
	}
}