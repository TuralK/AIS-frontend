import { companyAPI } from "../../services/index";

export const getInternships = async () => {
    try {
        const response = await companyAPI.get('/internship/internships', {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
  
};