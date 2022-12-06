const logger = require("../config/winston.js");
const fs = require("fs");
const express = require("express");
const requestIP = require("request-ip");
const route = express.Router();
const DB = require("../dbInfo.js");
const date = require("../date.js");

route.post("/login", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req); //ip 확인용
    const { value } = req.body;
    const query = `SELECT * FROM survey_admin where ad_id = '${value.id}' and ad_pw = md5('${value.pw}')`;
    DB.query(query, (err, user) => {
      if (err) {
        logger.error("(admin.js /login)" + err);
        res.send("-1");
      } else {
        if (user == null) {
          res.send("-2");
        } else {
          logger.info(
            `(admin.js /login) login user name=${user[0].ad_name},ip${ip}`
          );
          res.send(user[0]);
        }
      }
    });
  } catch (e) {
    logger.error("(admin.js /login)" + e);
    res.send("-1");
  }
});

module.exports = route;
