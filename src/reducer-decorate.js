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
    return fn(state, action);
  }
}
