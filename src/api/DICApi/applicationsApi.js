import { adminAPI } from '../../services/index'

const fetchApplicationRequests = async () => {
  try {
    const response = await adminAPI.get('/applicationRequests', {
      withCredentials: true
    });

    // Check if the response is OK and return the data
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

export default fetchApplicationRequests;
