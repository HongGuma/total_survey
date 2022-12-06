/**
 *@title 설문지 질문 폼
 *@date 2022-04-12
 *@author 홍수희
 *@desc 설문지 질문 출력하는 컴포넌트
 *@etc(change)
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import QuestionType00 from "./QuestionType00.js";
import AnswerType01 from "./AnswerType01.js";

const QuestionForm = ({ index, caId }) => {
  const [caID, setCaID] = useState(null);
  const [queList, setQueList] = useState(null);
  useState(() => {
    if (caId != null) {
      LoadList(caId).then((res) => {
        if (res == "-1") {
          alert("에러 발생! 서버에 문제가 생겼습니다.");
        } else if (res == "-2") {
          alert("에러 발생! DB에 문제가 생겼습니다.");
        } else {
          setQueList(res);
        }
      });
    }
  }, []);

  async function LoadList(caID) {
    const res = await axios.post(
      process.env.REACT_APP_API + "/survey/question",
      { index: index, caID: caID }
    );
    return res.data;
  }
  return (
    <div className="review-question">
      <div>
        {queList != null &&
          queList.map((item, idx) => (
            <div key={idx}>
              {item.q_type > -1 && item.question}
              {item.q_type == 0 && (
                <QuestionType00
                  index={index}
                  qType={item.q_type}
                  qID={item.q_id}
                  subID={item.sub_id}
                />
              )}
              <AnswerType01
                index={index}
                qID={item.q_id}
                qSubID={item.sub_id}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default QuestionForm;
