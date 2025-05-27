import { studentAPI } from '../../services/index'

export const getMatchingAnnouncements = async () => {
    try {
        const response = await studentAPI.get('/application/opportunities/matchingSkills', {
            withCredentials: true,
        });
        console.log("Matching Opportunities:", response.data);
        return response.data.opportunities;
    } catch (error) {
        throw new Error(error);
    }
};