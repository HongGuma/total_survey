/**
 *@title file 입출력
 *@date 2022-03-30
 *@author 홍수희
 *@desc file 입출력과 관련된 api 모음
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

//업로드된 파일 저장할 위치
const dirPath = __dirname + "/files/";
//특정폴더에 원하는 이름으로 저장하기 위한 옵션
const storage = multer.diskStorage({
  //원하는 위치
  destination: (req, file, callback) => {
    callback(null, `${dirPath}`);
  },
  //원하는 이름 (원래이름 + 날짜 + .xlsx)
  filename: (req, file, callback) => {
    callback(
      null,
      `${file.originalname.slice(0, file.originalname.length - 5)}_${date}.xlsx`
    );
  },
});
//파일 업로드
const upload = multer({ storage }).any();

//파일 업로드
route.post("/upload", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req);
    const reqFile = [];
    upload(req, res, (err) => {
      if (err) {
        logger.error("(fileIO.js : /upload-upload) " + err);
        res.send("-1");
      } else {
        const { editor, originalName } = req.body;
        for (var file of req.files) {
          reqFile.push(file.fileName);
        }
        logger.info(
          `(fileIO.js) upload, file name: ${originalName}, editor: ${editor}, ip ${ip}`
        );
        InsertLog(originalName, "업로드", editor);
        res.send("0");
      }
    });
  } catch (e) {
    logger.error("(fileIO.js : /upload) " + e);
    res.send("-1");
  }
});
//파일 재 업로드
route.post("/reUpload", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req);
    var newFile = "";
    upload(req, res, (err) => {
      if (err) {
        logger.error("(fileIO.js:/reUpload/upload())" + err);
        res.send("-1");
      } else {
        const { editor, originFileName } = req.body;
        for (var file of req.files) {
          newFile = file.filename;
        }
        fs.unlink("./routes/files/" + originFileName, (err) => {
          if (err) {
            logger.error("(fileIO.js: /reUpload/fs.unlink)" + err);
            res.send("-1");
          } else {
            console.log(newFile, originFileName);
            //새로 업로드한 파일 명 -> 기존의 파일명 으로 변경
            fs.rename(
              "./routes/files/" + newFile,
              "./routes/files/" + originFileName,
              (err) => {
                if (err) {
                  logger.error("(fileIO.js: /reUpload/fs.rename)" + err);
                  res.send("-1");
                } else {
                  logger.info(
                    `(fileIO.js) reUpload file, file name:${originFileName}, editor: ${editor}, ip ${ip}`
                  );
                  res.send("0");
                  InsertLog(originFileName, "재업로드", editor);
                }
              }
            );
          }
        });
      }
    });
  } catch (e) {
    logger.error("(fileIO.js: /reUpload)" + e);
    res.send("-1");
  }
});

//파일 목록 출력
route.post("/print", (req, res) => {
  try {
    fs.readdir("./routes/files", (err, files) => {
      if (err) {
        logger.error("(fileIO.js : /print-fs.readdir) " + err);
        res.send("-1");
      } else {
        res.send(files);
        // console.log(files);
      }
    });
  } catch (e) {
    logger.error("(fileIO.js : /print) " + e);
    res.send("-1");
  }
});

//파일 삭제
route.post("/delete", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req);
    const { filename, editor } = req.body;
    fs.unlink("./routes/files/" + filename, (err) => {
      if (err) {
        logger.error("(fileIO.js : /delete-fs.unlink) " + err);
        res.send("-1");
      } else {
        logger.info(
          `(fileIO.js) delete, file name: ${filename}, editor : ${editor}, ip ${ip}`
        );
        InsertLog(filename, "삭제", editor);
        res.send("0");
      }
    });
  } catch (e) {
    logger.error("(fileIO.js : /delete) " + e);
    res.send("-1");
  }
});

//파일명 수정
route.post("/changeName", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req);
    const { oldName, newName, editor } = req.body;
    fs.rename(oldName, newName, (err) => {
      if (err) {
        logger.error("(fileIO.js : /changeName-fs.rename) " + err);
        res.send("-1");
      } else {
        logger.info(
          `(fileIO.js) rename file ${oldName}->${newName} : ${editor}, ip ${ip}`
        );
        res.send("0");
      }
    });
  } catch (e) {
    logger.error("(fileIO.js : /changeName)) " + e);
    res.send("-1");
  }
});

//로그 출력 기능
route.post("/log", (req, res) => {
  try {
    var sql = `SELECT * FROM file_IO_log `;
    DB.query(sql, (err, logs) => {
      if (err) {
        logger.error("(fileIO.js : /log/DB.query()) " + e);
        res.send("-1");
      } else {
        // console.log(logs.reverse());
        res.send(logs.reverse());
      }
    });
  } catch (e) {
    logger.error("(fileIO.js : /log) " + e);
    res.send("-1");
  }
});

route.post("/index", (req, res) => {
  try {
    const { value } = req.body;
    var sql = `SELECT sr_index from survey_meta_data where sr_name= '${value.sr_name}' and sr_ver='${value.sr_ver}' and sr_writer='${value.sr_writer}'`;
    DB.query(sql, (err, index) => {
      if (err) {
        logger.error("(fileIO.js: /index/DB.query())" + err);
        res.send("-1");
      } else {
        if (index.length > 0) {
          res.send(index[0]);
        } else {
          res.send("-2");
        }
      }
    });
  } catch (e) {
    logger.error("(fileIO.js : /index)" + e);
    res.send("-1");
  }
});

async function InsertLog(fileName, state, editor) {
  try {
    var sql = `INSERT INTO file_IO_log(file_name,state,editor,reg_dt) VALUES('${fileName}','${state}','${editor}','${date}')`;
    const db = await DB.query(sql, (err) => {
      if (err) {
        logger.error("(fileIO.js : InsertLog()-db.query) " + err);
        return -1;
      } else {
        return 0;
      }
    });
  } catch (exception) {
    logger.error("(fileIO.js : InsertLog() )" + exception);
  }
}

module.exports = route;
