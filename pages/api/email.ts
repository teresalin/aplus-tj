import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(JSON.stringify({ id: req.headers['x-goog-authenticated-user-id'], email: req.headers['x-goog-authenticated-user-email'] }));
}
