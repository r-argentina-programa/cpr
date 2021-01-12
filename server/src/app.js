require('dotenv').config();
const express = require('express');

const app = express();
const path = require('path');

const configureDI = require('./config/di');
const { initProductModule } = require('./module/product/module');
const { initBrandModule } = require('./module/brand/module');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', '..', 'public', 'uploads')));
const container = configureDI();
initProductModule(app, container);
initBrandModule(app, container);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
