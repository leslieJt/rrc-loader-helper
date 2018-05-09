import theAction from './actions';

function updateInKeyPath(obj, keys, val) {
  var res = Object.assign({}, obj);
  if (keys.length === 1) {
    res[keys[0]] = val;
    return res;
  }
  res[keys[0]] = updateInKeyPath(obj[keys[0]], keys.slice(1), val);
  return res;
}

module.exports = function decorateFn(fn, page) {
  return function (state, action) {
    if (action.type === theAction) {
      if (action.page === page) {
        return updateInKeyPath(state, action.key.split('.'), action.value);
      }
      return state;
    }
    return fn(state, action);
  };
};