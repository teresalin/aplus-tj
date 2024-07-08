import { ApiResponse } from "../utils/apiResponse";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data: ApiResponse = await response.json();

  console.log("fetcher");
  console.log(data);

  if (data.status === "Error") {
    const errorMessage =
      data.error?.message || "An error occurred while fetching data.";
    throw new Error(errorMessage);
  }

  return data.result;
};

export default fetcher;
