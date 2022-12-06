/**
 *@title 엑셀파일 읽는 api
 *@date 2022-04-05
 *@author 홍수희
 *@desc 엑셀파일 읽이서 내용 추출후 DB 저장
 *@etc(change)
 */
const xlsx = require("xlsx");
const logger = require("../config/winston.js");
const fs = require("fs");
const express = require("express");
const requestIP = require("request-ip");
const route = express.Router();
const multer = require("multer");
const DB = require("../dbInfo.js");
const date = require("../date.js");

var resCategory = null;
var resQuestion = null;
var resAnswer = null;

//카테고리 출력 api
route.post("/category", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req); //ip 확인용
    const { fileName, index, sheet } = req.body; //client에서 받은 변수
    const json = ReadExcel(fileName, sheet); //엑셀파일 읽기
    const category = new Array(); //빈 array

    for (var el of json) {
      category.push({
        Category_KOR: el.Category_KOR,
        Category_ENG: el.Category_ENG,
      }); // 읽어온 엑셀파일에서 카테고리 관련 데이터만 배열에 넣기
    }
    resCategory = ProcessingCategory(category, index); // 데이터 가공하는 함수 사용
    logger.info("(export.js) export category (ip" + ip + ")"); //logger
    res.send(resCategory); // 가공한 카테고리 전송
  } catch (e) {
    logger.error("(export.js : /category)" + e);
    res.send("-1");
  }
});

//질문 출력 api
route.post("/question", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req); //ip 확인용
    const { fileName, index, sheet } = req.body; //client에서 받은 함수
    const json = ReadExcel(fileName, sheet); //엑셀파일 읽기
    const question = new Array(); //빈 array

    for (var el of json) {
      question.push({
        Category_KOR: el.Category_KOR,
        Question_tag: el.Question_tag,
        Question_text_KOR: el.Question_text_KOR,
        Question_text_ENG: el.Question_text_ENG,
      }); // 읽은 엑셀파일에서 질문과 관련된 데이터만 빈 배열에 넣기
    }

    resQuestion = ProcessingQuestion(question, index, resCategory); //데이터 가공 함수 사용
    if (resQuestion == -1) {
      //에러 발생시
      res.send("-2");
    } else {
      //정상 출력
      logger.info("(export.js) export question (ip" + ip + ")"); //log 작성
      res.send(resQuestion); //가공한 질문 전송
    }
  } catch (e) {
    //에러 예외 처리
    logger.error("(export.js : /question)" + e);
    res.send("-1");
  }
});

//답변 출력 api
route.post("/answer", (req, res) => {
  try {
    const ip = requestIP.getClientIp(req); // client ip 확인
    const { fileName, index, sheet } = req.body; // client에서 받은 데이터
    const json = ReadExcel(fileName, sheet); //엑셀 파일 읽기
    const answer = new Array(); //빈 배열

    for (var el of json) {
      answer.push({
        Question_text_KOR: el.Question_text_KOR,
        Answer_tag: el.Answer_tag,
        Answer_text_KOR: el.Answer_text_KOR,
        Answer_text_ENG: el.Answer_text_ENG,
      }); //읽은 파일에서 질문과 관련된 데이터만 빈 배열에 저장
    }

    resAnswer = ProcessingAnswer(answer, index, resQuestion); //데이터 가공하는 함수
    if (resAnswer == -1) {
      //에러 발생시
      res.send("-2");
    } else {
      //정상 출력
      logger.info("(export.js) export answer (ip" + ip + ")"); // log 작성
      res.send(resAnswer); //가공한 데이터 전송
    }
  } catch (e) {
    //예외 처리
    logger.error("(export.js : /answer)" + e);
    res.send("-1");
  }
});

