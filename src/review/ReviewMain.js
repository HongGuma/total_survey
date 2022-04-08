/**
*@title 설문지 수정 및 확인 페이지 메인
*@date 2022-04-08
*@author 홍수희
*@desc 완성된 설문지 확인하고 수정하는 페이지 메인
*@etc(change)
*/

import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import ShowMetaData from './ShowMetaData.js';
import '../css/edit/editMain.css';

const ReviewMain = () => {
    const history = useHistory();
    const [tagData,setTagData] = useState(null);
    const [selectTag,setSelectTag] = useState(1);

    useEffect(()=>{
        LoadSurveyTag().then(res=>{
            if(res == '-1'){
                alert('에러 발생. 서버 이상');
            }else if(res == '-2'){
                alert('에러 발생. DB 이상');
            }else{
                setTagData(res);
            }
        })
    },[])

    async function LoadSurveyTag(){
        const res = await axios.post(process.env.REACT_APP_API+"/data/srtag");
        return res.data;
    }
    function SelectTag(e){
        const {name,value} = e.target;
        setSelectTag(value);
    }
    function GoBack(){
        history.push('/');
    }

    return(
        <div className="edit-main">
            <div> <button onClick={GoBack}>뒤로가기</button></div>
            <h1 style={{textAlign:"center"}}>설문지 확인하기</h1>
            <div className="select-wrap">
                {tagData != null &&
                    <select onChange={e=>SelectTag(e)}>
                        {tagData.map((tag,idx)=>(
                            <option key={idx} value={tag.id}>{tag.tag_name}</option>
                        ))}
                    </select>
                }
            </div>
            <ShowMetaData tag={selectTag}/>
        </div>
    )
}

export default ReviewMain;
