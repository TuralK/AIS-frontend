import axios from 'axios';

// export const updateStudentProfilePhoto = async (profilePicture) => {
//     try {
//         const formData = new FormData();
//         formData.append('profilePicture', profilePicture);
//         const response = await axios.put('http://localhost:3004/profile/photo', formData, {
//             withCredentials: true,
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error(error);
//     }
// }

export const updateStudentProfilePhoto = async (formData) => {
    try {
        const response = await axios.put('http://localhost:3004/profile/photo', formData, { 
            withCredentials: true, 
            headers: { 'Content-Type': 'multipart/form-data' } 
        });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
  };
  