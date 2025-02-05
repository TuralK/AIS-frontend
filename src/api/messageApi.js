import axios from "axios";

const getMessages = async (api) => {
    try {
        const response = await axios.get(api, {
            withCredentials: true
        });

        const messages = response.data.messages;

        return messages;
    } catch (error) {
        console.error('Failed to fetch messages', error);
        return null;
    }
};

const getSentMessages = async (api) => {
    try {
        const response = await axios.get(api, {
            withCredentials: true
        });

        const messages = response.data.messages;
        
        return messages;
    } catch (error) {
        console.error('Failed to fetch messages', error);
        return null;
    }
};

export const updateMessageStatus = async (api, messageId) => {
  try {
    
    const response = await axios.get(`${api+messageId}`,{
        withCredentials: true
    });

    return response.data;
  } catch (error) {
    console.error("Mesaj durumu güncellenemedi:", error);
    return null;
  }
};


const sendMessage = async (api, message, topic, receiverEmail, file = null) => {
    try {
        // If there is a file to send, we use FormData, otherwise we send it as JSON.
        let response;

        if (file) {
            const formData = new FormData();
            formData.append("message", message);
            formData.append("topic", topic);
            formData.append("receiverEmail", receiverEmail);
            formData.append("file", file); // file which backend endpoint expects 

            response = await axios.post(api, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } else {
            // If there is no file, we send it as JSON body.
            response = await axios.post(
                api,
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

export { getMessages, sendMessage, getSentMessages };