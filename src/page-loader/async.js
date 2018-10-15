import reduceReducers from 'reduce-reducers';
import {
  updateSaga
} from '../actions';
import enhanceReducer, { registeredReducers } from '../reducer-decorate';
import { getStore } from '../inj-dispatch';

import { combineReducers } from 'redux';

// @TODO is is ok?
function asyncPageCallback(module, page, reducers) {
  const { view, reducer, saga } = module;
  const store = getStore();
  store.dispatch({ type: updateSaga, saga: saga });
  if (!reducers[page]) {
    reducers[page] = enhanceReducer(reducer, page);
    store.replaceReducer(reduceReducers(...registeredReducers, combineReducers(reducers)));
  }
  return view;
}

export default asyncPageCallback;
