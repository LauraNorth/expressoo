const express = require('express');
const parse = require('csv-parse');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const app = express();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


const PORT = process.env.PORT || 4000;

app.use(cors());



app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.export = app;
