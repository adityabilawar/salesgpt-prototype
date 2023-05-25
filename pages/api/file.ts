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
				'Linkedin invite': 'Make a brief 200 word linkedin invite message for this potential customer. Make sure this message is personalized for the customer and include light bits of humor.',
				'Intro Email': 'Make a brief 200 word introduction email for this potential customer. Make sure this message is personalized for the customer and include light bits of humor.',
				'Coffee Chat': 'List out 5 coffee chat questions you can have with this person. Make the questions personalized and add light bits of humor.',
				'Custom Prompt': {
					title: 'Custom Prompt',
					prompt: 'Say "You have not made a custom prompt in the editor yet!"'
				}
			};
			const about: About = (typeof fields.about === 'string') ? JSON.parse(fields.about) : {
				firstName: '',
				lastName: '',
				companyName: '',
				jobTitle: '',
				companyDetails: '',
				companyValue: '',
				specialOffers: ''
			};
			const messageTypes: MessageType[] = (typeof fields.type === 'string') ? JSON.parse(fields.type) as MessageType[] : ['Linkedin invite'];
			let auth = (typeof fields.storage === 'string') ? JSON.parse(fields.storage) : {};
			auth = JSON.parse(auth);
			if((auth.user !== 'admin') || (auth.pass !== process.env.ADMIN_PASS)) return res.status(400).json({ error: 'Invalid auth! User is not admin' });
			const workbook = xlsx.readFile(files.file.filepath);
			const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
			fs.unlinkSync(files.file.filepath);
			const responseData: any = await getResponses(data, auth.user, messageTypes, prompts, getAboutInput(about));
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

export const getAboutInput = (about: About) => {
	const name = `${about.firstName} ${about.lastName}`;
	let inp = `Never forget your name is ${name}.`;
	if(about.jobTitle) inp+=` You work as a ${about.jobTitle}.`;
	if(about.companyName) inp+=` You work at a company named ${about.companyName}.`;
	if(about.companyDetails) inp+=` The company's business does the following: ${about.companyDetails}.`;
	if(about.companyValue) inp+=` The company values are the following: ${about.companyValue}.`;
	if(about.specialOffers) inp+=`The company is holding the following special offers: ${about.specialOffers}.`;
	if(about.purpose) inp+=`You are contacting a potential customer for the following purpose: ${about.purpose}.`;
	
	return inp;
}

const getResponses = async(data: any[], name: string, type: MessageType[], prompts: any, aboutInput: string) => {
	const resultData: ResponseData[] = [];
	
	for(let i = 0; i < data.length; i++) {
		for(let j = 0; j < type.length; j++) {
				const userName = data[i].Name;
				const userPosition = data[i].Position;
				const userCompany = data[i].Company;
		
				const currPrompt = (type[j] === 'Custom Prompt') ? prompts[type[j]].title : prompts[type[j]];
				
				const options = {
					method: 'GET',
					url: `https://kg.diffbot.com/kg/v3/enhance?type=Person&url=${data[i].Social}&size=1&refresh=false&search=false&nonCanonicalFacts=false&useCache=false&jsonmode=%20&token=${process.env.DIFFBOT_KEY}`,
					headers: {accept: 'application/json'}
				  };
				  
				const diffreq = (await axios.request(options)).data;
				const personalizedRes = (data[i].Social && diffreq.data.length!=0) ? diffreq.data[0].entity.description : '';
				// const personalizedRes = '';

				const response = await openai.createChatCompletion({
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: 'user',
							content: `${aboutInput} ${currPrompt} You have the following personalized info on the customer: ${personalizedRes}. Make sure to add bits of their previous work experiences and make it relevant to your company values, and include light bits of humor.`
						}
					],
					max_tokens: 3000,
					temperature: 0,
					n: 1
				});
		
				resultData.push({
					name: diffreq.data[0].entity.name,
					position: '',
					company: '',
					res: response.data.choices[0].message?.content,
					type: type[j]
				});
		}
	}

	return resultData;
}