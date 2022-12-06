/**
 *@title router index
 *@date 2021-12-21
 *@author 홍수희
 *@desc route 모아놓은 파일
 *@etc(change)
 */
const express = require("express");
const router = express.Router();

const admin = require("./admin.js");
const data = require("./data.js");
const fileIO = require("./fileIO.js");
const insertDatas = require("./insert.js");
const exportDatas = require("./export.js");
const surveyDatas = require("./survey.js");

router.use("/admin", admin);
router.use("/data", data);
router.use("/file", fileIO);
router.use("/insert", insertDatas);
router.use("/export", exportDatas);
router.use("/survey", surveyDatas);

module.exports = router;
