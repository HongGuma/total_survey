/**
*@title 설문지 카테고리 폼
*@date 2022-04-12
*@author 홍수희
*@desc 카테고리 출력하는 컴포넌트
*@etc(change)
*/
import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import QuestionForm from './QuestionForm.js';

const CategoryForm = ({index,categoryList}) => {
    const [caList,setCaList] = useState(null); //전체 카테고리 리스트 (완전한 상태) - 텍스트만
    const [currentNum,setCurrentNum] = useState(0); //현재 보여지는 카테고리 (분할된 상태)
    const nextIdx = currentNum * 1; //다음 카테고리 번호
    const prevIdx = nextIdx - 1; //이전 카테고리 번호
    const [scrollY,setScrollY] = useState(0); //세로 스크롤
    const [qList,setQList] = useState(null);

    // useState(()=>{
    //     LoadList().then(res=>{
    //         // console.log(res);
    //         if(res == '-1'){
    //             alert('에러 발생! 서버에 문제가 생겼습니다.');
    //         }else if(res == '-2'){
    //             alert('에러 발생! DB에 문제가 생겼습니다.');
    //         }else{
    //             setQList(res);
    //         }
    //     })
    // },[])

    useEffect(()=>{
        setCaList(categoryList);
    },[categoryList])

    //번호 클릭할때마다 스크롤 최상단으로 이동
    function ChangeCategoryNum(num){
        setCurrentNum(num);
        document.documentElement.scrollTop = 0;
    }

    async function LoadList(){
        const res = await axios.post(process.env.REACT_APP_API+"/survey/question",{index:index});
        return res.data;
    }

    return(
        <div className="review-category">
            {caList != null && <>
                <Pagination numbers={caList} setNum={ChangeCategoryNum} currentNum={currentNum}/>
                <div className="sect-01">
                    {caList.map((item,idx)=>(item.ca_id == currentNum &&
                        <div className="cont-01" key={idx}>
                            <p className="ca-nm">{item.ca_id}. {item.ca_name} ({item.ca_name_en})</p>
                            <QuestionForm index={index} caId={currentNum}/>
                        </div>
                    ))}
                </div>
            </>}
        </div>

    )
}

const Pagination = ({numbers, setNum, currentNum}) => {
    function clickNum(num){
        setNum(num);
    }
    return(
        <div className="pagination">
            <ul><li>카테고리 번호 : </li> {numbers.map((el,idx) => <li className={idx == currentNum ? "active" : null} key={idx} onClick={()=>clickNum(idx)}>{idx}</li>)} </ul>
        </div>
    )
}

export default CategoryForm