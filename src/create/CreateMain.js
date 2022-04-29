/**
*@title 설문지 제작 페이지 메인
*@date 2022-03-23
*@author 홍수희
*@desc
*@etc(change)
*/

import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";

import '../css/create/createMain.css';

const CreateMain = () => {
    var history = useHistory();
    const [uploadfile,setUploadFile] = useState(null);
    const [logToggle,setLogToggle] = useState(false);

    function FileInputHandler(e){
        const file = e.target.files;
        setUploadFile(file);
    }

    async function FileUploadHandler(){
        const formData = new FormData();
        formData.append("file",uploadfile[0]);
        formData.append("editor","test admin");
        formData.append("originalName",uploadfile[0].name);
        const res = await axios.post(process.env.REACT_APP_API+"/file/upload",formData,{headers : {"Content-Type": "multipart/form-data"}});
        if(res == '-1'){
            alert('업로드 실패. 서버에 문제가 생겼습니다.');
        }else{
            alert('업로드 완료. 새로고침을 눌러주세요.');
        }
    }

    function ClickLogShowHandler(){
        setLogToggle(!logToggle);
    }

    function MoveBack(){
        history.push('/');
    }
    return(
        <div className="create-main">
            <div><button style={{float:"left"}} onClick={MoveBack}>뒤로가기</button></div>
            <h1>설문지 제작하기</h1>
            {/*<div>*/}
            {/*    <button>설문지 수정하기</button>*/}
            {/*</div>*/}
            <div className="sect-01">
                <div className="sect-01-cont-01">
                    <p>마스터 파일 업로드 :</p>
                    <input type="file" onChange={e=>FileInputHandler(e)} accept=".xlsx"/>
                    <button onClick={FileUploadHandler}>upload</button>
                </div>
                <div className="sect-01-cont-02">
                    <FileList/>
                </div>
            </div>
            <div className="sect-02" onClick={ClickLogShowHandler}>
                {logToggle ? <p> log hide </p> : <p>log show</p>}
            </div>
            {logToggle && <FileInOutLog/> }
        </div>
    )
}

const FileList = () => {
    var history = useHistory();
    const [fileList,setFileList] = useState(null);
    const [selectFile,setSelectFile] = useState(null);
    useState(()=>{
        LoadFile();
    },[])

    function FileClickHandler(item){
        setSelectFile(item);
    }

    async function FileNameChangeHandler(){
        const res = await axios.post(process.env.REACT_APP_API+'/file/changeName',);
    }

    function RefreshFileListHandler(){
        LoadFile();
        setSelectFile(null);
    }

    async function LoadFile(){
        const res = await axios.post(process.env.REACT_APP_API+"/file/print");
        // console.log(res.data);
        if(res.data != '-1'){
            setFileList(res.data);
        }
    }

    async function FileDeleteHandler(){
        const res = await axios.post(process.env.REACT_APP_API+"/file/delete", {filename:selectFile,editor:'test1'});
        // console.log(res.data);
        if(res.data == '0'){
            RefreshFileListHandler();
        }else{
            alert('삭제 실패, DB에 문제가 생겼습니다.');
        }
    }

    function MoveNext(){
        history.push('/create/metaData/'+selectFile);
    }

    return(
        <div className="file-list-wrap">
            {fileList != null &&
                <div className="sect-01">
                    <button onClick={RefreshFileListHandler}>새로고침</button>
                    <ul>{fileList.map((item,idx)=>(
                        <li key={idx} onClick={()=>FileClickHandler(item)}>{item}</li>
                    ))}</ul>
                </div>
            }
            {selectFile != null &&
                <div className="sect-02">
                    <p>선택한 파일 : {selectFile}</p>
                    <div className="sect-02-cont-01">
                        <button onClick={FileDeleteHandler}>파일 삭제</button>
                        <button onClick={MoveNext}>설문지 생성</button>
                    </div>
                </div>
            }
        </div>
    )
}

const FileInOutLog = () => {
    const [logList,setLogList] = useState(null);
    useEffect(()=>{
        loadLog().then(res=>{
            // console.log(res);
            if(res.data == '-1'){
                setLogList(null);
            }else{
                setLogList(res);
            }
        })
    },[])
    async function loadLog(){
        const res = await axios.post(process.env.REACT_APP_API+"/file/log");
        return res.data;
    }
    return(
        <div className="log-wrap">
            <table>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>파일명</th>
                    <th>상태</th>
                    <th>수정자</th>
                    <th>일시</th>
                </tr>
                </thead>
                <tbody>
                {logList != null &&
                    logList.map((log,idx)=>(
                        <tr key={idx}>
                            <td>{log.log_no}</td>
                            <td>{log.file_name}</td>
                            <td>{log.state}</td>
                            <td>{log.editor}</td>
                            <td>{log.reg_dt.slice(0,4)}-{log.reg_dt.slice(4,6)}-{log.reg_dt.slice(6,8)} {log.reg_dt.slice(8,10)}:{log.reg_dt.slice(10,12)}:{log.reg_dt.slice(12,14)}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    )
}

export default CreateMain;