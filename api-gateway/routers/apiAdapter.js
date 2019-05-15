// Elijah Augustin
const axios = require('axios');

// This method takes a url string.
// Forwards request to proper services.
//
// @param urlString This is the first paramter to the method
//
// @return
module.exports = (baseURL) => {
  console.log("Forwarding service requests to: " + baseURL);
  return axios.create({
    baseURL: baseURL,
  });
}
