require('dotenv').config();
const { default: DIContainer, object, get, factory } = require('rsdi');
const { Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

function addProductModuleDefinitions(container) {
  container.addDefinitions({
    ProductController: object(ProductController).construct(
      get('ProductService'),
      get('Multer'),
      get('BrandService')
    ),
    ProductService: object(ProductService).construct(get('ProductRepository')),
    ProductRepository: object(ProductRepository).construct(get('ProductModel')),
    ProductModel: factory(configureProductModel),
  });
}

function addBrandModuleDefinitions(container) {
  container.addDefinitions({
    BrandController: object(BrandController).construct(get('BrandService'), get('Multer')),
    BrandService: object(BrandService).construct(get('BrandRepository')),
    BrandRepository: object(BrandRepository).construct(get('BrandModel'), get('ProductModel')),
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
      get('CategoryService'),
      get('ProductService')
    ),
  });
}

function setupAssociations(container) {
  const productModel = container.get('ProductModel');
  const categoryModel = container.get('CategoryModel');
  productModel.setupAssociation(categoryModel);
  categoryModel.setupAssociation(productModel);
}

module.exports = function configureDI() {
  const container = new DIContainer();
  addCommonDefinitions(container);
  addProductModuleDefinitions(container);
  addBrandModuleDefinitions(container);
  addCategoryModuleDefinitions(container);
  addManagementModuleDefinitions(container);
  setupAssociations(container);
  return container;
};
