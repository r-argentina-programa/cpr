require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

nunjucks.configure('src/module', {
  autoescape: true,
  express: app,
});

const configureDI = require('./config/di');
const { initProductModule } = require('./module/product/module');
const { initBrandModule } = require('./module/brand/module');
const { initCategoryModule } = require('./module/category/module');
const { initManagementModule } = require('./module/management/module');

const PORT = process.env.PORT || 8000;

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
const container = configureDI();
initProductModule(app, container);
initBrandModule(app, container);
initCategoryModule(app, container);
initManagementModule(app, container);

const mainDb = container.get('Sequelize');
mainDb.sync();
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
