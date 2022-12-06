const logger = require("../config/winston.js");
const fs = require("fs");
const express = require("express");
const requestIP = require("request-ip");
const route = express.Router();
const multer = require("multer");
const DB = require("../dbInfo.js");
const date = require("../date.js");

//metadata출력
route.post("/metadata", (req, res) => {
  try {
    var sql = "SELECT * FROM survey_meta_data ";
    DB.query(sql, (err, data) => {
      if (err) {
        logger.error("(data.js:/metadata/DB)" + err);
        res.send("-2");
      } else {
        var resultArr = null; //빈 배열
        resultArr = data.sort((val1, val2) => {
          //불러온 리스트 첫 생성일자 기준으로 정렬
          var a = parseInt(val1.create_dt.replace(/[-.]/g, ""));
          var b = parseInt(val2.create_dt.replace(/[-.]/g, ""));
          //생성일자가 같을 경우 버전 기준으로 정렬
          var c = parseInt(val1.sr_ver.replace(".", ""));
          var d = parseInt(val2.sr_ver.replace(".", ""));
          // return a < b ? 1 : a > b ? -1 : 0;
          if (a == b) {
            return c < d ? 1 : c > d ? -1 : 0;
          } else if (a > b) {
            return 1;
          } else if (a < b) {
            return -1;
          } else {
            return 0;
          }
        });
        res.send(resultArr);
      }
    });
  } catch (e) {
    logger.error("(data.js:/metadata)" + e);
    res.send("-1");
  }
});

//설문지 tag 출력
route.post("/srtag", (req, res) => {
  try {
    var sql = "SELECT * FROM survey_tag";
    DB.query(sql, (err, tag) => {
      if (err) {
        logger.error("(data.js:/srtag/DB)" + err);
        res.send("-2");
      } else {
        res.send(tag);
      }
    });
  } catch (e) {
    logger.error("(data.js:/srtag)" + e);
    res.send("-1");
  }
});

module.exports = route;
