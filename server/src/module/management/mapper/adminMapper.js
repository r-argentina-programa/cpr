const Admin = require('../entity/Admin');

function fromDataToEntity({ id, username, password }) {
  return new Admin({
    id,
    username,
    password,
  });
}

module.exports = {
  fromDataToEntity,
};
