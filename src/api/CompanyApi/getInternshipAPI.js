import { companyAPI } from "../../services/index";

export const getInternship = async (internshipId) => {
    try {
        const response = await companyAPI.get(`/internship/internships/${internshipId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
};