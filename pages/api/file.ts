import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";
import fs from 'fs';
import xlsx from 'xlsx';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });
const openai = new OpenAIApi(configuration);

interface ResponseData {
	name: string
	position: string
	company: string
	res: string | undefined
	type: string
}

export const config = {
	api: {
		bodyParser: false
	}
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	if(req.method !== 'POST') return res.status(404).send("only POST allowed");

	// const { name } = req.body;
	const form = new formidable.IncomingForm();
	form.parse(req, async(err, fields, files) => {
		if(Array.isArray(files.file)) return res.status(404).send("array files");
		if(err) {
			console.error(err);
			return res.status(404).send('error while parsing file');
		}
		const workbook = xlsx.readFile(files.file.filepath);
		const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
		const responseData = await getResponses(data, 'Om Patel');
		console.log(responseData);
		return res.status(200).json(responseData);
	});
}

const LETTER_TYPES = ['Linkedin invite', 'Intro Email', 'Coffee Chat'];

const getResponses = async(data: any[], name: string) => {
	const resultData: ResponseData[] = [];
	
	for(let i = 0; i < data.length; i++) {
		const userName = data[i].Name;
		const userPosition = data[i].Position;
		const userCompany = data[i].Company;

		const LETTER_PROMPTS = [
			`Hi! Can you write me a 300 character linkedin invite message on behalf of ${name} to the ${userPosition} of the company ${userCompany} whos name is ${userName} explaining that you want to help provide value to their business.`,
			`Write me a personlized introduction email to ${userName}, who has the ${userPosition} position at the company ${userCompany} on behalf of ${name} explaining that I want to help provide value to their business & request a phone call`,
			`Write me 5 coffee chat questions on behalf of ${name} to ask to ${userName} that has the ${userPosition} position at the company ${userCompany}.`
		];

		for(let j = 0; j < LETTER_PROMPTS.length; j++) {
			const response = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: LETTER_PROMPTS[j],
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
				type: LETTER_TYPES[j]
			});
		}
	}

	return resultData;
}