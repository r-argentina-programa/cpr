const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');

const {
  ProductController,
  ProductModel,
  ProductRepository,
  ProductService,
} = require('../module/product/module');

function configureSequelizeDatabase() {
  return new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
}

function configureMulter() {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.resolve(__dirname, '..', '..', 'public', 'uploads'));
    },
    filename(req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  return multer({ storage });
}

function addCommonDefinitions(container) {
  container.addDefinitions({
    Sequelize: factory(configureSequelizeDatabase),
    Multer: factory(configureMulter),
  });
}

function configureProductModel(container) {
  return ProductModel.setup(container.get('Sequelize'));
}

function addProductModuleDefinitions(container) {
  container.addDefinitions({
    ProductController: object(ProductController).construct(get('ProductService'), get('Multer')),
    ProductService: object(ProductService).construct(get('ProductRepository')),
    ProductRepository: object(ProductRepository).construct(get('ProductModel')),
    ProductModel: factory(configureProductModel),
  });
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addProductModuleDefinitions(container);
  return container;
};
