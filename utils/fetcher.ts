import { ApiResponse } from "../utils/apiResponse";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data: ApiResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "An error occurred while fetching data.");
  }
  return data.result; // Return the result field if it exists
};

export default fetcher;
