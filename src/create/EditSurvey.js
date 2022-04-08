/**
*@title 설문지 수정하는 페이지
*@date 2022-04-04
*@author 홍수희
*@desc 설문지 수정 페이지, 메타 데이터 새로 생성할 필요 없음
*@etc(change)
*/
import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

const EditSurvey = () => {
    return(
        <div>
            <div>설문지 이름 입력 : <input type="text"/></div>
            <div>설문지 index 입력 : <input type="text"/></div>
        </div>
    )
}

export default EditSurvey;