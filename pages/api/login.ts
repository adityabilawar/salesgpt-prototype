import type { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
	if(req.method !== 'POST') return res.status(404).send("only POST allowed");

	try {
		const { user, pass } = req.body;
		if((user !== 'admin') && (pass !== process.env.ADMIN_PASS)) return res.status(400).json({ error: 'Invalid password' });
		else return res.json({ login: true });
	} catch(e) {
		console.error(e);
	}
}