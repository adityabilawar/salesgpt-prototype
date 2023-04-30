import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";
import fs from 'fs';
import xlsx from 'xlsx';
import { Configuration, OpenAIApi } from 'openai';
import { MessageType, ResponseData } from '@/@types/Response';
import axios from 'axios';

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
const openai = new OpenAIApi(configuration);

export const config = {
	api: {
		bodyParser: false
	}
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	if(req.method !== 'POST') return res.status(404).send("only POST allowed");

	try {
		const form = new formidable.IncomingForm({ uploadDir: '/tmp' });
		form.parse(req, async(err, fields, files) => {
			if(Array.isArray(files.file)) return res.status(404).send("array files");
			if(err) {
				console.error(err);
				return res.status(404).send('error while parsing file');
			}
			const prompts = (typeof fields.prompts === 'string') ? JSON.parse(fields.prompts) : {
				'Linkedin invite': 'Hi! Can you write me a 300 character linkedin invite message on behalf of MY_NAME to the USER_POSITION of the company USER_COMPANY whos name is USER_NAME explaining that you want to help provide value to their business.',
				'Intro Email': 'Write me a personlized introduction email to USER_NAME, who has the USER_POSITION position at the company USER_COMPANY on behalf of MY_NAME explaining that I want to help provide value to their business & request a phone call',
				'Coffee Chat': 'Write me 5 coffee chat questions on behalf of MY_NAME to ask to USER_NAME that has the USER_POSITION position at the company USER_COMPANY.',
				'Custom Prompt': 'Say "You have not made a custom prompt in the editor yet!"'
			};
			const messageTypes: MessageType[] = (typeof fields.type === 'string') ? JSON.parse(fields.type) as MessageType[] : ['Linkedin invite'];
			let auth = (typeof fields.storage === 'string') ? JSON.parse(fields.storage) : {};
			auth = JSON.parse(auth);
			if((auth.user !== 'admin') || (auth.pass !== process.env.ADMIN_PASS)) return res.status(400).json({ error: 'Invalid auth! User is not admin' });
			const workbook = xlsx.readFile(files.file.filepath);
			const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
			fs.unlinkSync(files.file.filepath);
			const responseData: any = await getResponses(data, auth.user, messageTypes, prompts);
			// const responseData = Array(10).fill(
			// 	{
			// 		name: 'Elon Musk',
			// 		position: 'CEO',
			// 		company: 'Tesla',
			// 		res: 'My message here',
			// 		type: messageTypes
			// 	}
			// );
			return res.status(200).json(responseData);
		});
	} catch(e) {
		console.error(e);
	}
}

const getResponses = async(data: any[], name: string, type: MessageType[], prompts: any) => {
	const resultData: ResponseData[] = [];
	
	for(let i = 0; i < data.length; i++) {
		for(let j = 0; j < type.length; j++) {
				const userName = data[i].Name;
				const userPosition = data[i].Position;
				const userCompany = data[i].Company;
		
				const currPrompt = prompts[type[j]]
					.replace('MY_NAME', name)
					.replace('USER_POSITION', userPosition)
					.replace('USER_COMPANY', userCompany)
					.replace('USER_NAME', userName);
				
				const options = {
					method: 'GET',
					url: `https://kg.diffbot.com/kg/v3/enhance?type=Person&url=${data[i].Social}&size=1&refresh=false&search=false&nonCanonicalFacts=false&useCache=false&jsonmode=%20&token=${process.env.DIFFBOT_KEY}`,
					headers: {accept: 'application/json'}
				  };
				  
				const diffreq = (await axios.request(options)).data;
				const personalizedRes = (data[i].Social && diffreq.data.length!=0) ? diffreq.data[0].entity.description : '';
				// const personalizedRes = '';

				const response = await openai.createCompletion({
					model: "text-davinci-003",
					prompt: `${currPrompt} based on this background info: ${personalizedRes}`,
					max_tokens: 3000,
					temperature: 0,
					top_p: 1.0,
					frequency_penalty: 0.0,
					presence_penalty: 0.0,
				});
		
				resultData.push({
					name: userName,
					position: userPosition,
					company: userCompany,
					res: response.data.choices[0].text,
					type: type[j]
				});
		}
	}

	return resultData;
}