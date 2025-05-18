import { studentAPI } from '../../../services/index'

export const fetchStudentProfileById = async (studentID) => {
    try {
        const response = await studentAPI.get(`/profile/${studentID}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}