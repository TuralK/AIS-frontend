import axios from 'axios';

export const applyAnnouncement = async (announcementID, studentData) => {
  const response = await axios.post(`http://localhost:3004/opportunities/${announcementID}`, studentData, {
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};