import axios from 'axios';

export const fetchAnnouncementById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3003/announcement/${id}`, {
      withCredentials: true,
    });
    return response.data.announcement;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateAnnouncementById = async (id, isApproved, feedback) => {
  try {
    await axios.put(`http://localhost:3003/announcement/${id}`, {
      isApproved,
      feedback
    }, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};