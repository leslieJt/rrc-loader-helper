/**
 * cpopy https://github.com/tj/co/blob/717b043371ba057cb7a4a2a4e47120d598116ed7/index.js#L210
 */
import { takeLatest, put } from 'redux-saga/effects';

import { editInSaga } from '../actions';

function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

const cacheMap = new Map();

export default function genSagas(obj, page, ctx) {
  function newInputFactory(fn) {
    return function newPut(action) {
      return put({
        type: editInSaga,
        page,
        fromMethod: fn.name,
        fn: action,
      });
    };
  }

  if (!cacheMap.get(page)) {
    const keys = Object.keys(obj);
    const result = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (isGeneratorFunction(obj[key])) {
        result[`${page}/${key}`] = obj[key];
      }
    }
    if (Object.keys(result).length === 0) return null;
    cacheMap.set(page, function* generatedSaga() {
      const keys = Object.keys(result);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const fn = result[key];
        yield takeLatest(key, function* (action) {
          yield* fn(action, ctx, newInputFactory(fn));
        });
      }
    });
  }
  return cacheMap.get(page);
}
