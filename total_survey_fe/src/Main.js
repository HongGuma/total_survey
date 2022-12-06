/**
 *@title Main
 *@date 2022-03-23
 *@author 홍수희
 *@desc
 *@etc(change)
 */

import React from "react";
import { useHistory } from "react-router-dom";

import "./css/Main.css";

const Main = () => {
  var history = useHistory();

  function MoveCreatePage() {
    history.push("/create");
  }

  function MoveEditSurvey() {
    history.push("/review");
  }

  return (
    <div className="main">
      <h1>통합 임상 설문지</h1>
      <div className="sr-mk-btn" onClick={MoveCreatePage}>
        설문지 만들기
      </div>
      <div className="sr-mk-btn" onClick={MoveEditSurvey}>
        설문지 확인 및 수정
      </div>
      <div className="sr-mk-btn">설문지 결과 확인</div>
    </div>
  );
};

export default Main;
