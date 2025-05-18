import { loginAPI } from '../../services/index'

export const forgotPassword = async (forgotEmail) => {
    try {
        const response = await loginAPI.post('/forgotPassword', {
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