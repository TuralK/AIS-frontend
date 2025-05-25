import { adminAPI } from '../../services/index'

const fetchInternships = async () => {
  try {
    const response = await adminAPI.get('internship/internships', {
      withCredentials: true
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch application requests');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while fetching application requests:', error);
    return null;
  }
};

export default fetchInternships;
