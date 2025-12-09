const axios = require("axios");

module.exports = async () => {
  const result = await axios.get("https://placegoat.com/");

  return result.data.file;
};