const axios = require('axios');


module.exports = (baseURL) => {
  console.log("Forwarding service requests to: " + baseURL);
  return axios.create({
    baseURL: baseURL,
  });
}
