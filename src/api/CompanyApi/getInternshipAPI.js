import { companyAPI } from "../../services/index";

export const getInternshipById = async (internshipId) => {
    try {
        const response = await companyAPI.get(`/internship/internships/${internshipId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error);
    }
};