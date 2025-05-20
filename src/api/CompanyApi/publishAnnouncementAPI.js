import { companyAPI } from '../../services/index'

export const publishAnnouncement = (announcementData) => {
  return companyAPI.post('/application/announcement', announcementData, {
    withCredentials: true,
  });
};