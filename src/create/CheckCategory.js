/**
*@title 카테고리 확인하기
*@date 2022-04-06 
*@author 홍수희
*@desc 추출된 카테고리 출력하는 컴포넌트
*@etc(change)
*/
import React,{ useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";

import CheckQuestion from './CheckQuestion.js';


const CheckCategory = ({data,qList,saList}) => {
    const [categoryList,setCategoryList] = useState(data); //전체 카테고리 리스트 (완전한 상태) - 텍스트만
    const [currentNum,setCurrentNum] = useState(0); //현재 보여지는 카테고리 (분할된 상태)
    const nextIdx = currentNum * 1; //다음 카테고리 번호
    const prevIdx = nextIdx - 1; //이전 카테고리 번호
    const [scrollY,setScrollY] = useState(0);

    function ChangeCategoryNum(num){
        setCurrentNum(num);
        document.documentElement.scrollTop = 0;
    }

    return(
        <div className="check-category">
            {categoryList != null && <>
                <Pagination numbers={categoryList} setNum={ChangeCategoryNum}/>
                <div className="sect-01">
                    {categoryList.map((item,idx)=>(item.id == currentNum &&
                        <div className="sect-01-cont-01" key={idx}>
                            <p className="category">{item.id}. {item.ca_kr} ({item.ca_en})</p>
                            <CheckQuestion data = {qList} caId={currentNum} saList={saList}/>
                        </div>
                    ))}
                </div>
                <Pagination numbers={categoryList} setNum={ChangeCategoryNum}/>
            </>}
        </div>
    )
}

const Pagination = ({numbers, setNum}) => {
    function clickNum(num){
        setNum(num);
    }
    return(
        <div className="pagination">
            <ul>{numbers.map((el,idx) => <li key={idx} onClick={()=>clickNum(idx)}>{idx}</li>)}</ul>
        </div>
    )
}

export default CheckCategory;