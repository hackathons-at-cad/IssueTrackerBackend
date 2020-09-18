let crypto = require('crypto');

class Utility {
  constructor() {}

  scretString() {
    return crypto.randomBytes(64).toString('hex');
  }
}

module.exports.Utility;
