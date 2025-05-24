import { studentAPI } from '../../services/index'

export const uploadManualApplicationForm = async (file, companyName, companyEmail) => {
  try {
    const formData = new FormData();
    formData.append('ApplicationForm', file);
    formData.append('companyName', companyName);
    formData.append('companyEmail', companyEmail);

    const response = await studentAPI.post("/internship/applicationForm", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })

    return response;
  } catch (error) {
    throw error;
  }
}

export const finishInternship = async () => {
  try {
    const response = await studentAPI.put(
      "/internship/finishInternship",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const getInternship = async () => {
  try {
    const response = await studentAPI.get("/internship/info", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching internship:", error.response?.data || error.message);
    throw error;
  }
};


export const requestLink = async (companyName, companyEmail) => {
  return studentAPI.post(
    `/internship/requestLink`,
    {
      companyName,
      companyEmail
    },
    { withCredentials: true }
  );
};