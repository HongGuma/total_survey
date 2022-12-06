/**
 *@title 분석된 파일 결과 보기
 *@date 2022-03-31
 *@author 홍수희
 *@desc 메타 정보 입력후 다음 누르면 나오는 화면
 * 엑셀파일에서 추출한 내용 출력
 *@etc(change)
 */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import CheckCategory from "./CheckCategory.js";
import "../css/create/checkSurvey.css";

const CheckSurvey = ({ match }) => {
  const history = useHistory();
  const props = match.params.fileIndex; //이전 페이지에서 받아온 props (filename + index)
  const [fileName, setFileName] = useState(null); //이전 페이지에서 받아온 파일명
  const [index, setIndex] = useState(null); //이전 페이지에서 받아온 index
  const [categoryData, setCategoryData] = useState(null); //추출한 카테고리 데이터
  const [questionData, setQuestionData] = useState(null); //추출한 질문 데이터
  const [answerData, setAnswerData] = useState(null); //추출한 답변 데이터
  const [qsBtnToggle, setQsBtnToggle] = useState(false); //질문 추출 토글 버튼
  const [saBtnToggle, setSaBtnToggle] = useState(false); //답변 추출 토글 버튼
  const [newFile, setNewFile] = useState(null); //새로 올리는 엑셀파일

  useEffect(() => {
    var tmp = props.split("+");
    setFileName(tmp[0]);
    setIndex(tmp[1]);
  }, []);
  //뒤로가기
  function MovePrev() {
    history.push("/create/metaData/" + fileName);
  }
  //카테고리 추출하기 버튼 클릭시 -> 카테고리만 출력
  async function exportCategory() {
    const res = await axios.post(
      process.env.REACT_APP_API + "/export/category",
      { fileName: fileName, index: index, sheet: 0 }
    );
    if (res.data == "-1") {
      alert("에러 발생! 엑셀파일에 문제가 없는지 확인해주세요.");
    } else {
      setCategoryData(res.data);
      setQsBtnToggle(true);
    }
  }
  //질문 추출하기 버튼 클릭시 -> 카테고리가 있어야 출력됨
  async function exportQuestion() {
    const res = await axios.post(
      process.env.REACT_APP_API + "/export/question",
      { fileName: fileName, index: index, sheet: 0 }
    );
    if (res.data == "-1") {
      alert("에러 발생! 엑셀파일에 문제가 없는지 확인해주세요.");
    } else if (res.data == "-2") {
      alert("'카테고리 추출'을 먼저 수행해주세요.");
    } else {
      setQuestionData(res.data);
      setSaBtnToggle(true);
    }
  }
  //답변 추출하기 버튼 클릭시 -> 카테고리, 질문 있어야 출력됨
  async function exportAnswer() {
    const res = await axios.post(process.env.REACT_APP_API + "/export/answer", {
      fileName: fileName,
      index: index,
      sheet: 0,
    });
    if (res.data == "-1") {
      alert("에러 발생! 엑셀파일에 문제가 없는지 확인해주세요.");
    } else if (res.data == "-2") {
      alert("'질문 추출'을 먼저 수행해주세요.");
    } else {
      setAnswerData(res.data);
    }
  }
  //출력된 데이터 저장하기
  async function saveData() {
    const res = await axios.post(process.env.REACT_APP_API + "/export/save", {
      index: index,
    });
    if (res.data == "-1") {
      alert("에러 발생! 서버에 문제가 생겼습니다.");
    } else if (res.data == "-2") {
      alert("에러 발생! 마스터 파일을 다시 확인해 주세요.");
    } else {
      alert("저장완료.");
      history.push("/");
    }
  }
  //파일 새로 올리기
  function FileInputHandler(e) {
    const file = e.target.files;
    setNewFile(file);
  }
  //파일 새로 올리고 upload 버튼 클릭시
  async function ReUpload() {
    const formData = new FormData();
    formData.append("file", newFile[0]);
    formData.append("editor", "test admin");
    formData.append("originFileName", fileName.toString());
    const res = await axios.post(
      process.env.REACT_APP_API + "/file/reUpload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (res.data == "-1") {
      alert("업로드 실패. 서버에 문제가 생겼습니다.");
    } else {
      alert("업로드 완료. 새로고침(F5) 해주세요.");
    }
  }

  return (
    <div className="check-survey">
      <div className="sect-01-top">
        <div>
          <button onClick={MovePrev}>뒤로가기</button>
        </div>
        <div>선택한 파일 : {fileName}</div>
        <div className="cont-03">error log</div>
      </div>
      <div className="sect-02">
        <div>
          엑셀파일 다시 올리기 :{" "}
          <input
            type="file"
            onChange={(e) => FileInputHandler(e)}
            accept=".xlsx"
          />{" "}
          <button onClick={ReUpload}>upload</button>
        </div>
      </div>
      <div className="sect-03">
        <button onClick={exportCategory}>카테고리 추출</button>
        {qsBtnToggle && <button onClick={exportQuestion}>질문 추출</button>}
        {saBtnToggle && <button onClick={exportAnswer}>답변 추출</button>}
        {answerData != null && (
          <div className="cont-02">
            <button onClick={saveData}>저장하기</button>
          </div>
        )}
      </div>
      <div className="sect-04">
        {categoryData != null && (
          <CheckCategory
            data={categoryData}
            qList={questionData}
            saList={answerData}
          />
        )}
      </div>
    </div>
  );
};

export default CheckSurvey;
