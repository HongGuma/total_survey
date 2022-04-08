/**
 *@title 질문 확인하기
 *@date 2022-04-06
 *@author 홍수희
 *@desc 추출된 질문 출력하는 컴포넌트
 *@etc(change)
 */
import React,{ useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";

import CheckAnswer from './CheckAnswer.js';


const CheckQuestion = ({data,caId,saList}) => {
    const [questionList,setQuestionList] = useState(data); //전체 카테고리 리스트 (완전한 상태) - 텍스트만
    const [caID,setCaID] = useState(caId);
    const [questionID,setQuestionID] = useState(null);
    const [questionSubID,setQuestionSubID] = useState(0);
    useEffect(()=>{setQuestionList(data);},[data]);
    useEffect(()=>{setCaID(caId);},[caId]);

    function ShowAnswerHandler(qid,subid){
        setQuestionID(qid);
        setQuestionSubID(subid);
    }

    return(
        <div className="check-question">
            {questionList != null && questionList.map((item,idx)=>(
                item.ca == caID &&
                <div className="cont-01" key={idx}>
                    {item.sub_id == 0 ?
                        <p className="question" onClick={()=>ShowAnswerHandler(item.id,item.sub_id)}>(tag : {item.q_tag}) {item.id}. {item.q_kr.replace(/[\d\.]/g,'')} ({item.q_en.replace(/[\d\.]/g,'')} )</p>
                        :
                        <p className="question" onClick={()=>ShowAnswerHandler(item.id,item.sub_id)}>(tag : {item.q_tag}) {item.id}-{item.sub_id}. {item.q_kr.replace(/[\d\.]/g,'')} ({item.q_en.replace(/[\d\.]/g,'')} )</p>
                    }
                    <CheckAnswer data={saList} qID={item.id} qSubID={item.sub_id}/>
                </div>
            ))}
        </div>
    )
}


export default CheckQuestion;