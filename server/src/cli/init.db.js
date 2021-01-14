require('dotenv').config();
const express = require('express');
const configureDependencyInjection = require('../config/di');

const app = express();
const container = configureDependencyInjection(app);

const sessionDb = container.get('SessionSequelize');
container.get('Session');
sessionDb.sync();
