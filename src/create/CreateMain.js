/**
*@title 설문지 제작 페이지 메인
*@date 2022-03-23
*@author 홍수희
*@desc
*@etc(change)
*/

import React,{ useState,useEffect } from 'react';
import axios from 'axios';

import './createMain.css';

const CreateMain = () => {
    const [uploadfile,setUploadFile] = useState(null);

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
        console.log(res.data);
    }

    async function test(){
        const res = await axios.post(process.env.REACT_APP_API+"/file/log");
        console.log(res.data);
    }
    return(
        <div>
            <div>설문지 제작하기</div>
            <div>
                마스터 파일 업로드
                <div>
                    <input type="file" onChange={e=>FileInputHandler(e)} accept=".xlsx"/>
                </div>
                <div>
                    <button onClick={FileUploadHandler}>upload</button>
                </div>
                <div>
                    <FileList/>
                </div>
            </div>
            <div><button onClick={test}>test</button></div>
        </div>
    )
}

const FileList = () => {
    const [fileList,setFileList] = useState(null);
    const [selectFile,setSelectFile] = useState(null);
    useState(()=>{
        LoadFile();
    },[])

    function FileClickHandler(item){
        setSelectFile(item);
    }

    async function FileDeleteHandler(){
        const res = await axios.post(process.env.REACT_APP_API+'/file/delete',{filename:selectFile,editor:'test1'});
        if(res.data == '-1'){

        }else{

        }
    }

    async function FileNameChangeHandler(){
        const res = await axios.post(process.env.REACT_APP_API+'/file/changeName',);

    }

    function RefreshFileListHandler(){
        LoadFile();
    }

    async function LoadFile(){
        const res = await axios.post(process.env.REACT_APP_API+"/file/print");
        console.log(res.data);
        if(res.data != '-1'){
            setFileList(res.data);
        }
    }

    return(
        <div className="file-list-wrap">
            {fileList != null &&
                <div>
                    <button onClick={RefreshFileListHandler}>새로고침</button>
                    <ul>{fileList.map((item,idx)=>(
                        <li key={idx} onClick={()=>FileClickHandler(item)}>{item}</li>
                    ))}</ul>
                </div>
            }
            {selectFile != null &&
                <div>
                    {selectFile}
                    <div>
                        <button>파일 삭제</button>
                        {/*<button>파일명 수정</button>*/}
                    </div>
                </div>
            }
            {selectFile != null && <button>설문지 생성</button>}
        </div>
    )
}

const FileInOutLog = () => {

    return(
        <div>

        </div>
    )
}

export default CreateMain;