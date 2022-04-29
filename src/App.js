/**
*@title 최상단 컴포넌트
*@date 2022-03-23
*@author 홍수희
*@desc
*@etc(change)
*/
import React, {useState} from 'react'
import { Route, Router, Switch, Redirect } from 'react-router-dom';

import Main from './Main';

import create from './create/CreateMain.js';
import metaData from './create/InsertSurveyMetaData.js';
import check from './create/CheckSurvey.js';

import review from './review/ReviewMain.js';
import reviewSurvey from './review/survey/ReviewSurvey.js';

function App(){

    return(
        <div className="app">
            <Switch>
                <Route path="/" component={Main} exact={true}/>
                <Route path="/create" component={create} exact={true}/>
                <Route path="/create/metaData/:filename" component={metaData} exact={true}/>
                <Route path="/create/check/:fileIndex" component={check} exact={true}/>
                <Route path="/review" component={review} exact={true}/>
                <Route path="/review/survey/:srindex" component={reviewSurvey} exact={true}/>
            </Switch>
            {/*<Switch>*/}
            {/*    <Route path="/" component={tmp} exact={true}/>*/}
            {/*    <Route path="/tmp/00" component={CA00} exact={true}/>*/}
            {/*    <Route path="/tmp/00/:applyNum" component={CA00}/>*/}
            {/*    <Route path="/tmp/01/:applyNum" component={CA01}/>*/}
            {/*</Switch>*/}
            {/*<Switch>*/}
            {/*    <Route path="/" component={Main} exact={true}/>*/}
            {/*    <PrivateRoute path="/admin" component={AdminMain} exact={true}/>*/}
            {/*    <PrivateRoute path="/survey" component={SurveyMain} exact={true}/>*/}
            {/*    <PrivateRoute path="/survey/question" component={Qtype01} exact={true}/>*/}
            {/*    <PrivateRoute path="/survey/edit" component={edit} exact={true}/>*/}
            {/*    <PrivateRoute path="/survey/make" component={make} exact={true}/>*/}
            {/*    <PrivateRoute path="/survey/answer" component={answer} exact={true}/>*/}
            {/*</Switch>*/}
            {/*<Route path="/" component={Main} exact={true}/>*/}
            {/*<Route path="/admin" component={AdminMain} exact={true}/>*/}
            {/*<Route path="/survey" component={SurveyMain} exact={true}/>*/}
            {/*<Route path="/survey/question" component={Qtype01} exact={true}/>*/}
            {/*<Route path="/survey/edit" component={edit} exact={true}/>*/}
            {/*<Route path="/survey/make" component={make} exact={true}/>*/}
            {/*<Route path="/survey/answer" component={answer} exact={true}/>*/}
        </div>
    )
}

const PrivateRoute = ({component: Component, ...props}) => {
    const [isLogin,setIsLogin] = useState(false);
    if(sessionStorage.getItem('id') == null){
        setIsLogin(false);
    }else{
        setIsLogin(true);
    }
    return(
        <Route {...props} render={(props) => (
            isLogin? <Component {...props}/> : <Redirect to = "/"/>
        )}/>
    );
}


export default App;
