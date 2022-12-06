/**
 *@title 서버 실행
 *@date 2021-12-20
 *@author 홍수희
 *@desc
 *@etc(change)
 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extends: true }));
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3521;

const server = app.listen(port, function () {
  console.log("Express server has started on port " + port);
});

module.exports = app;
