import { studentAPI } from '../../services/index'

export const validateStudent = async () => {
    try {
        const response = await studentAPI.get(`/`, {
            withCredentials: true
        })
        return response.data.dataValues;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};
