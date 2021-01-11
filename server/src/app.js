const env = require("dotenv");
const express = require("express");
const app = express();
//
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
