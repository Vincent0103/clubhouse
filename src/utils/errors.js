// Error utility functions
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const notFound = (message = "Page not found") => createError(message, 404);
const forbidden = (message = "Access denied") => createError(message, 403);
const unauthorized = (message = "Authentication required") => createError(message, 401);
const badRequest = (message = "Bad request") => createError(message, 400);
const internalError = (message = "Internal server error") => createError(message, 500);

export { createError, notFound, forbidden, unauthorized, badRequest, internalError };
