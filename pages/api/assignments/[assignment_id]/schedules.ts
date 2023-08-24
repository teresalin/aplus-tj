import { NextApiRequest, NextApiResponse } from "next";
import { getDBClient } from "../../../../lib/db-connector";

export interface Schedule {
  id: string;
  classId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

function parsePatient(row: any): Schedule {
  return {
    id: row.id,
    classId: row.class_id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
  };
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const trialID = req.query.trial_id;
  const client = await getDBClient();
  const { status } = req.query;
  const query = {
    text: `
      SELECT patients.id as id, patients.age, patients.sex, match.id as match_id
      FROM match
      INNER JOIN patients ON patients.id = match.patient_id
      WHERE 
        match.trial_id = $1
        AND match.status = $2;
    `,
    values: [trialID, status],
  };
  const r = await client.query(query);
  res.status(200).json(r.rows.map(parsePatient));
};
