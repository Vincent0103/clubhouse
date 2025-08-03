import { formatDistance } from "date-fns";

const asteriskize = (text) => text.replace(/./g, "*");

const formatMessages = (messages) =>
  messages.map((message) => ({
    ...message,
    created_at: formatDistance(message.created_at, new Date()),
  }));

export { asteriskize, formatMessages };
