require('dotenv').config();
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

const {
  BrandController,
  BrandModel,
  BrandRepository,
  BrandService,
} = require('../module/brand/module');

const { ManagementController } = require('../module/management/module');

function configureSequelizeDatabase() {
  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
<<<<<<< HEAD
=======
    logging: false,
>>>>>>> 4b9b8a8ac124881ca6be5abe2de223e50431fb30
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

function configureBrandModel(container) {
  return BrandModel.setup(container.get('Sequelize'));
}

function addProductModuleDefinitions(container) {
  container.addDefinitions({
    ProductController: object(ProductController).construct(get('ProductService'), get('Multer')),
    ProductService: object(ProductService).construct(get('ProductRepository')),
    ProductRepository: object(ProductRepository).construct(get('ProductModel')),
    ProductModel: factory(configureProductModel),
  });
}

function addBrandModuleDefinitions(container) {
  container.addDefinitions({
    BrandController: object(BrandController).construct(get('BrandService')),
    BrandService: object(BrandService).construct(get('BrandRepository')),
    BrandRepository: object(BrandRepository).construct(get('BrandModel')),
    BrandModel: factory(configureBrandModel),
  });
}

function addManagementModuleDefinitions(container) {
  container.addDefinitions({
    ManagementController: object(ManagementController).construct(
      get('BrandService'),
      get('ProductService')
    ),
  });
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addProductModuleDefinitions(container);
  addBrandModuleDefinitions(container);
  addManagementModuleDefinitions(container);
  return container;
};
