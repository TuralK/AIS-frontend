import { studentAPI } from '../../services/index'

export const applyAnnouncement = async (announcementID, studentData) => {
  const response = await studentAPI.post(`/application/opportunities/${announcementID}`, studentData, {
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};