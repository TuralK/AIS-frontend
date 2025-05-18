import { adminAPI } from '../../services/index'

export const fetchAnnouncementById = async (id) => {
  try {
    const response = await adminAPI.get(`/announcement/${id}`, {
      withCredentials: true,
    });
    return response.data.announcement;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateAnnouncementById = async (id, isApproved, feedback) => {
  try {
    await adminAPI.put(`/announcement/${id}`, {
      isApproved,
      feedback
    }, {
      withCredentials: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};