//추출한 데이터들 저장 api
route.post("/save", (req, res) => {
  try {
    const { index } = req.body;

    //DB에 insert
    //category query
    var caSql =
      "INSERT INTO survey_category(ca_id,sr_index,ca_name,ca_name_en,reg_dt) VALUES ";
    resCategory.forEach((value) => {
      caSql += `(${value.id},${value.sr_index},"${value.ca_kr}","${value.ca_en}",'${value.reg_dt}'),`;
    });
    caSql = caSql.slice(0, caSql.length - 1);

    //question query
    var qSql =
      "INSERT INTO survey_question(ca_id,q_id,sub_id,question,question_en,sr_index,reg_dt) VALUES ";
    resQuestion.forEach((value) => {
      qSql += `(${value.ca},${value.id},${value.sub_id},"${value.q_kr}","${value.q_en}",${value.sr_index},'${value.reg_dt}'),`;
    });
    qSql = qSql.slice(0, qSql.length - 1);

    //answer query
    var saSql =
      "INSERT INTO survey_answer(q_id,q_sub_id,sa_id,sa_sub_id,sa_content,sa_content_en,sr_index,reg_dt) VALUES ";
    resAnswer.forEach((value) => {
      saSql += `(${value.q_value},${value.q_sub},${value.id},${value.sub_id},"${value.sa_kr}","${value.sa_en}",${value.sr_index},'${value.reg_dt}'),`;
    });
    saSql = saSql.slice(0, saSql.length - 1);

    DB.query(saSql, (err, res3) => {
      //에러가 제일 잘나는 answer 먼저 db에 넣는다.
      if (err) {
        logger.error("(export.js:/save/DB.query(answer))" + err);
        res.send("-2");
      } else {
        //에러가 안나면 question을 db에 넣는다.
        logger.info("(export.js:/save/answer qurey)" + res3);
        DB.query(qSql, (err, res2) => {
          if (err) {
            logger.error("(export.js:/save/DB.query(question))" + err);
            res.send("-2");
          } else {
            //에러가 안나면 category를 db에 넣는다.
            logger.info("(export.js:/save/question qurey)" + res2);
            DB.query(caSql, (err, res1) => {
              if (err) {
                logger.error("(export.js:/save/DB.query(category))" + err);
                res.send("-2");
              } else {
                logger.info("(export.js:/save/category query)" + res1);
                res.send("0");
              }
            });
          }
        });
      }
    });

    var cntSql = `UPDATE survey_meta_data SET category_cnt=${resCategory.length}, question_cnt=${resQuestion.length} WHERE sr_index=${index}`;
    DB.query(cntSql, (err) => {
      if (err) {
        logger.error("(export.js:/save/cntsql)" + err);
      } else {
        logger.info("(export.js) insert count");
      }
    });
  } catch (e) {
    logger.error("(export.js : /save)" + e);
    res.send("-1");
  }
});

//엑셀 파일 읽는 함수
function ReadExcel(fileName, sheet) {
  const excelFile = xlsx.readFile("./routes/files/" + fileName);
  const sheetName = excelFile.SheetNames[sheet];
  const firstSheet = excelFile.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });

  return jsonData;
}

//카테고리 예쁘게 가공하기
function ProcessingCategory(arr, idx) {
  const ca_arr = new Array();
  const ca_kr = new Set();
  const ca_en = new Set();
  //카테고리 중복 제거 (set은 중복 제거 해줌)
  for (var el of arr) {
    ca_kr.add(el.Category_KOR.replace(/[\[\]]/g, ""));
    ca_en.add(el.Category_ENG.replace(/[\[\]]/g, ""));
  }
  //중복 제거한 카테고리 배열에 넣기
  var i = 0;
  ca_kr.forEach((value) => {
    ca_arr.push({
      id: i,
      sr_index: idx,
      ca_kr: value,
      ca_en: "",
      reg_dt: date,
    });
    i += 1;
  });
  i = 0;
  ca_en.forEach((value) => {
    ca_arr.map((el) => (el.id == i ? (el.ca_en = value) : el));
    i += 1;
  });

  // console.log(ca_arr);
  return ca_arr;
}

