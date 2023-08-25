import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../lib/db-connector";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await getDBClient();
  try {
    const query = {
      text: `
        SELECT enum_range(NULL::day_of_week);
      `,
    };
    const result = await client.query(query);
    const enumRangeString = result.rows[0]["enum_range"];
    const enumRangeArray = enumRangeString
      .substring(1, enumRangeString.length - 1)
      .split(",");
    res.status(200).json(enumRangeArray);
    // const result = await client.query(query);
    // res.status(200).json(result.rows[0]["enum_range"]);
  } catch (error) {
    // Handle the error or rethrow it if needed
    throw error;
  }
};
