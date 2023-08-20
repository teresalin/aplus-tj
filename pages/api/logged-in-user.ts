import { NextApiRequest, NextApiResponse } from 'next';
import { getDBClient } from '../../lib/db-connector';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  const { email } = req.query;
  const query = {
    text: `
      SELECT * FROM users WHERE users.email = $1;
    `,
    values: [email],
  };
  try {
    const r = await client.query(query);
    res.status(200).json(r.rows[0]);
  } catch (err) {
    res.status(err.response.status).json({ message: err.response.data });
  } 
}
