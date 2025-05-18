import { studentAPI } from '../../../services/index'

export const updateStudentAddress = async (address) => {
    try {
        const response = await studentAPI.put('/profile/address', {address}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}