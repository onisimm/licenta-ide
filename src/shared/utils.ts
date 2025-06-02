/**
 * Utility functions for the IDE application
 */

/**
 * Converts any error-like object to a proper Error object with a meaningful message
 * This prevents "[object Event]" errors from appearing in the UI
 */
export const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (error instanceof Event) {
    return new Error(`Event error: ${error.type} (${error.constructor.name})`);
  }

  if (typeof error === 'string') {
    return new Error(error);
  }

  if (error && typeof error === 'object') {
    // Try to extract meaningful information from the error object
    const errorObj = error as any;
    const message = errorObj.message || errorObj.error || errorObj.toString();
    return new Error(message);
  }

  return new Error('Unknown error occurred');
};

/**
 * Safely gets an error message from any error-like object
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof Event) {
    return `Event error: ${error.type}`;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object') {
    const errorObj = error as any;
    return errorObj.message || errorObj.error || errorObj.toString();
  }

  return 'Unknown error occurred';
};

/**
 * Logs errors in a consistent format
 */
export const logError = (context: string, error: unknown): void => {
  const errorMessage = getErrorMessage(error);
  console.error(`[${context}] ${errorMessage}`, error);
};
