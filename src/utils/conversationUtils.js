
export const scrollToBottom = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
};

