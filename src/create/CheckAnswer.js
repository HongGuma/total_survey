/**
 *@title 답변 확인하기
 *@date 2022-04-06
 *@author 홍수희
 *@desc 추출된 답변 출력하는 컴포넌트
 *@etc(change)
 */
import React,{ useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";


const CheckAnswer = ({data,qID,qSubID}) => {
    const [answerList,setAnswerList] = useState(data); //전체 카테고리 리스트 (완전한 상태) - 텍스트만
    const [qNum,setQNum] = useState(qID);
    const [qSubNum,setQSubNum] = useState(qSubID);
    const [qType,setQtype] = useState(1);
    useEffect(()=>{
        setAnswerList(data);
    },[data]);
    useEffect(()=>{
        setQNum(qID);
        setQSubNum(qSubID);
    },[qID]);
    function QtypeChangeHandler(e){
        const {name,value} = e.target;
        setQtype(value);
    }

    return(
        <div className="check-answer">
            {answerList != null && answerList.map((item,idx)=>(
                (item.q_value == qNum && item.q_sub == qSubNum ) &&
                <div key={idx}>
                    <p className="answer">(A tag: {item.sa_tag}) {item.sa_kr} ({item.sa_en})</p>
                </div>
            ))}
        </div>
    )
}



export default CheckAnswer;