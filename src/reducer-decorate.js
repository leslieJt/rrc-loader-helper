import produce from 'immer';
import { sendError } from 'sheinq';
import theAction from './actions';
import {
  setValKeyPath,
} from './util/obj_key_path_ops';

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
          try{
            return fn[action.type](draft , action);
          }catch(e){
            sendError(e);
            console.error('It"s called by rrc-loader-helper:' + e);
            return state;
          }
        })
      }
      if (action.type === theAction) {
        if (action.page === page) {
          return setValKeyPath(state, action.key.split('.'), action.value);
        }
      }
      return state;
    }
  }
  return function (state, action) {
    if (action.type === theAction) {
      if (action.page === page) {
        return setValKeyPath(state, action.key.split('.'), action.value);
      }
      return state;
    }
    try{
      return fn(state, action);
    }catch(e){
      sendError(e);
      console.error('It"s called by rrc-loader-helper:' + e);
      return state;
    }
  }
}
