/**
 *@title 최상단 컴포넌트
 *@date 2022-03-23
 *@author 홍수희
 *@desc
 *@etc(change)
 */
import React, { useState } from "react";
import { Route, Router, Switch, Redirect } from "react-router-dom";

import Main from "./Main";

import create from "./create/CreateMain.js";
import metaData from "./create/InsertSurveyMetaData.js";
import check from "./create/CheckSurvey.js";

import review from "./review/ReviewMain.js";
import reviewSurvey from "./review/survey/ReviewSurvey.js";

function App() {
  return (
    <div className="app">
      <Switch>
        <Route path="/" component={Main} exact={true} />
        <Route path="/create" component={create} exact={true} />
        <Route
          path="/create/metaData/:filename"
          component={metaData}
          exact={true}
        />
        <Route path="/create/check/:fileIndex" component={check} exact={true} />
        <Route path="/review" component={review} exact={true} />
        <Route
          path="/review/survey/:srindex"
          component={reviewSurvey}
          exact={true}
        />
      </Switch>
    </div>
  );
}

export default App;
