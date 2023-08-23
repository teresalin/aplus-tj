import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

export interface Role {
  id: number;
  name: string;
}

function parseRole(row: any): Role {
  return {
    id: row.id,
    name: row.name,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
          SELECT id, name from staff_roles;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows.map(parseRole));
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
