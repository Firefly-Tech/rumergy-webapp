/**
 * Helper function to build status responses.
 *
 * @function buildStatus
 * @param {boolean} success
 * @param {string} errorMessage
 **/
export const buildStatus = (success, errorMessage = "") => {
  return { success: success, errorMessage: errorMessage };
};
