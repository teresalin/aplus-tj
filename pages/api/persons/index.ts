import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";
import { parsePerson } from "../../../utils/apiUtils";

export interface Person {
  personId: number;
  name: string;
  gender: string;
  phone: string;
  email: string;
  dateOfBirth: Date;
  notes: string;
  active: boolean;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();

  try {
    const query = {
      text: `
        SELECT * from person;
      `,
    };
    const result = await client.query(query);
    res.status(200).json({
      status: "Success",
      result: result.rows.map(parsePerson),
      message: "Users retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving users", error);
    res.status(500).json({
      status: "Error",
      message: "Internal server error",
    });
  } finally {
    if (client) {
      await releaseDBClient(client);
    }
  }
};
