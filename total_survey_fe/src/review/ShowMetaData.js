/**
 *@title 메타 데이터 출력하는 컴포넌트
 *@date 2022-04-08
 *@author 홍수희
 *@desc 모든 메타 데이터 출력하는 컴포넌트
 *@etc(change)
 */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const ShowMetaData = ({ tag }) => {
  const history = useHistory();
  const [metaDataList, setMetaDataList] = useState(null);

  useEffect(() => {
    LoadData().then((res) => {
      if (res == "-1") {
        alert("에러 발생, 서버 이상");
      } else if (res == "-2") {
        alert("에러 발생, DB 이상");
      } else {
        setMetaDataList(res);
      }
    });
  }, []);

  async function LoadData() {
    const res = await axios.post(process.env.REACT_APP_API + "/data/metadata");
    return res.data;
  }
  function MoveReviewSurvey(idx) {
    history.push("/review/survey/" + idx);
  }

  return (
    <div className="show-meta-data">
      {metaDataList != null &&
        metaDataList.map(
          (item, idx) =>
            tag == item.sr_tag && (
              <div className="sect-01" key={idx}>
                <div className="sect-01-cont-01">
                  {/*<ul>*/}
                  {/*    <li className="cont-01">no</li>*/}
                  {/*    <li className="cont-02">{item.sr_no}</li>*/}
                  {/*</ul>*/}
                  <ul>
                    <li className="cont-01">설문지 제목</li>
                    <li className="cont-02">{item.sr_name}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">설문지 버전</li>
                    <li className="cont-02">{item.sr_ver}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">설문지 작성자</li>
                    <li className="cont-02">{item.sr_writer}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">설문지 첫 생성 일자</li>
                    <li className="cont-02">{item.create_dt}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">설문지 index</li>
                    <li className="cont-02">{item.sr_index}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">카테고리 개수</li>
                    <li className="cont-02">{item.category_cnt}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">질문 개수</li>
                    <li className="cont-02">{item.question_cnt}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">답변 개수</li>
                    <li className="cont-02">{item.answer_cnt}</li>
                  </ul>
                  <ul>
                    <li className="cont-01">기타 메모</li>
                    <li className="cont-02">{item.memo}</li>
                  </ul>
                </div>
                <div className="sect-01-cont-02">
                  <p onClick={() => MoveReviewSurvey(item.sr_index)}>
                    설문지 확인하기
                  </p>
                </div>
              </div>
            )
        )}
    </div>
  );
};

export default ShowMetaData;
