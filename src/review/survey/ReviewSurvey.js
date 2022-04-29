/**
 *@title 완성된 설문지 확인하는 페이지
 *@date 2022-04-08
 *@author 홍수희
 *@desc 설문지 형태로 확인하는 페이지
 * 질문 유형, 텍스트 수정등 할 수 있음
 *@etc(change)
 */

import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import CategoryForm from './CategoryForm.js';
import '../../css/review/reviewSurvey.css';

const ReviewSurvey = ({match}) => {
    var history = useHistory();
    const props = match.params.srindex; //이전 페이지에서 받아온 index
    const [surveyDatas,setSurveyDatas] = useState(null);
    const [caList,setCaList] = useState(null); //전체 카테고리 리스트 (완전한 상태) - 텍스트만
    
    function MoveToBack(){
        history.push('/review');
    }

    useEffect(()=>{
        LoadList().then(res=>{
            if(res == '-1'){
                alert('에러 발생! 서버에 문제가 생겼습니다.');
            }else if(res == '-2'){
                alert('에러 발생! DB에 문제가 생겼습니다.');
            }else{
                setCaList(res);
            }
        });
    },[]);

    async function LoadList(){
        const res = await axios.post(process.env.REACT_APP_API+"/survey/category",{index:props});
        return res.data;
    }
    
    return(
        <div className="review-sruvey-main">
            <div>
                <button onClick={MoveToBack}>뒤로가기</button>
            </div>
            <div className="review">
                <CategoryForm index={props} categoryList={caList}/>
            </div>
        </div>
    )
}

export default ReviewSurvey;