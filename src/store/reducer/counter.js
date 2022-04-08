import { INCREMENT, DECREMENT } from '../action/counter.js';
import { combineReducers } from 'redux';

export const INIT_COUNT_STATE = {
    counter: 0
};

function counter (state = INIT_COUNT_STATE, action) {
    switch(action.type) {
        case INCREMENT:
            return {
                ...state,
                value: state.value + 1
            }
        case DECREMENT:
            return {
                ...state,
                value: state.value - 1
            }
        default:
            return state
    }
}

const counterReducer = combineReducers({ counter });

export default counterReducer