import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { reducer } from 'redux-form';
import { Provider } from 'react-redux';
import App from './App';

const container = document.createElement('div');
const store = createStore(
  combineReducers({
    form: reducer,
  }),
);

document.body.appendChild(container);
render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
);
