import produce from 'immer';
import { sendError } from 'sheinq';
import theAction, {
  toggleLoading, loadDataDone,
} from './actions';
import {
  setValKeyPath,
} from './util/obj_key_path_ops';

function builtinReducer(state, action, page) {
  if (action.page !== page) return null;
  switch (action.type) {
    case theAction:
      return setValKeyPath(state, action.key.split('.'), action.value);
    case toggleLoading:
      return action.loadings.reduce((acc, cur) => setValKeyPath(acc, cur.split('.'), true), state);
    case loadDataDone:
      return action.loadings.reduce((acc, cur) => setValKeyPath(acc, cur.split('.'), false),
        Object.assign({}, state, action.data));
    default:
      return null;
  }
}

export default function decorateFn(fn, page) {
  if (typeof fn !== 'function' && typeof fn === 'object') {
    if (!(fn.defaultState)) {
      if (process.env.NODE_ENV !== 'production') {
        const err = new Error('required property defaultState in reducer \n' +
          ' reducer 对象缺少 defaultState 属性\n' +
          `位置位于${page}所属的reducer`);
        throw err;
      } else {
        fn.defaultState = {};
      }
    }
    /**
     * reducer 为对象的时候包装为immer处理方式
     * 对象内 defaultState 为必须属性
     */
    return function (state = fn.defaultState, action) {
      if (fn.hasOwnProperty(action.type) && typeof fn[action.type] === 'function') {
        return produce(state, draft => {
          try {
            return fn[action.type](draft, action);
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              throw e;
            }
            console.error('It"s called by rrc-loader-helper:' + e);
            sendError(e);
            return state;
          }
        })
      }
      const builtinState = builtinReducer(state, action, page);
      if (builtinState) return builtinState;
      return state;
    }
  }
  return function (state, action) {
    const builtinState = builtinReducer(state, action, page);
    if (builtinState) return builtinState;
    try {
      return fn(state, action);
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        throw e;
      }
      console.error('It"s called by rrc-loader-helper:' + e);
      sendError(e);
      return state;
    }
  }
}
