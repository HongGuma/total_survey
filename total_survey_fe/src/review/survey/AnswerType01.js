/**
 *@title
 *@date 2022-04-12
 *@author 홍수희
 *@desc
 *@etc(change)
 */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AnswerType01 = ({ index }) => {
  return (
    <div>
      <input type="radio" />
      답변
    </div>
  );
};

export default AnswerType01;
