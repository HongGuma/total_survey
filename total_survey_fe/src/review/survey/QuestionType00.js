/**
 *@title qType 0
 *@date 2022-04-12
 *@author 홍수희
 *@desc question type 0 인 컴포넌트
 * 참여자 기초 정보 입력
 *@etc(change)
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const QuestionType00 = ({ index, qType, qID, subID }) => {
  const [saList, setSaList] = useState(null);
  useEffect(() => {
    LoadList().then((res) => {
      if (res == "-1") {
        alert("에러 발생! 서버에 문제가 있습니다.");
      } else if (res == "-2") {
        alert("에러 발생! DB에 문제가 있습니다.");
      } else {
        setSaList(res);
      }
    });
  }, []);
  async function LoadList() {
    const res = await axios.post(process.env.REACT_APP_API + "/survey/answer", {
      index: index,
      qid: qID,
      subid: subID,
    });
    return res.data;
  }
  return (
    <div className="default-answer">
      {saList != null &&
        saList.map((item, idx) => (
          <div key={idx}>
            <label>
              <input type="radio" name={item.sa_tag} />
              {item.sa_content.replace(/\d{1,3}./g, "")}
            </label>
          </div>
        ))}
    </div>
  );
};

export default QuestionType00;
