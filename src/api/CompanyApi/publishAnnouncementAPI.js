import axios from 'axios';

export const publishAnnouncement = (announcementData) => {
  return axios.post('http://localhost:3005/announcement', announcementData, {
    withCredentials: true,
  });
};