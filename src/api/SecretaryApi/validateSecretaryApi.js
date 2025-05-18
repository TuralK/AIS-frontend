import { secretaryAPI } from '../../services/index'

export const validateSecretary = async () => {
    try {
        const response = await secretaryAPI.get(`/`, {
            withCredentials: true
        });
        return [response.data.dataValues,response.data.applications];
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data || "An error occurred");
        }
        throw new Error("An error occurred");
    }
};
