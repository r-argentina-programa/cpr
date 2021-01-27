module.exports = class Admin {
  /**
   * @param {number} id
   * @param {string} username
   * @param {string} password
   */
  constructor({ id, username, password }) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
};
