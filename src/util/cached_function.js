import action, {
  loadDataDone,
  toggleLoading,
} from '../actions';
import {
  getStore
} from '../inj-dispatch';
import {
  reverseMappingVal
} from './mapping';
import {
  setCallback
} from '../current-page';

const onChangeCache = new Map();
const connector = '*&*^*&';

setCallback(function () {
  onChangeCache.clear();
});

function onchangeWithMapping(e, page, val, disallow, mapping, originOnchange) {
  const store = getStore();
  let value = e;
  if (e && e.target) {
    value = e.target.value;
  }
  value = reverseMappingVal(value, mapping);
  if (!disallow(value)) {
    store.dispatch({
      type: action,
      page: page,
      key: val,
      value: value
    });
  }
  if (originOnchange) {
    originOnchange(e);
  }
}

function onchangeNoMapping(e, page, val, disallow, originOnchange) {
  const store = getStore();
  let value = e;
  if (e && e.target) {
    value = e.target.value;
  }
  if (!disallow(value)) {
    store.dispatch({
      type: action,
      page: page,
      key: val,
      value: value
    });
  }
  if (originOnchange) {
    originOnchange(e);
  }
}

function returnOk() {
  return false;
}

function getOnchangeFunction(page, val, disallow, mapping, originOnchange) {
  if (mapping) {
    return function onChange(e) {
      onchangeWithMapping(e, page, val, disallow, mapping, originOnchange);
    }
  } else {
    return function onChange(e) {
      onchangeNoMapping(e, page, val, disallow, originOnchange);
    }
  }
}

export default function getCachedOnchangeFunction(page, val, mapping, disallow, originOnchange) {
  if (disallow || originOnchange) {
    return getOnchangeFunction(page, val, disallow, mapping, originOnchange);
  }
  let cacheKey = [page, val].map(x => x.toString()).join(connector);
  if (mapping) {
    cacheKey += connector + JSON.stringify(mapping);
  }
  if (!onChangeCache.has(cacheKey)) {
    onChangeCache.set(cacheKey, getOnchangeFunction(page, val, returnOk, mapping));
  }
  return onChangeCache.get(cacheKey);
}

export function getLoadDataOnClick(page, {
  fn, arg = [], loadings,
}) {
  return function loadDataOnClick() {
    const store = getStore();
    if (loadings) {
      store.dispatch({
        type: toggleLoading,
        page: page,
        loadings,
      });
    }
    // @TODO when & where to handle error
    fn(...arg).then(data => {
      if (typeof data === 'object' && !Array.isArray(data)) {
        store.dispatch({
          type: loadDataDone,
          page: page,
          data,
          loadings: loadings || [],
        });
      } else {
        store.dispatch({
          type: loadDataDone,
          page: page,
          data: {
            data,
          },
          loadings: loadings || [],
        });
      }
    });
  }
}
