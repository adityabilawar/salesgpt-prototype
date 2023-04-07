import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";
import fs from 'fs';
import xlsx from 'xlsx';
import { Configuration, OpenAIApi } from 'openai';
import { MessageType, ResponseData } from '@/@types/Response';

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
			const name = (typeof fields.name === 'string') ? fields.name : '';
			const prompts = (typeof fields.prompts === 'object') ? fields.prompts : {
				'Linkedin invite': 'Hi! Can you write me a 300 character linkedin invite message on behalf of MY_NAME to the USER_POSITION of the company USER_COMPANY whos name is USER_NAME explaining that you want to help provide value to their business.',
				'Intro Email': 'Write me a personlized introduction email to USER_NAME, who has the USER_POSITION position at the company USER_COMPANY on behalf of MY_NAME explaining that I want to help provide value to their business & request a phone call',
				'Coffee Chat': 'Write me 5 coffee chat questions on behalf of MY_NAME to ask to USER_NAME that has the USER_POSITION position at the company USER_COMPANY.'
			};
			const messageType: MessageType = (typeof fields.type === 'string') ? fields.type as MessageType : 'Linkedin invite';
			const workbook = xlsx.readFile(files.file.filepath);
			const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
			fs.unlinkSync(files.file.filepath);
			const responseData = await getResponses(data, name, messageType, prompts);
			// const responseData = Array(10).fill(
			// 	{
			// 		name: 'Elon Musk',
			// 		position: 'CEO',
			// 		company: 'Tesla',
			// 		res: 'My message here',
			// 		type: messageType
			// 	}
			// );
			return res.status(200).json(responseData);
		});
	} catch(e) {
		console.error(e);
	}
}

const getResponses = async(data: any[], name: string, type: MessageType, prompts: any) => {
	const resultData: ResponseData[] = [];
	
	for(let i = 0; i < data.length; i++) {
		const userName = data[i].Name;
		const userPosition = data[i].Position;
		const userCompany = data[i].Company;

		const currPrompt = prompts[type]
			.replace('MY_NAME', name)
			.replace('USER_POSITION', userPosition)
			.replace('USER_COMPANY', userCompany)
			.replace('USER_NAME', userName);

		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: currPrompt,
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
			type
		});
	}

	return resultData;
}