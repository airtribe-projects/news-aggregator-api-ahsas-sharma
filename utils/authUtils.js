const bcrypt = require("bcrypt");

async function encryptPassword(plainTextPassword) {
  const saltRounds = await bcrypt.genSalt(10);
  const encryptedPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
  return encryptedPassword;
}

async function verifyPassword(password) {}

function generateToken() {}

module.exports = {
  encryptPassword,
  verifyPassword,
  generateToken,
};
