import { companyAPI } from '../../services/index'

export const publishAnnouncement = (announcementData) => {
  return companyAPI.post('/announcement', announcementData, {
    withCredentials: true,
  });
};