
/**
 * @param {boolean} ok - success or fail.
 * @param {Object} data - Response data.
 * @param {string} message - Optional Message 
 */
function apiResponse(ok, data, message = '') {
  return {
    ok, data, message
  }
}

module.exports = apiResponse