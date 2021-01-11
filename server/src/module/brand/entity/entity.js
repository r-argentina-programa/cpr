module.exports = class Brand {
  constructor({ id, name, product_fk }) {
    this.id = id;
    this.name = name;
    this.fkProduct = product_fk;
  }
};
