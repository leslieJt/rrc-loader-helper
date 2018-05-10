import produce from 'immer';
import theAction from './actions';
import {
  setValKeyPath,
} from './util/obj_key_path_ops';

export default function decorateFn(fn, page) {
  return function (state, action) {
    if (action.type === theAction) {
      if (action.page === page) {
        return setValKeyPath(state, action.key.split('.'), action.value);
      }
      return state;
    }
    /**
     * reducer 为对象的时候包装为immer处理方式
     * 对象内 defaultState 为必须属性
     */
    if (typeof fn !== 'function') {
      const defaultState = fn.defaultState || {};
      const func = fn[action.type];
      if (func) {
        if (!(fn.defaultState)) { console.error('required property defaultState in reducer \n reducer 对象缺少 defaultState 属性'); }
        return produce(defaultState, draft => {
          func(draft , action);
        })
      }
      return defaultState;
    }

    return fn(state, action);
  }
}
