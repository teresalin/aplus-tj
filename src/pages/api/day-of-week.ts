import { getDBClient, releaseDBClient } from "../../../lib/db-connector";
import { NextApiRequest, NextApiResponse } from "next";

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
    res.status(200).json({
      status: "Success",
      result: enumRangeArray,
      message: "Days of week retrieved successfully.",
    });
  } catch (error) {
    console.error("Error retrieving days of week", error);
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
