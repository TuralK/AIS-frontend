import axios from 'axios';

export const fetchStudentProfileById = async (studentID) => {
    try {
        const response = await axios.get(`http://localhost:3004/profile/${studentID}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}