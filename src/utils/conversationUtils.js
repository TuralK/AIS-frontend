import { updateMessageStatus } from "../api/messageApi";


export const scrollToBottom = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
};

export const markMessagesAsRead = async (conversation, apiUrl) => {
    await Promise.all(
        conversation.messages
            .filter((msg) => msg.type === "received" && msg.status !== "read")
            .map((msg) => updateMessageStatus(apiUrl, msg.id))
    );
};
