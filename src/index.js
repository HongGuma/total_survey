import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

import { Provider } from 'react-redux';
// import store from './store/store.js';


ReactDOM.render(
    // <Provider store={store}>
        <Root />,document.getElementById('root')
    // </Provider>, document.getElementById('root')
);

