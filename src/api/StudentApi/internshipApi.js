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

const finishInternship = async (internshipId) => {
    try {
      const response = await axios.put("http://localhost:3004/internship/finishInternship", {
        internshipId: internshipId
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
        return response
    } catch (error) {
      console.error("Error:", error.response?.data || error.message)
    }
  }