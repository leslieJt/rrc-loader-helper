import action from '../actions';
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

function onchangeWithMapping(e, page, val, disallow, mapping) {
  const store = getStore();
  let value = e;
  if (e && e.target) {
    value =  e.target.value;
  }
  value = reverseMappingVal(value, mapping);
  if (disallow(value)) {
    store.dispatch({
      type: action,
      page: page,
      key: val,
      value: value
    });
  }
}

function onchangeNoMapping(e, page, val, disallow) {
  const store = getStore();
  let value = e;
  if (e && e.target) {
    value =  e.target.value;
  }
  if (disallow(value)) {
    store.dispatch({
      type: action,
      page: page,
      key: val,
      value: value
    });
  }
}

function returnTrue() {
  return false;
}

function getOnchangeFunction(page, val, disallow, mapping) {
  if (mapping) {
    return function onChange(e) {
      onchangeWithMapping(e, page, val, disallow, mapping);
    }
  } else {
    return function onChange(e) {
      onchangeNoMapping(e, page, val, disallow);
    }
  }
}

export default function getCachedOnchangeFunction(page, val, mapping, disallow) {
  if (disallow) {
    return getOnchangeFunction(page, val, disallow, mapping);
  }
  let cacheKey = [page, val].map(x => x.toString()).join(connector);
  if (mapping) {
    cacheKey += connector + JSON.stringify(mapping);
  }
  if (!onChangeCache.has(cacheKey)) {
    onChangeCache.set(cacheKey, getOnchangeFunction(page, val, returnTrue, mapping));
  }
  return onChangeCache.get(cacheKey);
}