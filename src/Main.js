/**
*@title Main
*@date 2022-03-23
*@author 홍수희
*@desc
*@etc(change)
*/

import React from 'react';
import { useHistory } from "react-router-dom";

const Main = () => {
    var history = useHistory();

    function MoveCreatePage(){
        history.push('/create');
    }

    return (
        <div>
            <div>welcom react</div>
            <div onClick={MoveCreatePage}>설문지 만들기</div>
        </div>
    )
}

export default Main;