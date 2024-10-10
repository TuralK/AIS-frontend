import axios from 'axios';

export const forgotPassword = async (forgotEmail) => {
    try {
        const response = await axios.post('http://localhost/forgotPassword', {
            email: forgotEmail,
          }, {
            withCredentials: true,
          });
        return response;
    } catch (err) {
        if (err.response) {
            throw new Error(err.response.data.error || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};