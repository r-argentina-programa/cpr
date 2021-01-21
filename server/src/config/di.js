require('dotenv').config();
const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
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

const {
  DiscountController,
  DiscountModel,
  DiscountRepository,
  DiscountService,
  DiscountTypeModel,
} = require('../module/discount/module');

const { ManagementController } = require('../module/management/module');

function configureSequelizeDatabase() {
  if (process.env.NODE_ENV === 'development') {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });
  }
  return new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

function configureSession(container) {
  const ONE_WEEK_IN_SECONDS = 604800000;

  const sequelize = container.get('Sequelize');
  const sessionOptions = {
    store: new SequelizeStore({ db: sequelize }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: ONE_WEEK_IN_SECONDS },
  };
  return session(sessionOptions);
}

function configureMulter() {
  const buffer = multer.memoryStorage({});

  return multer({ buffer });
}

function addCommonDefinitions(container) {
  container.addDefinitions({
    Sequelize: factory(configureSequelizeDatabase),
    Multer: factory(configureMulter),
    Session: factory(configureSession),
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

function configureDiscountModel(container) {
  return DiscountModel.setup(container.get('Sequelize'));
}

function configureDiscountTypeModel(container) {
  return DiscountTypeModel.setup(container.get('Sequelize'));
}

function addProductModuleDefinitions(container) {
  container.addDefinitions({
    ProductController: object(ProductController).construct(
      get('BrandService'),
      get('CategoryService'),
      get('ProductService'),
      get('DiscountService'),
      get('Multer')
    ),
    ProductService: object(ProductService).construct(get('ProductRepository')),
    ProductRepository: object(ProductRepository).construct(
      get('ProductModel'),
      get('CategoryModel'),
      get('DiscountModel')
    ),
    ProductModel: factory(configureProductModel),
  });
}

function addBrandModuleDefinitions(container) {
  container.addDefinitions({
    BrandController: object(BrandController).construct(get('BrandService'), get('Multer')),
    BrandService: object(BrandService).construct(get('BrandRepository')),
    BrandRepository: object(BrandRepository).construct(
      get('BrandModel'),
      get('ProductModel'),
      get('CategoryModel'),
      get('DiscountModel')
    ),
    BrandModel: factory(configureBrandModel),
  });
}

function addCategoryModuleDefinitions(container) {
  container.addDefinitions({
    CategoryController: object(CategoryController).construct(get('CategoryService')),
    CategoryService: object(CategoryService).construct(get('CategoryRepository')),
    CategoryRepository: object(CategoryRepository).construct(
      get('CategoryModel'),
      get('ProductModel'),
      get('DiscountModel')
    ),
    CategoryModel: factory(configureCategoryModel),
  });
}

function addDiscountModuleDefinitions(container) {
  container.addDefinitions({
    DiscountController: object(DiscountController).construct(get('DiscountService')),
    DiscountService: object(DiscountService).construct(get('DiscountRepository')),
    DiscountRepository: object(DiscountRepository).construct(
      get('DiscountModel'),
      get('DiscountTypeModel')
    ),
    DiscountModel: factory(configureDiscountModel),
    DiscountTypeModel: factory(configureDiscountTypeModel),
  });
}

function addManagementModuleDefinitions(container) {
  container.addDefinitions({
    ManagementController: object(ManagementController).construct(
      get('BrandService'),
      get('CategoryService'),
      get('ProductService'),
      get('DiscountService')
    ),
  });
}

function setupAssociations(container) {
  const productModel = container.get('ProductModel');
  const categoryModel = container.get('CategoryModel');
  const brandModel = container.get('BrandModel');
  const discountModel = container.get('DiscountModel');
  productModel.setupAssociation(categoryModel, discountModel);
  brandModel.setupAssociation(productModel, discountModel);
  categoryModel.setupAssociation(productModel, discountModel);
  discountModel.setupAssociation(productModel, categoryModel, brandModel);
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addProductModuleDefinitions(container);
  addBrandModuleDefinitions(container);
  addCategoryModuleDefinitions(container);
  addManagementModuleDefinitions(container);
  addDiscountModuleDefinitions(container);
  setupAssociations(container);
  return container;
};
