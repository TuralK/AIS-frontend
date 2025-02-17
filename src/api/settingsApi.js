import axios from 'axios'


export const getInfo = async (apiUrl) => {
    const response = await axios.get(`${apiUrl}/personalInfo`, {
        withCredentials: true
    })
    return response.data
}

export const updateUserInfoApi = async (
    apiUrl,
    payload
) => {
    const response = await axios.post(`${apiUrl}/personalInfo`, payload, {
        withCredentials: true,

    })
    return response.data
}