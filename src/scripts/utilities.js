import { formatDistance } from "date-fns";

const asteriskize = (text) => text.replace(/./g, "*");

const formatMessages = (messages) =>
  messages.map((message) => ({
    ...message,
    created_at: formatDistance(message.created_at, new Date()),
  }));

const validationErrorMessages = (() => {
  const alphaErr = "must only contain letters.";
  const alphaNumericErr =
    "can only contain letters, numbers, spaces and one of these characters (_-.'\"@#%&*,!?:;()[]).";
  const lengthErr = (min, max) =>
    `must be between ${min} and ${max} characters.`;
  const emailErr = 'must be in valid format: "hello@example.com".';
  const lowerCaseErr = "have atleast one lowercase letter (a-z)";
  const upperCaseErr = "have atleast one uppercase letter (A-Z)";
  const digitErr = "have atleast one digit (0-9)";
  const specialCharErr = "have atleast one special character (@$!%*?&)";
  const matchPasswordErr = "do not match.";

  return {
    alphaErr,
    alphaNumericErr,
    lengthErr,
    emailErr,
    lowerCaseErr,
    upperCaseErr,
    digitErr,
    specialCharErr,
    matchPasswordErr,
  };
})();

export { asteriskize, formatMessages, validationErrorMessages };
