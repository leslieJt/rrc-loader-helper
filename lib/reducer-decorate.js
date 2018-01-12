var theAction = require('./actions');

function updateInKeyPath(obj, keys, val) {
  if (keys.length === 1) {
    return Object.assign({}, obj, {
      [keys[0]]: val,
    });
  }
  return Object.assign({}, obj, {
    [keys[0]]: updateInKeyPath(obj[keys[0]], keys.slice(1), val),
  });
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
  }
};