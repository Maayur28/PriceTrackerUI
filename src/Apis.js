import axios from "axios";

const ORCHESTRATION_BASE_URL = "https://orch.trackprice.co.in";

export const fetchData = async (val) => {
  let data = null;
  const client = axios.create({
    baseURL: ORCHESTRATION_BASE_URL,
  });
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
  let response = await client.get(`/scrap?url=${val}`, config);
  if (
    response.status === 200 &&
    response.data != null &&
    response.data !== undefined &&
    response.data !== "" &&
    response.data.response != null &&
    response.data.response !== undefined &&
    response.data.response !== ""
  ) {
    data = response.data.response;
  } else {
    throw new Error("Please try again");
  }
  return data;
};
