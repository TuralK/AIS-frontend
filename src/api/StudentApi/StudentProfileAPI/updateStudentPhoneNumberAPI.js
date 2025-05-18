import { studentAPI } from '../../../services/index'

export const updateStudentPhoneNumber = async (phoneNumber) => {
    try {
        const response = await studentAPI.put('/profile/phoneNumber', {phoneNumber}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}