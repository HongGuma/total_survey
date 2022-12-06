/**
 *@title 설문지 생성 화면
 *@date 2022-03-30
 *@author 홍수희
 *@desc 파일 선택후 설문지 생성 버튼 누르면 나오는 화면, 메타정보 입력 카테고리,질문,답변 확인 가능
 *@etc(change)
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import "../css/create/insertSurveyMetaData.css";

const InsertSurveyMetaData = ({ match }) => {
  const history = useHistory();
  const [fileName] = useState(match.params.filename);
  const [inputValue, setInputValue] = useState({
    sr_name: null,
    sr_ver: null,
    sr_writer: null,
    create_dt: null,
    sr_tag: 1,
    memo: null,
  });

  async function SaveData() {
    console.log("click");
    const res = await axios.post(
      process.env.REACT_APP_API + "/insert/metaData",
      { inputValue: inputValue }
    );
    if (res.data == "-1") {
      alert("에러 발생, DB에 문제가 생겼습니다.");
    } else if (res.data == "-2") {
      alert("이미 저장된 메타 정보 입니다.");
    } else {
      alert("저장 완료.");
    }
  }

  function MovePrev() {
    history.push("/create");
  }

  function MoveNext() {
    var msg = "저장은 하셨나요?";
    if (window.confirm(msg)) {
      loadIndex().then((res) => {
        if (res == "-1") {
          alert("DB 에러");
        } else if (res == "-2") {
          alert("저장된 메타정보가 없습니다.");
        } else {
          history.push("/create/check/" + fileName + "+" + res.sr_index);
        }
      });
    }
  }

  async function loadIndex() {
    const res = await axios.post(process.env.REACT_APP_API + "/file/index", {
      value: inputValue,
    });
    return res.data;
  }

  function InsertValue(e) {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
    // console.log(inputValue);
  }

  return (
    <div className="insert-meta-data">
      <div className="sect-01">
        <button onClick={MovePrev}>뒤로가기</button>
        <p>선택한 파일 : {fileName != null ? fileName : "NULL"}</p>
      </div>
      <div className="sect-02">
        <div className="sect-02-cont-01">
          메타 데이터 입력 (※ 메타 데이터는 수정이 불가합니다.)
        </div>
        <div className="sect-02-cont-02" onChange={(e) => InsertValue(e)}>
          <div className="cont-01">
            <p>설문지 이름</p>
            <p>
              <input type="text" name="sr_name" />
            </p>
          </div>
          <div className="cont-01">
            <p>설문지 버전</p>
            <p>
              <input type="text" name="sr_ver" />
            </p>
          </div>
          <div className="cont-01">
            <p>설문지 제작자</p>
            <p>
              <input type="text" name="sr_writer" />
            </p>
          </div>
          <div className="cont-01">
            <p>첫 생성 날짜</p>
            <p>
              <input type="text" name="create_dt" placeholder="yyyy.mm.dd" />
            </p>
          </div>
          <div className="cont-01">
            <p>설문지 종류</p>
            <p>
              <select name="sr_tag">
                <option value={1}>만게놈 설문지</option>
                <option value={2}>감염병 설문지</option>
              </select>
            </p>
          </div>
          <div className="cont-01">
            <p>비고</p>
            <p>
              <input type="text" name="memo" />
            </p>
          </div>
        </div>
      </div>
      <div className="sect-03">
        <button onClick={SaveData}>저장</button>
        {/*<button onClick={ExportSurvey}>추출</button>*/}
        <button onClick={MoveNext}>다음</button>
      </div>
    </div>
  );
};

export default InsertSurveyMetaData;
