const fs = require("fs");

const errorLogger = (err, req, res, next) => {
  if (err) {
    fs.writeFile("/error.txt", err, { flag: "a+" });
    next();
  }
};

module.exports = errorLogger;
