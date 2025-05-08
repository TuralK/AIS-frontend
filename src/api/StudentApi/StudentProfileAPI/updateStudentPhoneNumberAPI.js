import axios from 'axios';

export const updateStudentPhoneNumber = async (phoneNumber) => {
    try {
        const response = await axios.put('http://localhost:3004/profile/phoneNumber', {phoneNumber}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}