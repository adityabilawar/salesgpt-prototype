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
				if(diffreq.data.length == 0) {
					resultData.push({name: links[i], position: '', company: '', res: 'Linkedin account does not have valid scraping data!', type: type[j]});
					continue;
				}
				const personalizedRes = (links[i] && diffreq.data.length!==0) ? diffreq.data[0].entity.description : '';
				// const personalizedRes = '';


				const currPrompt = prompts[type[j]]
					.replace('MY_NAME', name)
					.replace('USER_POSITION', '')
					.replace('USER_COMPANY', '')
					.replace('USER_NAME', diffreq.data[0].entity.name);
				
				const response = await openai.createCompletion({
					model: "text-davinci-003",
					prompt: `${currPrompt} based on this background info on the receiver: ${personalizedRes}, and on behalf of ${aboutInput}`,
					max_tokens: 3000,
					temperature: 0,
					top_p: 1.0,
					frequency_penalty: 0.0,
					presence_penalty: 0.0,
				});
		
				resultData.push({
					name: diffreq.data[0].entity.name,
					position: '',
					company: '',
					res: response.data.choices[0].text,
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