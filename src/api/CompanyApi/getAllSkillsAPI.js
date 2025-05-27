import { companyAPI } from "../../services/index";

export const getAllSkills = async () => {
    try {
        const response = await companyAPI.get(`/application/skills`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};