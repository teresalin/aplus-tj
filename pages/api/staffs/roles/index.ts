import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

export interface Role {
  id: number;
  name: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const getQuery = {
      text: `
          SELECT id, name from staff_role;
        `,
    };
    const result = await client.query(getQuery);
    res.status(200).json(result.rows as Role[]);
  } catch (error) {
    console.error("Error retrieving staff roles", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
