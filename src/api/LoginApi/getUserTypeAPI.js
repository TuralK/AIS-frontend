import { loginAPI } from '../../services/index'

export const getUserType = async () => {
    try {
        const response = await loginAPI.get(`/`, {
          withCredentials: true
        });
        localStorage.removeItem("conversationId");
        return response.data.userType;
    } catch (err) {
        return "";
    }
};
