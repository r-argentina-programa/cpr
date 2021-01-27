require('dotenv').config({ path: `${__dirname}/.env` });
const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const compression = require('compression');
const cors = require('cors');

const app = express();

const configureDI = require('./config/di');
const { initProductModule } = require('./module/product/module');
const { initBrandModule } = require('./module/brand/module');
const { initCategoryModule } = require('./module/category/module');
const { initManagementModule } = require('./module/management/module');
const { initDiscountModule } = require('./module/discount/module');

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../build')));
app.use('/public', express.static('public'));

nunjucks.configure(`${__dirname}/module`, {
  autoescape: true,
  express: app,
});

const container = configureDI();
app.use(container.get('Session'));
app.use(compression());
app.use(cors());
initProductModule(app, container);
initBrandModule(app, container);
initCategoryModule(app, container);
initManagementModule(app, container);
initDiscountModule(app, container);

const mainDb = container.get('Sequelize');
mainDb.sync();

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
