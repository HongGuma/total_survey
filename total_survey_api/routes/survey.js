/**
 *@title 설문지 데이터 관련 api
 *@date 2022-04-12
 *@author 홍수희
 *@desc 설문지 데이터 출력, 설문지 수정, 삭제 수행
 *@etc(change)
 */

const logger = require("../config/winston.js");
const fs = require("fs");
const express = require("express");
const requestIP = require("request-ip");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const DB = require("../dbInfo.js");
const date = require("../date.js");

route.post("/category", (req, res) => {
  try {
    const { index } = req.body;
    var sql = `SELECT * FROM survey_category WHERE sr_index = ${index}`;
    DB.query(sql, (err, category) => {
      if (err) {
        logger.error("(survey.js:/category/DB.query)" + err);
        res.send("-2");
      } else {
        res.send(category);
      }
    });
  } catch (e) {
    logger.error("(survey.js:/category)" + e);
    res.send("-1");
  }
});

route.post("/question", (req, res) => {
  try {
    const { index, caID } = req.body;
    var sql = `SELECT * FROM survey_question WHERE sr_index = ${index} and ca_id = ${caID}`;
    DB.query(sql, (err, question) => {
      if (err) {
        logger.error("(survey.js:/question/DB.query)" + err);
        res.send("-2");
      } else {
        res.send(question);
      }
    });
  } catch (e) {
    logger.error("(survey.js:/question)" + e);
    res.send("-1");
  }
});

route.post("/answer", (req, res) => {
  try {
    const { index, qid, subid } = req.body;
    var id = qid + "-" + subid;
    var sql = `SELECT * FROM survey_answer WHERE sr_index = ${index} and q_id = '${id}'`;
    DB.query(sql, (err, answer) => {
      if (err) {
        logger.error("(survey.js:/answer/DB.query)" + err);
        res.send("-2");
      } else {
        res.send(answer);
      }
    });
  } catch (e) {
    logger.error("(survey.js:/answer)" + e);
    res.send("-1");
  }
});

module.exports = route;
