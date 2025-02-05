import axios from "axios";

const getMessages = async (apiUrl) => {
    try {
        const response = await axios.get(apiUrl, {
            withCredentials: true
        });

        const messages = response.data.messages;

        return messages;
    } catch (error) {
        console.error('Failed to fetch messages', error);
        return null;
    }
};

const getSentMessages = async (apiUrl) => {
    try {
        const response = await axios.get(apiUrl, {
            withCredentials: true
        });

        const messages = response.data.messages;

        return messages;
    } catch (error) {
        console.error('Failed to fetch messages', error);
        return null;
    }
};

export const updateMessageStatus = async (apiUrl, messageId) => {
    try {

        const response = await axios.get(`${apiUrl + messageId}`, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        console.error("Mesaj durumu güncellenemedi:", error);
        return null;
    }
};

const sendMessage = async (apiUrl, message, topic, receiverEmail, file = null) => {
    try {
        // If there is a file to send, we use FormData, otherwise we send it as JSON.
        let response;

        if (file) {
            const formData = new FormData();
            formData.append("message", message);
            formData.append("topic", topic);
            formData.append("receiverEmail", receiverEmail);
            formData.append("file", file); // file which backend endpoint expects 

            response = await axios.post(apiUrl, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } else {
            // If there is no file, we send it as JSON body.
            response = await axios.post(
                apiUrl,
                {
                    message,
                    topic,
                    receiverEmail
                },
                {
                    withCredentials: true
                }
            );
        }

        return response.data;
    } catch (error) {
        console.error("Failed to send message", error);
        throw error;
    }
};

const deleteMessage = async (apiUrl, messageId) => {
    try {
        console.log(`Mesaj siliniyor... ${messageId}`);
        const response = await axios.delete(`${apiUrl}/deleteMessage/${messageId}`, {
            withCredentials: true, 
        });
        return response.data;
    } catch (error) {
        console.error("Mesaj silinirken hata oluştu:", error);
        throw error;
    }
};

export { getMessages, sendMessage, getSentMessages, deleteMessage};