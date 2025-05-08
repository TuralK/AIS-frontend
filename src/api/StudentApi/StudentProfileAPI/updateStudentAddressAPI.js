import axios from 'axios';

export const updateStudentAddress = async (address) => {
    try {
        const response = await axios.put('http://localhost:3004/profile/address', {address}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}