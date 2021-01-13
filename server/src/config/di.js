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

const {
  CategoryController,
  CategoryModel,
  CategoryRepository,
  CategoryService,
} = require('../module/category/module');

const { ManagementController } = require('../module/management/module');

function configureSequelizeDatabase() {
  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
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

function configureCategoryModel(container) {
  return CategoryModel.setup(container.get('Sequelize'));
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

function addCategoryModuleDefinitions(container) {
  container.addDefinitions({
    CategoryController: object(CategoryController).construct(get('CategoryService')),
    CategoryService: object(CategoryService).construct(get('CategoryRepository')),
    CategoryRepository: object(CategoryRepository).construct(get('CategoryModel')),
    CategoryModel: factory(configureCategoryModel),
  });
}

function addManagementModuleDefinitions(container) {
  container.addDefinitions({
    ManagementController: object(ManagementController).construct(
      get('BrandService'),
      get('ProductService'),
      get('CategoryService'),
      get('Multer')
    ),
  });
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addProductModuleDefinitions(container);
  addBrandModuleDefinitions(container);
  addCategoryModuleDefinitions(container);
  addManagementModuleDefinitions(container);
  return container;
};