//질문 예쁘게 가공하기
function ProcessingQuestion(arr, idx, caArr) {
  if (caArr == null) {
    return -1;
  }
  const q_arr = new Array();
  const q_tag = new Set();

  //질문 중복 제거
  for (var el of arr) {
    q_tag.add(
      el.Category_KOR +
        "+/+" +
        el.Question_tag +
        "+/+" +
        el.Question_text_KOR +
        "+/+" +
        el.Question_text_ENG.replace(/[\[\]]/g, "")
    ); //하나의 string으로 연결 +/+ 으로 구분함
  }
  i = 0;
  var txt = "no\tid\tsub-id\tca-id\tq-tag\tq-kr\tq-en\tsr-index\treg-dt\n"; //디버깅용
  //텍스트 분리하기
  q_tag.forEach((value) => {
    var tmp = value.split("+/+"); //붙여놓은 string 분리하기
    var ca = tmp[0].replace(/[\[\]]/g, ""); //카테고리
    var tag = tmp[1]; // tag
    var kr_text = tmp[2].replace(/[\[\]]/g, ""); // 질문 한국어
    if (tmp[3] != undefined) {
      // question_text_eng가 존재하는지
      var en_text = tmp[3].replaceAll('"', "'"); //질문 영어 (" -> ' 치환)
    } else {
      //없으면 undefined
      var en_text = "undefined";
    }
    var id = tag.split("_")[0].replace("Q", ""); // id : tag에서 앞 번호만 가져오기
    var subId = 0; // sub id 기본값 0
    q_arr.push({
      no: i,
      id: id,
      sub_id: subId,
      ca: ca,
      q_tag: tag,
      q_kr: kr_text,
      q_en: en_text,
      sr_index: idx,
      reg_dt: date,
    });

    i += 1;
  });
  //카테고리 정보 (카테고리 text로 되어 있음) 숫자로 바꾸기
  caArr.forEach((value) => {
    q_arr.map((el) => (el.ca == value.ca_kr ? (el.ca = value.id) : el));
  });

  //서브 아이디 부여하기
  for (var i of q_arr) {
    var subId = 0;
    for (var j of q_arr) {
      if (i.id == j.id) {
        q_arr.map((el) => (el.no == j.no ? (el.sub_id = subId) : el));
        subId += 1;
      }
    }
    //디버깅용
    txt += `${i.no}\t${i.id}\t${i.sub_id}\t${i.ca}\t${i.q_tag}\t${i.q_kr}\t${i.q_en}\t${i.sr_index}\t${i.reg_dt}\n`;
  }
  //디버깅용
  fs.writeFile("./output/question" + date + ".txt", txt, "utf-8", (err) => {
    if (err) throw err;
  });

  return q_arr;
}

//선택지 예쁘게 가공하기
function ProcessingAnswer(arr, idx, qArr) {
  if (qArr == null) {
    return -1;
  }
  const sa_arr = new Array();
  const sa_tag = new Set();

  //답변 중복 제거
  for (var el of arr) {
    sa_tag.add(
      el.Question_text_KOR +
        "+/+" +
        el.Answer_tag +
        "+/+" +
        el.Answer_text_KOR +
        "+/+" +
        el.Answer_text_ENG
    );
  }

  var i = 0;
  var txt =
    "no\tq-value\tq-sub\tid\tsub-id\tsa-kr\tsa-en\tsa-tag\tsr-index\treg-dt\n";
  sa_tag.forEach((value) => {
    if (value != null) {
      var tmp = value.split("+/+"); //텍스트 분리
      var qu = tmp[0].replace(/[\[\]]/g, ""); //질문 텍스트
      var tag = tmp[1]; //tag
      var kr_text = tmp[2].replace(/[\[\]]/g, ""); //답변 한국어
      var en_text = tmp[3].replace(/[\[\]]/g, ""); //답변 영어
      var id = tag.split("_")[0]; //id
      var subId = 0; //sub id
      if (id.indexOf("-") > -1) {
        var temp = id.split("-");
        id = temp[0];
        subId = temp[1];
      }
      sa_arr.push({
        no: i,
        q_value: qu,
        q_sub: 0,
        id: id.replace("A", ""),
        sub_id: subId,
        sa_kr: kr_text,
        sa_en: en_text,
        sa_tag: tag,
        sr_index: idx,
        reg_dt: date,
      });
      i += 1;
    }
  });
  //질문 텍스트 -> 질문 id-subid 로 변경
  qArr.forEach((value) => {
    // sa_arr.map(el => el.q_value == value.q_kr ? el.q_value = (`${value.id}-${value.sub_id}`) : el);
    sa_arr.map((el) =>
      el.q_value == value.q_kr
        ? ((el.q_value = value.id), (el.q_sub = value.sub_id))
        : el
    );
  });

  //디버깅용
  for (var el of sa_arr) {
    txt +=
      el.no +
      "\t" +
      el.q_value +
      "\t" +
      el.q_sub +
      "\t" +
      el.id +
      "\t" +
      el.sub_id +
      "\t" +
      el.sa_kr +
      "\t" +
      el.sa_en +
      "\t" +
      el.sa_tag +
      "\t" +
      el.sr_index +
      "\t" +
      el.reg_dt +
      "\n";
  }
  fs.writeFile("./output/answer" + date + ".txt", txt, "utf-8", (err) => {
    if (err) throw err;
  });

  return sa_arr;
}

module.exports = route;
