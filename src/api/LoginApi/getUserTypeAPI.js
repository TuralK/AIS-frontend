import axios from 'axios';

export const getUserType = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/`, {
          withCredentials: true
        })
        return response.data.userType;
    } catch (err) {
        return "";
    }
};
