/**
 *@title insert 사용하는 api
 *@date 2022-03-31
 *@author 홍수희
 *@desc insert 사용하는 api만 모아둠
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

//meta data 입력받는 api
route.post("/metaData", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req); //client ip
    const { inputValue } = req.body; //client 에서 받은 데이터
    const today = new Date(); //오늘 날짜
    /**
     * index 만들기
     * @type {string}
     * 년도+월+001
     * (ex) db에 202203001 이 있으면
     * 202203002 로 저장
     * 없으면 202203001 로 저장
     */
    var makeIdx = `${today.getFullYear()}${("0" + (today.getMonth() + 1)).slice(
      -2
    )}`;
    var existsql = `SELECT sr_index FROM survey_meta_data where sr_name='${inputValue.sr_name}' and sr_ver='${inputValue.sr_ver}' and sr_writer='${inputValue.sr_writer}'`; //입력 받은 meta data가 db에 존재하는지 확인
    DB.query(existsql, (err, index) => {
      if (err) {
        //에러 발생
        logger.error("(insert.js) " + err);
        res.send("-1");
      } else {
        //정상 출력
        if (index.length > 0) {
          //index.length>0 이상이면 존재한다는 뜻
          res.send("-2");
        } else {
          //없으면
          var checkSql = `SELECT sr_index FROM survey_meta_data ORDER BY sr_index DESC limit 1`; //DB에서 가장 마지막 index 가져오기
          DB.query(checkSql, (err, dbIndex) => {
            if (err) {
              logger.error("(insert.js) " + err);
              res.send("-1");
            } else {
              if (dbIndex.length == 0) {
                //데이터가 없으면 (첫 데이터 생성시)
                makeIdx = makeIdx + "001"; //index는 1번
                var sql = `INSERT INTO survey_meta_data(sr_name,sr_ver,sr_writer,sr_tag,create_dt,sr_index,memo,reg_dt) VALUES `;
                sql += `('${inputValue.sr_name}','${inputValue.sr_ver}','${
                  inputValue.sr_writer
                }',${inputValue.sr_tag},'${inputValue.create_dt}',${parseInt(
                  makeIdx
                )},'${inputValue.memo}','${date}')`; //데이터 저장하는 쿼리문
                DB.query(sql, (err) => {
                  if (err) {
                    //에러 발생
                    logger.error("(fileIO.js) " + err);
                    res.send("-1");
                  } else {
                    //정상 출력
                    logger.info("(fileIO.js) insert meta data ip" + ip);
                    res.send("0");
                  }
                });
              } else {
                //데이터가 있으면
                var idx = dbIndex[0].sr_index;
                if (idx.slice(0, 6) == makeIdx) {
                  makeIdx = parseInt(idx) + 1;
                } else {
                  makeIdx = makeIdx + "001";
                }
                var sql = `INSERT INTO survey_meta_data(sr_name,sr_ver,sr_writer,sr_tag,create_dt,sr_index,memo,reg_dt) VALUES `;
                sql += `('${inputValue.sr_name}','${inputValue.sr_ver}','${
                  inputValue.sr_writer
                }',${inputValue.sr_tag},'${inputValue.create_dt}',${parseInt(
                  makeIdx
                )},'${inputValue.memo}','${date}')`;
                DB.query(sql, (err) => {
                  if (err) {
                    logger.error("(fileIO.js) " + err);
                    res.send("-1");
                  } else {
                    logger.info("(fileIO.js) insert meta data ip" + ip);
                    res.send("0");
                  }
                });
              }
            }
          });
        }
      }
    });
  } catch (e) {
    logger.error(e);
  }
});

module.exports = route;
