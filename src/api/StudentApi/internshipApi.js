import axios from 'axios';

export const uploadApplicationForm = async (file) => {
    const formData = new FormData()
    formData.append("ApplicationForm", file)
  
    const response = await axios.post("http://localhost:3004/internship/applicationForm", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    return response
}

export const finishInternship = async () => {
    try {
      const response = await axios.put(
        "http://localhost:3004/internship/finishInternship",
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
      const response = await axios.get("http://localhost:3004/internship", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching internship:", error.response?.data || error.message);
      throw error;
    }
  };


  export const requestLink = async (applicationId) => {
    return axios.post(
      `http://localhost:3004/internship/requestLink`,
      { applicationId },
      { withCredentials: true }
    );
  };