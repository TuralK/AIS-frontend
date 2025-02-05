export const groupConversations = (messages, sentMessages) => {
    const grouped = {};

    messages.forEach((message) => {
        if (!grouped[message.from]) {
            grouped[message.from] = {
                from: message.from,
                senderName: message.senderName,
                topic: message.topic || '',
                messages: [],
            };
        }
        grouped[message.from].messages.push({ ...message, type: 'received' });
    });

    sentMessages.forEach((message) => {
        if (!grouped[message.to]) {
            grouped[message.to] = {
                from: message.to,
                senderName: message.receiverName,
                topic: message.topic || '',
                messages: [],
            };
        }
        grouped[message.to].messages.push({ ...message, type: 'sent' });
    });

    return Object.values(grouped)
        .map(conversation => {
            conversation.messages.sort((a, b) => a.id - b.id);
            return conversation;
        })
        .sort((a, b) => {
            const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || 0;
            return lastMsgB;
        });
};

export const checkIsMobile = (setIsMobile) => {
    const updateMobileState = () => setIsMobile(window.innerWidth <= 640);
    updateMobileState();
    window.addEventListener('resize', updateMobileState);
    return () => window.removeEventListener('resize', updateMobileState);
};
