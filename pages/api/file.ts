import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";
import fs from 'fs';
import xlsx from 'xlsx';

interface ResponseData {
	name: string
	position: string
	company: string
	res: string
	type: string
}

export const config = {
	api: {
		bodyParser: false
	}
}

export default (req: NextApiRequest, res: NextApiResponse) => {
	if(req.method !== 'POST') return res.status(404).send("only POST allowed");

	const { name } = req.body;
	const form = new formidable.IncomingForm();
	form.parse(req, async(err, fields, files) => {
		if(Array.isArray(files.file)) return res.status(404).send("array files");
		const workbook = xlsx.readFile(files.file.filepath);
		const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
		return await getResponses(data, name);
	});
}

const LETTER_TYPES = ['Linkedin invite', 'Intro Email', 'Coffee Chat'];

const getResponses = async(data: unknown[], name: string) => {
	
}