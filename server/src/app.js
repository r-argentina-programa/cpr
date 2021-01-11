const env = require('dotenv');
const express = require('express');
const app = express();

const configureDI = require('./config/di');
const { initProductModule } = require('./module/product/module');

const PORT = process.env.PORT || 8000;

app.use(express.json());

const container = configureDI();
initProductModule(app, container);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
