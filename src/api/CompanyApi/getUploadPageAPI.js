import { companyAPI } from "../../services/index";

export const getUploadPage = async (token) => {
  console.log("Fetching upload page with token:", token);
  try {
    const response = await companyAPI.get(`/internship/upload`, {
      params: {
        token: token,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};